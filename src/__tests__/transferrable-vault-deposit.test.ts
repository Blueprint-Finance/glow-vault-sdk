/*
 * Copyright (C) 2026 A1 XYZ, INC.
 *
 * Integration test: fetch a devnet transferrable token vault, request USDC from
 * the Glow test-service, deposit to the vault, confirm a pending deposit or share
 * balance, and when the user has shares, initiate and optionally execute a withdrawal.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import BN from 'bn.js';
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

import { fetchVault, fetchVaultPendingDepositsNullable, fetchVaultPendingWithdrawalsNullable } from '../state';
import {
    withTransferableVaultDeposit,
    withInitiateTransferableVaultWithdrawal,
    withExecuteTransferableVaultWithdrawal,
    deriveTransferableShareTokenAccount,
} from '../instructions';
import { withMintVaultUnderlyingFromTestService } from '../test-service';
import type { GlowVault } from '../idls/glow_vault';
import IDL from '../idls/glow_vault.json';

const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const VAULT_ADDRESS = new PublicKey('EzDmLUHTj53mSLN4BBrsuW8w3Gvc1iDGiYCXrkwm4vrR');

const USDC_DECIMALS = 6;
const REQUEST_AMOUNT = 10_000 * 10 ** USDC_DECIMALS;
const DEPOSIT_AMOUNT = 5_000 * 10 ** USDC_DECIMALS;

function loadWalletKeypair(): Keypair {
    const path = process.env.SOLANA_KEYPAIR ?? resolve(process.env.HOME ?? '', '.config', 'solana', 'id.json');
    const secret = JSON.parse(readFileSync(path, 'utf-8'));
    return Keypair.fromSecretKey(Uint8Array.from(secret));
}

describe('transferrable vault deposit', () => {
    it('fetches vault, requests USDC from test-service, deposits, and confirms pending deposit', async () => {
        const wallet = loadWalletKeypair();
        const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
        const walletAdapter = {
            publicKey: wallet.publicKey,
            signTransaction: async (tx: Transaction) => {
                tx.partialSign(wallet);
                return tx;
            },
            signAllTransactions: async (txs: Transaction[]) => {
                txs.forEach((tx) => tx.partialSign(wallet));
                return txs;
            },
        };
        const provider = new AnchorProvider(connection, walletAdapter, { commitment: 'confirmed' });
        setProvider(provider);

        const program = new Program<GlowVault>(IDL as GlowVault, provider);

        const vault = await fetchVault(program, VAULT_ADDRESS);
        const mintInstructions: TransactionInstruction[] = [];
        withMintVaultUnderlyingFromTestService({
            vault,
            destinationOwner: wallet.publicKey,
            amount: BigInt(REQUEST_AMOUNT),
            instructions: mintInstructions,
        });

        const requestTx = new Transaction().add(...mintInstructions);
        const requestSig = await provider.sendAndConfirm(requestTx, [wallet]);
        assert.ok(requestSig, 'token_request transaction should confirm');

        const destinationAta = getAssociatedTokenAddressSync(
            vault.account.underlyingMint,
            wallet.publicKey,
            false,
            vault.account.underlyingMintTokenProgram,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        const depositInstructions: TransactionInstruction[] = [];
        await withTransferableVaultDeposit({
            program,
            vault,
            depositor: wallet.publicKey,
            instructions: depositInstructions,
            amount: new BN(DEPOSIT_AMOUNT),
        });

        const depositTx = new Transaction().add(...depositInstructions);
        const depositSig = await provider.sendAndConfirm(depositTx, [wallet]);
        assert.ok(depositSig, 'deposit transaction should confirm');

        const pendingDepositsResult = await fetchVaultPendingDepositsNullable(program, vault.address, wallet.publicKey);
        const totalPendingShares =
            pendingDepositsResult?.account &&
            ((pendingDepositsResult.account as { total_pending_shares?: BN }).total_pending_shares ??
                (pendingDepositsResult.account as { totalPendingShares?: BN }).totalPendingShares);
        const hasPendingDeposit = totalPendingShares != null && !totalPendingShares.isZero();

        const shareAta = deriveTransferableShareTokenAccount(vault, wallet.publicKey);
        const shareBalance = await connection.getTokenAccountBalance(shareAta);
        const shareAmount = shareBalance?.value?.amount ? BigInt(shareBalance.value.amount) : 0n;
        const hasShareBalance = shareAmount > 0n;

        assert.ok(
            hasPendingDeposit || hasShareBalance,
            'after deposit, either a pending deposit should exist or share ATA balance should be non-zero',
        );

        if (!hasShareBalance) {
            return;
        }

        const withdrawAmount = new BN(shareAmount.toString());
        const initiateIxs: TransactionInstruction[] = [];
        await withInitiateTransferableVaultWithdrawal({
            program,
            connection,
            vault,
            withdrawer: wallet.publicKey,
            instructions: initiateIxs,
            amount: withdrawAmount,
        });

        const initiateTx = new Transaction().add(...initiateIxs);
        const initiateSig = await provider.sendAndConfirm(initiateTx, [wallet]);
        assert.ok(initiateSig, 'initiate transferable vault withdrawal should confirm');

        const withdrawalWaitingPeriod =
            (vault.account as { withdrawalWaitingPeriod?: BN }).withdrawalWaitingPeriod ??
            (vault.account as { withdrawal_waiting_period?: BN }).withdrawal_waiting_period;
        const waitingPeriodSeconds = withdrawalWaitingPeriod != null ? withdrawalWaitingPeriod.toNumber() : 0;

        if (waitingPeriodSeconds === 0) {
            const executeIxs: TransactionInstruction[] = [];
            await withExecuteTransferableVaultWithdrawal({
                program,
                vault,
                withdrawer: wallet.publicKey,
                instructions: executeIxs,
                withdrawalIndex: 0,
            });

            const underlyingBefore = await connection.getTokenAccountBalance(destinationAta);
            const beforeAmount = underlyingBefore?.value?.amount ? BigInt(underlyingBefore.value.amount) : 0n;

            const executeTx = new Transaction().add(...executeIxs);
            const executeSig = await provider.sendAndConfirm(executeTx, [wallet]);
            assert.ok(executeSig, 'execute transferable vault withdrawal should confirm');

            const underlyingAfter = await connection.getTokenAccountBalance(destinationAta);
            const afterAmount = underlyingAfter?.value?.amount ? BigInt(underlyingAfter.value.amount) : 0n;

            assert.ok(afterAmount > beforeAmount, 'underlying token balance should increase after withdrawal');
        } else {
            const pendingWithdrawals = await fetchVaultPendingWithdrawalsNullable(
                program,
                vault.address,
                wallet.publicKey,
            );
            assert.ok(pendingWithdrawals != null, 'pending withdrawals account should exist');
            const acc = pendingWithdrawals!.account as { withdrawals?: unknown[] };
            const withdrawals = acc.withdrawals ?? [];
            assert.ok(withdrawals.length >= 1, 'at least one pending withdrawal should exist');
        }
    });
});
