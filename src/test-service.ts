/*
 * Copyright (C) 2026 A1 XYZ, INC.
 *
 * Helpers for the Glow devnet test-service program. Used to mint underlying
 * tokens of a vault (e.g. USDC) for testing. Only applicable on devnet where
 * the test-service is deployed.
 */

import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountIdempotentInstruction,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

import type { Vault } from './state';

/** Devnet test-service program ID. */
export const TEST_SERVICE_PROGRAM_ID = new PublicKey('test7JXXboKpc8hGTadvoXcFWN4xgnHLGANU92JKrwA');

const TOKEN_REQUEST_DISCRIMINATOR = new Uint8Array([98, 39, 56, 30, 213, 98, 108, 244]);

/**
 * Derive the token-info PDA for a mint in the test-service program.
 */
export function deriveTokenInfoPda(mint: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('token-info'), mint.toBuffer()],
        TEST_SERVICE_PROGRAM_ID,
    );
    return pda;
}

/**
 * Build the test-service token_request instruction. Mints underlying tokens
 * to the destination ATA. Only works on devnet where the test-service is deployed.
 */
export function buildTokenRequestInstruction(
    payer: PublicKey,
    requester: PublicKey,
    mint: PublicKey,
    tokenProgram: PublicKey,
    destination: PublicKey,
    amount: bigint,
): TransactionInstruction {
    const data = new Uint8Array(8 + 8);
    data.set(TOKEN_REQUEST_DISCRIMINATOR, 0);
    new DataView(data.buffer).setBigUint64(8, amount, true);

    const info = deriveTokenInfoPda(mint);

    return new TransactionInstruction({
        programId: TEST_SERVICE_PROGRAM_ID,
        keys: [
            { pubkey: payer, isSigner: true, isWritable: true },
            { pubkey: requester, isSigner: false, isWritable: false },
            { pubkey: mint, isSigner: false, isWritable: true },
            { pubkey: info, isSigner: false, isWritable: false },
            { pubkey: destination, isSigner: false, isWritable: true },
            { pubkey: tokenProgram, isSigner: false, isWritable: false },
        ],
        data: Buffer.from(data),
    });
}

/**
 * Append instructions to mint the underlying tokens of a vault to a destination
 * wallet using the devnet test-service. Creates the destination ATA if needed,
 * then requests the tokens. Only applicable on devnet.
 *
 * Use this as a standalone "mint vault underlying" command when testing
 * (e.g. before depositing into a transferable vault).
 */
export function withMintVaultUnderlyingFromTestService({
    vault,
    destinationOwner,
    amount,
    instructions,
    payer,
}: {
    vault: Vault;
    destinationOwner: PublicKey;
    amount: bigint;
    instructions: TransactionInstruction[];
    payer?: PublicKey;
}): void {
    const mint = vault.account.underlyingMint;
    const tokenProgram = vault.account.underlyingMintTokenProgram;
    const payerKey = payer ?? destinationOwner;

    const destinationAta = getAssociatedTokenAddressSync(
        mint,
        destinationOwner,
        false,
        tokenProgram,
        ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    instructions.push(
        createAssociatedTokenAccountIdempotentInstruction(
            payerKey,
            destinationAta,
            destinationOwner,
            mint,
            tokenProgram,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
    );

    instructions.push(
        buildTokenRequestInstruction(
            payerKey,
            destinationOwner,
            mint,
            tokenProgram,
            destinationAta,
            amount,
        ),
    );
}
