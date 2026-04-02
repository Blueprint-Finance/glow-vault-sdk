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

import { translateAddress, BN } from '@coral-xyz/anchor';
import type { Address, Program } from '@coral-xyz/anchor';
import type { Connection, TransactionInstruction } from '@solana/web3.js';
import type { GlowVault } from './idls/glow_vault';
import type { Vault } from './state';

import {
    deriveEpochTracker,
    deriveVaultPendingDeposits,
    deriveVaultPendingDepositsCustody,
    deriveVaultPendingWithdrawals,
    deriveVaultPendingWithdrawalsCustody,
    deriveVaultShareMint,
    deriveVaultUser,
} from './pda';
import { findDerivedAccount } from './utils';

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
            epochTracker: resolveEpochTracker(vault),
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
                epochTracker: resolveEpochTracker(vault),
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

const DEPOSIT_TIME_LOCK_ENABLED = 1 << 4;
const EPOCH_WITHDRAWALS = 1 << 5;

/**
 * Resolve the epoch tracker PDA if the vault uses epoch-based withdrawals.
 * Returns the derived address when the EPOCH_WITHDRAWALS flag is set, null otherwise.
 */
function resolveEpochTracker(vault: Vault): PublicKey | null {
    return (Number(vault.account.flags) & EPOCH_WITHDRAWALS) !== 0 ? deriveEpochTracker(vault.address) : null;
}

/**
 * Deposit from a wallet into a transferable vault.
 *
 * Inspects the on-chain vault flags to determine whether deposits are time-locked.
 * - Non-locked: shares are minted directly to the depositor's wallet ATA.
 * - Locked: shares are escrowed in the vault's pending deposits custody account.
 *   The depositor must later call `withClaimDepositedShares` to claim them.
 */
export async function withTransferableVaultDeposit({
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
    const vaultAccount = await program.account.vault.fetch(vault.address);
    const depositLockPeriod =
        (vaultAccount as { depositDeliveryLockPeriod?: BN }).depositDeliveryLockPeriod ??
        (vaultAccount as { deposit_delivery_lock_period?: BN }).deposit_delivery_lock_period;
    const isLocked =
        (Number(vaultAccount.flags) & DEPOSIT_TIME_LOCK_ENABLED) !== 0 &&
        depositLockPeriod != null &&
        !depositLockPeriod.isZero();

    const shareMint = deriveVaultShareMint(vault.address);

    if (vault.account.underlyingMint.equals(NATIVE_MINT)) {
        wrapSol(depositor, amount, instructions);
    }

    let shareTokenAccount: PublicKey | null = null;
    const pendingDeposits = deriveVaultPendingDeposits(vault.address, depositor);
    const vaultPendingDepositsCustody = deriveVaultPendingDepositsCustody(vault.address);

    if (isLocked) {
        // Leave shareTokenAccount null; program will use pendingDeposits and custody
    } else {
        shareTokenAccount = deriveTransferableShareTokenAccount(vault, depositor);
        const shareTokenAccountInfo = await program.provider.connection.getAccountInfo(shareTokenAccount);
        if (!shareTokenAccountInfo) {
            instructions.push(
                createAssociatedTokenAccountIdempotentInstruction(
                    depositor,
                    shareTokenAccount,
                    depositor,
                    shareMint,
                    TOKEN_2022_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                ),
            );
        }
    }

    await withUpdateVaultBalances({
        program,
        instructions,
        vault,
    });

    instructions.push(
        await program.methods
            .depositToTransferableVault({
                kind: { shiftBy: {} },
                tokens: amount,
            })
            .accountsPartial({
                payer: depositor,
                depositor,
                vault: vault.address,
                shareMint,
                underlyingMint: vault.account.underlyingMint,
                depositorUnderlyingTokenAccount: deriveAssociatedTokenAddress(
                    vault.account.underlyingMint,
                    vault.account.underlyingMintTokenProgram,
                    depositor,
                ),
                shareTokenAccount: shareTokenAccount ?? SystemProgram.programId,
                pendingDeposits,
                vaultPendingDepositsCustody,
                underlyingMintTokenProgram: vault.account.underlyingMintTokenProgram,
                shareTokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .instruction(),
    );
}

/**
 * Claim escrowed shares from a time-locked deposit after the delivery lock expires.
 *
 * Only applicable to transferable vaults with DEPOSIT_TIME_LOCK_ENABLED.
 */
export async function withClaimDepositedShares({
    program,
    vault,
    depositor,
    instructions,
    depositIndex,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    depositor: PublicKey;
    instructions: TransactionInstruction[];
    depositIndex: number;
}) {
    const shareMint = deriveVaultShareMint(vault.address);
    const shareTokenAccount = deriveTransferableShareTokenAccount(vault, depositor);
    const pendingDepositsAddress = deriveVaultPendingDeposits(vault.address, depositor);

    const shareTokenAccountInfo = await program.provider.connection.getAccountInfo(shareTokenAccount);
    if (!shareTokenAccountInfo) {
        instructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
                depositor,
                shareTokenAccount,
                depositor,
                shareMint,
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
        );
    }

    const pendingDepositsAccount = await program.account.pendingDeposits.fetch(pendingDepositsAddress);
    const slotShares = pendingDepositsAccount.deposits[depositIndex]?.pendingShares;
    const willBeEmpty = slotShares && pendingDepositsAccount.totalPendingShares.sub(slotShares).isZero();

    instructions.push(
        await program.methods
            .claimDepositedShares(depositIndex)
            .accountsPartial({
                depositor,
                vault: vault.address,
                pendingDeposits: pendingDepositsAddress,
                shareMint,
                shareTokenAccount,
                vaultPendingDepositsCustody: deriveVaultPendingDepositsCustody(vault.address),
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .instruction(),
    );

    if (willBeEmpty) {
        await withClosePendingDeposits({ program, vault, depositor, instructions });
    }
}

/**
 * Initiate a withdrawal from a transferable vault, automatically sourcing
 * shares from the wallet and/or deposit custody as needed.
 *
 * - Shares already in the wallet are withdrawn first via
 *   `withInitiateTransferableVaultWithdrawal`.
 * - Any remaining amount is pulled from locked deposit custody slots
 *   (oldest first) via `withInitiateTransferableWithdrawalFromCustody`.
 */
export async function withInitiateTransferableWithdrawal({
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
    const shareAta = deriveTransferableShareTokenAccount(vault, withdrawer);
    const ataInfo = await connection.getTokenAccountBalance(shareAta).catch(() => null);
    const walletShares = ataInfo ? new BN(ataInfo.value.amount) : new BN(0);

    if (walletShares.gte(amount)) {
        await withInitiateTransferableVaultWithdrawal({
            program,
            connection,
            vault,
            withdrawer,
            instructions,
            amount,
        });
        return;
    }

    // Withdraw whatever is in the wallet first
    let remaining = amount;
    if (walletShares.gt(new BN(0))) {
        await withInitiateTransferableVaultWithdrawal({
            program,
            connection,
            vault,
            withdrawer,
            instructions,
            amount: walletShares,
        });
        remaining = remaining.sub(walletShares);
    }

    // Pull the rest from deposit custody slots, oldest first
    const pendingDepositsAddress = deriveVaultPendingDeposits(vault.address, withdrawer);
    const pendingDepositsAccount = await program.account.pendingDeposits.fetch(pendingDepositsAddress);

    for (let i = 0; i < pendingDepositsAccount.deposits.length && remaining.gt(new BN(0)); i++) {
        const slot = pendingDepositsAccount.deposits[i];
        if (!slot || slot.pendingShares.isZero()) continue;

        const toWithdraw = BN.min(remaining, slot.pendingShares);
        await withInitiateTransferableWithdrawalFromCustody({
            program,
            connection,
            vault,
            withdrawer,
            instructions,
            depositIndex: i,
            shares: toWithdraw,
        });
        remaining = remaining.sub(toWithdraw);
    }
}

/**
 * Initiate a withdrawal from a transferable vault.
 *
 * Shares are transferred from the user's wallet to the vault's pending
 * withdrawals custody account. The user must later call
 * `withExecuteTransferableVaultWithdrawal` after the waiting period.
 */
export async function withInitiateTransferableVaultWithdrawal({
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

    const pendingWithdrawals = deriveVaultPendingWithdrawals(vault.address, withdrawer);
    const pendingWithdrawalsAccount = await connection.getAccountInfo(pendingWithdrawals);
    if (!pendingWithdrawalsAccount) {
        await withCreateVaultPendingWithdrawal({
            program,
            vault,
            payer: withdrawer,
            withdrawer,
            instructions,
        });
    }

    instructions.push(
        await program.methods
            .initiateTransferableVaultWithdrawal(amount)
            .accountsPartial({
                withdrawer,
                vault: vault.address,
                pendingWithdrawals,
                shareMint: deriveVaultShareMint(vault.address),
                shareTokenAccount: deriveTransferableShareTokenAccount(vault, withdrawer),
                vaultPendingWithdrawalsCustody: deriveVaultPendingWithdrawalsCustody(vault.address),
                tokenProgram: TOKEN_2022_PROGRAM_ID,
                epochTracker: resolveEpochTracker(vault),
            })
            .instruction(),
    );
}

/**
 * Execute a pending withdrawal from a transferable vault.
 *
 * The destination ATA is created idempotently in case it was closed.
 */
export async function withExecuteTransferableVaultWithdrawal({
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
    await withUpdateVaultBalances({
        program,
        instructions,
        vault,
    });

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
            .executeTransferableVaultWithdrawal(withdrawalIndex)
            .accountsPartial({
                withdrawer,
                vault: vault.address,
                shareMint: deriveVaultShareMint(vault.address),
                underlyingMint: vault.account.underlyingMint,
                vaultPendingWithdrawalsCustody: deriveVaultPendingWithdrawalsCustody(vault.address),
                destinationUnderlyingTokenAccount: associatedTokenAccount,
                mintTokenProgram: TOKEN_2022_PROGRAM_ID,
                underlyingMintTokenProgram: vault.account.underlyingMintTokenProgram,
            })
            .instruction(),
    );
}

/**
 * Cancel a pending withdrawal from a transferable vault.
 *
 * Returns the escrowed shares to the user's wallet.
 */
export async function withCancelTransferableVaultPendingWithdrawal({
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

    instructions.push(
        await program.methods
            .cancelTransferableVaultPendingWithdrawal(withdrawalIndex)
            .accountsPartial({
                withdrawer: owner,
                vault: vault.address,
                shareMint: deriveVaultShareMint(vault.address),
                vaultPendingWithdrawalsCustody: deriveVaultPendingWithdrawalsCustody(vault.address),
                destinationShareTokenAccount: deriveTransferableShareTokenAccount(vault, owner),
                mintTokenProgram: TOKEN_2022_PROGRAM_ID,
                pendingDeposits: deriveVaultPendingDeposits(vault.address, owner),
                vaultPendingDepositsCustody: deriveVaultPendingDepositsCustody(vault.address),
                epochTracker: resolveEpochTracker(vault),
            })
            .instruction(),
    );
}

/**
 * Initiate a withdrawal directly from deposit custody (during lock-in period).
 *
 * Shares move from deposit custody to withdrawal custody. Auto-creates the
 * pending withdrawals account if it does not exist. Closes the pending deposits
 * account when no deposits remain.
 */
export async function withInitiateTransferableWithdrawalFromCustody({
    program,
    connection,
    vault,
    withdrawer,
    instructions,
    depositIndex,
    shares,
}: {
    program: Program<GlowVault>;
    connection: Connection;
    vault: Vault;
    withdrawer: PublicKey;
    instructions: TransactionInstruction[];
    depositIndex: number;
    shares: BN;
}) {
    await withUpdateVaultBalances({ program, instructions, vault });

    const pendingDepositsAddress = deriveVaultPendingDeposits(vault.address, withdrawer);
    const pendingWithdrawals = deriveVaultPendingWithdrawals(vault.address, withdrawer);
    const pendingWithdrawalsAccount = await connection.getAccountInfo(pendingWithdrawals);
    if (!pendingWithdrawalsAccount) {
        await withCreateVaultPendingWithdrawal({
            program,
            vault,
            payer: withdrawer,
            withdrawer,
            instructions,
        });
    }

    const pendingDepositsAccount = await program.account.pendingDeposits.fetch(pendingDepositsAddress);
    const willBeEmpty = pendingDepositsAccount.totalPendingShares.sub(shares).isZero();

    instructions.push(
        await program.methods
            .initiateTransferableWithdrawalFromCustody(depositIndex, shares)
            .accountsPartial({
                withdrawer,
                vault: vault.address,
                pendingWithdrawals,
                pendingDeposits: pendingDepositsAddress,
                shareMint: deriveVaultShareMint(vault.address),
                vaultPendingDepositsCustody: deriveVaultPendingDepositsCustody(vault.address),
                vaultPendingWithdrawalsCustody: deriveVaultPendingWithdrawalsCustody(vault.address),
                epochTracker: resolveEpochTracker(vault),
                tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .instruction(),
    );

    if (willBeEmpty) {
        await withClosePendingDeposits({ program, vault, depositor: withdrawer, instructions });
    }
}

/**
 * Close an empty pending deposits account and reclaim rent.
 */
export async function withClosePendingDeposits({
    program,
    vault,
    depositor,
    receiver,
    instructions,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    depositor: PublicKey;
    receiver?: PublicKey;
    instructions: TransactionInstruction[];
}) {
    instructions.push(
        await program.methods
            .closePendingDeposits()
            .accountsPartial({
                depositor,
                receiver: receiver ?? depositor,
                pendingDeposits: deriveVaultPendingDeposits(vault.address, depositor),
                vault: vault.address,
            })
            .instruction(),
    );
}

/**
 * Close an empty pending withdaawals account and reclaim rent.
 */
export async function withClosePendingWithdrawal({
    program,
    vault,
    withdrawer,
    receiver,
    instructions,
}: {
    program: Program<GlowVault>;
    vault: Vault;
    withdrawer: PublicKey;
    receiver?: PublicKey;
    instructions: TransactionInstruction[];
}) {
    instructions.push(
        await program.methods
            .closePendingWithdrawal()
            .accountsPartial({
                withdrawer,
                receiver: receiver ?? withdrawer,
                pendingWithdrawals: deriveVaultPendingWithdrawals(vault.address, withdrawer),
                vault: vault.address,
            })
            .instruction(),
    );
}

/**
 * Derive the share token ATA for a transferable vault user.
 * In transferable vaults, shares go directly to the user's wallet,
 * not to a VaultUser PDA.
 */
export function deriveTransferableShareTokenAccount(vault: Vault, owner: PublicKey): PublicKey {
    const shareMint = deriveVaultShareMint(vault.address);
    return deriveAssociatedTokenAddress(shareMint, TOKEN_2022_PROGRAM_ID, owner);
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
