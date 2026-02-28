import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PublicKey } from '@solana/web3.js';

import {
    GLOW_VAULT_ID,
    deriveVaultUser,
    deriveVaultPendingWithdrawals,
    deriveVaultShareMint,
    deriveVaultPendingDeposits,
    deriveVaultPendingDepositsCustody,
    deriveVaultPendingWithdrawalsCustody,
} from '../pda';
import { findDerivedAccount } from '../utils';
import { address as IDL_ADDRESS } from '../idls/glow_vault.json';

describe('pda', () => {
    const vault = new PublicKey('gwv1ybUe2JVEpjdWARK1PjZUVY5xdNUCRhu24tgYtxa');
    const depositor = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    const withdrawer = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

    describe('GLOW_VAULT_ID', () => {
        it('equals the program address from the IDL', () => {
            assert.strictEqual(GLOW_VAULT_ID.toBase58(), IDL_ADDRESS);
        });
    });

    describe('deriveVaultUser', () => {
        it('returns a PublicKey', () => {
            const address = deriveVaultUser(vault, depositor);
            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('is deterministic for same vault and depositor', () => {
            const a = deriveVaultUser(vault, depositor);
            const b = deriveVaultUser(vault, depositor);

            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('matches manual findDerivedAccount with same seeds', () => {
            const expected = findDerivedAccount(GLOW_VAULT_ID, 'vault_user', vault, depositor);
            const actual = deriveVaultUser(vault, depositor);

            assert.strictEqual(actual.toBase58(), expected.toBase58());
        });

        it('returns different address for different vault', () => {
            const otherVault = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
            const a = deriveVaultUser(vault, depositor);
            const b = deriveVaultUser(otherVault, depositor);

            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });

        it('returns different address for different depositor', () => {
            const otherDepositor = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
            const a = deriveVaultUser(vault, depositor);
            const b = deriveVaultUser(vault, otherDepositor);

            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });
    });

    describe('deriveVaultPendingWithdrawals', () => {
        it('returns a PublicKey', () => {
            const address = deriveVaultPendingWithdrawals(vault, withdrawer);

            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('is deterministic for same vault and withdrawer', () => {
            const a = deriveVaultPendingWithdrawals(vault, withdrawer);
            const b = deriveVaultPendingWithdrawals(vault, withdrawer);

            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('matches manual findDerivedAccount with same seeds', () => {
            const expected = findDerivedAccount(GLOW_VAULT_ID, 'vault_pending_withdrawals', vault, withdrawer);
            const actual = deriveVaultPendingWithdrawals(vault, withdrawer);

            assert.strictEqual(actual.toBase58(), expected.toBase58());
        });

        it('returns different address from deriveVaultUser for same vault/user', () => {
            const pending = deriveVaultPendingWithdrawals(vault, depositor);
            const vaultUser = deriveVaultUser(vault, depositor);

            assert.notStrictEqual(pending.toBase58(), vaultUser.toBase58());
        });
    });

    describe('deriveVaultShareMint', () => {
        it('returns a PublicKey', () => {
            const address = deriveVaultShareMint(vault);

            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('is deterministic for same vault', () => {
            const a = deriveVaultShareMint(vault);
            const b = deriveVaultShareMint(vault);

            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('matches manual findDerivedAccount with same seeds', () => {
            const expected = findDerivedAccount(GLOW_VAULT_ID, 'vault_deposit_mint', vault);
            const actual = deriveVaultShareMint(vault);

            assert.strictEqual(actual.toBase58(), expected.toBase58());
        });

        it('returns different address for different vault', () => {
            const otherVault = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
            const a = deriveVaultShareMint(vault);
            const b = deriveVaultShareMint(otherVault);

            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });
    });

    describe('deriveVaultPendingDeposits', () => {
        it('returns a PublicKey', () => {
            const address = deriveVaultPendingDeposits(vault, depositor);

            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('is deterministic for same vault and depositor', () => {
            const a = deriveVaultPendingDeposits(vault, depositor);
            const b = deriveVaultPendingDeposits(vault, depositor);

            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('matches manual findDerivedAccount with same seeds', () => {
            const expected = findDerivedAccount(GLOW_VAULT_ID, 'vault_pending_deposits', vault, depositor);
            const actual = deriveVaultPendingDeposits(vault, depositor);

            assert.strictEqual(actual.toBase58(), expected.toBase58());
        });

        it('returns different address from deriveVaultUser for same vault/user', () => {
            const pending = deriveVaultPendingDeposits(vault, depositor);
            const vaultUser = deriveVaultUser(vault, depositor);

            assert.notStrictEqual(pending.toBase58(), vaultUser.toBase58());
        });

        it('returns different address for different depositor', () => {
            const a = deriveVaultPendingDeposits(vault, depositor);
            const b = deriveVaultPendingDeposits(vault, withdrawer);

            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });
    });

    describe('deriveVaultPendingDepositsCustody', () => {
        it('returns a PublicKey', () => {
            const address = deriveVaultPendingDepositsCustody(vault);

            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('is deterministic for same vault', () => {
            const a = deriveVaultPendingDepositsCustody(vault);
            const b = deriveVaultPendingDepositsCustody(vault);

            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('matches manual findDerivedAccount with same seeds', () => {
            const expected = findDerivedAccount(GLOW_VAULT_ID, 'vault_deposits_custody', vault);
            const actual = deriveVaultPendingDepositsCustody(vault);

            assert.strictEqual(actual.toBase58(), expected.toBase58());
        });

        it('returns different address for different vault', () => {
            const otherVault = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
            const a = deriveVaultPendingDepositsCustody(vault);
            const b = deriveVaultPendingDepositsCustody(otherVault);

            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });
    });

    describe('deriveVaultPendingWithdrawalsCustody', () => {
        it('returns a PublicKey', () => {
            const address = deriveVaultPendingWithdrawalsCustody(vault);

            assert.ok(address instanceof PublicKey);
            assert.strictEqual(address.toBase58().length, 44);
        });

        it('is deterministic for same vault', () => {
            const a = deriveVaultPendingWithdrawalsCustody(vault);
            const b = deriveVaultPendingWithdrawalsCustody(vault);

            assert.strictEqual(a.toBase58(), b.toBase58());
        });

        it('matches manual findDerivedAccount with same seeds', () => {
            const expected = findDerivedAccount(GLOW_VAULT_ID, 'vault_withdrawals_custody', vault);
            const actual = deriveVaultPendingWithdrawalsCustody(vault);

            assert.strictEqual(actual.toBase58(), expected.toBase58());
        });

        it('returns different address for different vault', () => {
            const otherVault = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
            const a = deriveVaultPendingWithdrawalsCustody(vault);
            const b = deriveVaultPendingWithdrawalsCustody(otherVault);

            assert.notStrictEqual(a.toBase58(), b.toBase58());
        });

        it('returns different address from deriveVaultPendingDepositsCustody for same vault', () => {
            const withdrawalsCustody = deriveVaultPendingWithdrawalsCustody(vault);
            const depositsCustody = deriveVaultPendingDepositsCustody(vault);

            assert.notStrictEqual(withdrawalsCustody.toBase58(), depositsCustody.toBase58());
        });
    });
});
