/*
 * Mint a vault's underlying tokens (devnet test-service) N times to your local wallet.
 *
 * Usage:
 *   COUNT=10 pnpm exec tsx scripts/mint-vault-underlying-n-times.ts
 *
 * Wallet: SOLANA_KEYPAIR or ~/.config/solana/id.json
 * RPC:    DEVNET_RPC_URL (default https://api.devnet.solana.com)
 * Vault:  VAULT_ADDRESS (default devnet USDC transferable vault)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

import { fetchVault } from '../src/state';
import { withMintVaultUnderlyingFromTestService } from '../src/test-service';
import type { GlowVault } from '../src/idls/glow_vault';
import IDL from '../src/idls/glow_vault.json';

const DEVNET_RPC_URL = process.env.DEVNET_RPC_URL ?? 'https://api.devnet.solana.com';
const VAULT_ADDRESS = new PublicKey(
    process.env.VAULT_ADDRESS ?? 'EzDmLUHTj53mSLN4BBrsuW8w3Gvc1iDGiYCXrkwm4vrR',
);

const USDC_DECIMALS = 6;
/** Amount per transaction in smallest units (default 10_000 USDC). */
const AMOUNT_PER_RUN = BigInt(process.env.AMOUNT ?? String(10_000 * 10 ** USDC_DECIMALS));
const COUNT = Math.max(1, Number(process.env.COUNT ?? 10));

function loadWalletKeypair(): Keypair {
    const path =
        process.env.SOLANA_KEYPAIR ?? resolve(process.env.HOME ?? '', '.config', 'solana', 'id.json');
    const secret = JSON.parse(readFileSync(path, 'utf-8'));
    return Keypair.fromSecretKey(Uint8Array.from(secret));
}

async function main(): Promise<void> {
    const wallet = loadWalletKeypair();
    const connection = new Connection(DEVNET_RPC_URL, 'confirmed');

    const walletAdapter = {
        publicKey: wallet.publicKey,
        signTransaction: async <T extends Transaction>(tx: T): Promise<T> => {
            tx.partialSign(wallet);
            return tx;
        },
        signAllTransactions: async <T extends Transaction>(txs: T[]): Promise<T[]> => {
            txs.forEach((tx) => tx.partialSign(wallet));
            return txs;
        },
    };

    const provider = new AnchorProvider(connection, walletAdapter as never, { commitment: 'confirmed' });
    setProvider(provider);

    const program = new Program<GlowVault>(IDL as GlowVault, provider);
    const vault = await fetchVault(program, VAULT_ADDRESS);

    console.log('Wallet:', wallet.publicKey.toBase58());
    console.log('Vault:', VAULT_ADDRESS.toBase58());
    console.log('RPC:', DEVNET_RPC_URL);
    console.log('Runs:', COUNT, '| amount per run:', AMOUNT_PER_RUN.toString());
    console.log('---');

    for (let i = 1; i <= COUNT; i++) {
        const instructions: TransactionInstruction[] = [];
        withMintVaultUnderlyingFromTestService({
            vault,
            destinationOwner: wallet.publicKey,
            amount: AMOUNT_PER_RUN,
            instructions,
        });
        const tx = new Transaction().add(...instructions);
        const sig = await provider.sendAndConfirm(tx, [wallet]);
        console.log(`[${i}/${COUNT}]`, sig);
    }

    console.log('Done.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
