/*
 * Copyright (C) 2026 A1 XYZ, INC.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountIdempotentInstruction,
    createSyncNativeInstruction,
    NATIVE_MINT,
    TOKEN_2022_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, SystemProgram } from '@solana/web3.js';

import { translateAddress } from '@coral-xyz/anchor';
import type { Address, BN, Program } from '@coral-xyz/anchor';
import type { Connection, TransactionInstruction } from '@solana/web3.js';
import type { GlowVault } from './idls/glow_vault';
import type { Vault } from './state';

import { deriveVaultPendingWithdrawals, deriveVaultShareMint, deriveVaultUser } from './pda';
import { findDerivedAccount } from './utils';

export * from './state';

/**
 * Derive the associated token address for a given mint, token program, and owner.
 */
function deriveAssociatedTokenAddress(mint: Address, tokenProgram: Address, owner: Address): PublicKey {
    const mintAddress = translateAddress(mint);
    const tokenProgramAddress = translateAddress(tokenProgram);
    const ownerAddress = translateAddress(owner);

    return findDerivedAccount(ASSOCIATED_TOKEN_PROGRAM_ID, ownerAddress, tokenProgramAddress, mintAddress);
}

interface Programs {
    connection: Connection;
    glowVault: Program<GlowVault>;
}

/**
 * Deposit from a wallet into the LRT pool.
 *
 * * The share tokens don't get sent to the depositor, instead we should create a VaultUser and ATA for it
 * * TODO: If the pool vault is SOL, we need to wrap it first
 *
 */
export async function withVaultWalletDeposit({
    program,
    vault,
    depositor,
    instructions,
    amount,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    depositor: PublicKey;
    instructions: TransactionInstruction[];
    amount: BN;
}) {
    const shareMint = deriveVaultShareMint(vault.address);
    // If the underlying mint is SOL, wrap tokens first
    if (vault.account.underlyingMint.equals(NATIVE_MINT)) {
        wrapSol(depositor, amount, instructions);
    }
    const vaultUser = deriveVaultUser(vault.address, depositor);
    const shareTokenAccount = deriveAssociatedTokenAddress(shareMint, TOKEN_2022_PROGRAM_ID, vaultUser);
    // Create the ATA if it doesn't exist
    const shareTokenAccountInfo = await program.provider.connection.getAccountInfo(shareTokenAccount);
    if (!shareTokenAccountInfo) {
        instructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
                depositor,
                shareTokenAccount,
                vaultUser,
                shareMint,
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
        );
    }
    await withUpdateVaultBalances({
        program,
        instructions,
        vault,
    });
    instructions.push(
        await program.methods
            .depositToVault({
                kind: { shiftBy: {} },
                tokens: amount,
            })
            .accountsPartial({
                payer: depositor,
                depositor,
                vault: vault.address,
                shareMint: shareMint,
                underlyingMint: vault.account.underlyingMint,
                depositorUnderlyingTokenAccount: deriveAssociatedTokenAddress(
                    vault.account.underlyingMint,
                    vault.account.underlyingMintTokenProgram,
                    depositor,
                ),
                shareTokenAccount,
                vaultUser,
                // @ts-expect-error - IDL out of sync?
                token2022Program: TOKEN_2022_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                underlyingMintTokenProgram: vault.account.underlyingMintTokenProgram,
                shareTokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .instruction(),
    );
}

/**
 * Create pending withdrawals for a wallet
 */
export async function withCreateVaultPendingWithdrawal({
    program,
    vault,
    payer,
    withdrawer,
    instructions,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    payer: PublicKey;
    withdrawer: PublicKey;
    instructions: TransactionInstruction[];
}) {
    instructions.push(
        await program.methods
            .createVaultPendingWithdrawal()
            .accountsPartial({
                payer,
                withdrawer,
                vault: vault.address,
            })
            .instruction(),
    );
}

/**
 * Initiate a vault withdrawal, supports wallets and margin accounts
 *
 * Only the tokens owned by the user are transferred to the vault for custody,
 * so we check whether they belong to the margin account or the vault user.
 */
export async function withInitiateVaultWithdrawal({
    program,
    connection,
    vault,
    withdrawer,
    instructions,
    amount,
}: {
    program: Program<GlowVault>;
    connection: Connection;
    vault: Vault;
    withdrawer: PublicKey;
    instructions: TransactionInstruction[];
    amount: BN;
}) {
    await withUpdateVaultBalances({
        program,
        instructions,
        vault,
    });
    // Check if the pending withdrawal account exists, and create it if not
    const pendingWithdrawals = deriveVaultPendingWithdrawals(vault.address, withdrawer);
    const pendingWithdrawalsAccount = await connection.getAccountInfo(pendingWithdrawals);
    if (!pendingWithdrawalsAccount) {
        await withCreateVaultPendingWithdrawal({
            program,
            vault,
            payer: withdrawer, // TODO: should be wallet for margin account
            withdrawer,
            instructions,
        });
    }
    const shareMint = deriveVaultShareMint(vault.address);
    const shareTokenAccount = deriveShareTokenAccount(vault, withdrawer, false);
    const vaultUser = deriveVaultUser(vault.address, withdrawer);
    const instruction = await program.methods
        .initiateVaultWithdrawal(amount)
        .accountsPartial({
            withdrawer,
            vault: vault.address,
            shareMint: shareMint,
            shareTokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            vaultUser,
        })
        .instruction();
    instructions.push(instruction);
}

/**
 * Executing a vault withdrawal transfers tokens to the withdrawer's token account.
 * We use an ATA for the frontend, but other users might want to pass their own account,
 * which we do not support here.
 *
 * The destination ATA might not exist, so it has to be created idempotently (or checked first).
 *
 * This instruction is not suitable for margin accounts, as a margin account invocation
 * has to transfer the withdrawn tokens to a margin pool if one exists (most likely).
 */
export async function withExecuteVaultWithdrawal({
    program,
    vault,
    withdrawer,
    instructions,
    withdrawalIndex,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    withdrawer: PublicKey;
    instructions: TransactionInstruction[];
    withdrawalIndex: number;
}) {
    // Create the ATA in case it was closed
    await withUpdateVaultBalances({
        program,
        instructions,
        vault,
    });
    const shareMint = deriveVaultShareMint(vault.address);
    const associatedTokenAccount = deriveAssociatedTokenAddress(
        vault.account.underlyingMint,
        vault.account.underlyingMintTokenProgram,
        withdrawer,
    );
    instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(
            withdrawer,
            associatedTokenAccount,
            withdrawer,
            vault.account.underlyingMint,
            vault.account.underlyingMintTokenProgram,
        ),
    );

    instructions.push(
        await program.methods
            .executeVaultWithdrawal(withdrawalIndex)
            .accountsPartial({
                withdrawer,
                vault: vault.address,
                shareMint: shareMint,
                underlyingMint: vault.account.underlyingMint,
                destinationUnderlyingTokenAccount: deriveAssociatedTokenAddress(
                    vault.account.underlyingMint,
                    vault.account.underlyingMintTokenProgram,
                    withdrawer,
                ),
                mintTokenProgram: TOKEN_2022_PROGRAM_ID,
                underlyingMintTokenProgram: vault.account.underlyingMintTokenProgram,
            })
            .instruction(),
    );
}

/**
 * Cancel a pending withdrawal. Works for both wallets and margin accounts.
 */
export async function withCancelVaultPendingWithdrawal({
    program,
    vault,
    owner,
    instructions,
    withdrawalIndex,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    owner: PublicKey;
    instructions: TransactionInstruction[];
    withdrawalIndex: number;
}) {
    await withUpdateVaultBalances({
        program,
        instructions,
        vault,
    });
    const vaultUser = deriveVaultUser(vault.address, owner);
    instructions.push(
        await program.methods
            .cancelVaultPendingWithdrawal(withdrawalIndex)
            .accountsPartial({
                withdrawer: owner,
                vault: vault.address,
                vaultUser,
                destinationShareTokenAccount: deriveShareTokenAccount(vault, owner, false),
                mintTokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .instruction(),
    );
}

export async function withUpdateVaultBalances({
    program,
    vault,
    instructions,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    instructions: TransactionInstruction[];
}): Promise<void> {
    instructions.push(
        await program.methods
            .updateVaultBalances()
            .accountsPartial({
                vault: vault.address,
            })
            .instruction(),
    );
}

/**
 * Derive the share token account where shares will be minted to
 */
function deriveShareTokenAccount(
    vault: Vault,
    withdrawer: PublicKey,
    isWithdrawerMarginAccount: boolean = false,
): PublicKey {
    const shareMint = deriveVaultShareMint(vault.address);
    const owner = isWithdrawerMarginAccount ? withdrawer : deriveVaultUser(vault.address, withdrawer);
    return deriveAssociatedTokenAddress(shareMint, TOKEN_2022_PROGRAM_ID, owner);
}

async function wrapSol(owner: PublicKey, amount: BN, instructions: TransactionInstruction[]) {
    const ownerWrappedSolAddress = deriveAssociatedTokenAddress(NATIVE_MINT, TOKEN_PROGRAM_ID, owner);
    instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(
            owner,
            ownerWrappedSolAddress,
            owner,
            NATIVE_MINT,
            TOKEN_PROGRAM_ID,
        ),
    );
    instructions.push(
        SystemProgram.transfer({
            fromPubkey: owner,
            toPubkey: ownerWrappedSolAddress,
            lamports: amount.toNumber(),
        }),
    );
    instructions.push(createSyncNativeInstruction(ownerWrappedSolAddress, TOKEN_PROGRAM_ID));
}
