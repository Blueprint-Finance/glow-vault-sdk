import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PublicKey } from '@solana/web3.js';

import { findDerivedAccount } from '../utils';

const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

describe('utils', () => {
    describe('findDerivedAccount()', () => {
        it('derives PDA from string seeds (plain text)', () => {
            const address = findDerivedAccount(PROGRAM_ID, 'vault_user', 'some-vault', 'some-depositor');
            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('derives same PDA for same program and seeds', () => {
            const a = findDerivedAccount(PROGRAM_ID, 'seed1', 'seed2');
            const b = findDerivedAccount(PROGRAM_ID, 'seed1', 'seed2');
            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('derives different PDAs for different seeds', () => {
            const a = findDerivedAccount(PROGRAM_ID, 'seed1', 'seed2');
            const b = findDerivedAccount(PROGRAM_ID, 'seed1', 'seed3');
            const c = findDerivedAccount(PROGRAM_ID, 'seed2', 'seed2');
            assert.notStrictEqual(a.toBase58(), b.toBase58());
            assert.notStrictEqual(a.toBase58(), c.toBase58());
            assert.notStrictEqual(b.toBase58(), c.toBase58());
        });

        it('derives different PDAs for different program IDs', () => {
            const otherProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
            const a = findDerivedAccount(PROGRAM_ID, 'same', 'seeds');
            const b = findDerivedAccount(otherProgram, 'same', 'seeds');
            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });

        it('accepts PublicKey as string (base58) and uses as pubkey bytes', () => {
            const vault = new PublicKey('gwv1ybUe2JVEpjdWARK1PjZUVY5xdNUCRhu24tgYtxa');
            const address = findDerivedAccount(PROGRAM_ID, 'vault_user', vault.toBase58());
            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('accepts object with publicKey and uses its bytes', () => {
            const vault = new PublicKey('gwv1ybUe2JVEpjdWARK1PjZUVY5xdNUCRhu24tgYtxa');
            const address = findDerivedAccount(PROGRAM_ID, 'vault_user', { publicKey: vault });
            assert.ok(address instanceof PublicKey);
            // Same seed bytes as vault.toBase58() should yield same PDA
            const expected = findDerivedAccount(PROGRAM_ID, 'vault_user', vault.toBase58());
            assert.strictEqual(address.toBase58(), expected.toBase58());
        });

        it('accepts object with toBytes() and uses result', () => {
            const seed = new TextEncoder().encode('custom-seed');
            const address = findDerivedAccount(PROGRAM_ID, {
                toBytes: () => seed,
            });
            assert.ok(address instanceof PublicKey);
            const expected = findDerivedAccount(PROGRAM_ID, seed);
            assert.strictEqual(address.toBase58(), expected.toBase58());
        });

        it('accepts Uint8Array seeds', () => {
            const seed = new Uint8Array([1, 2, 3, 4, 5]);
            const address = findDerivedAccount(PROGRAM_ID, 'prefix', seed);
            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('treats non-base58 string as UTF-8 text seed', () => {
            const address = findDerivedAccount(PROGRAM_ID, 'vault_user');
            assert.ok(address instanceof PublicKey);
            // "vault_user" is not a 32-byte base58 pubkey, so it's encoded as UTF-8
            const asUtf8 = findDerivedAccount(PROGRAM_ID, new TextEncoder().encode('vault_user'));
            assert.strictEqual(address.toBase58(), asUtf8.toBase58());
        });
    });
});
