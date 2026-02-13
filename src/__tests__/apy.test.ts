import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PublicKey } from '@solana/web3.js';

import { fetchVaultApy, getVaultApyUrl } from '../apy';

describe('apy', () => {
    const vault = new PublicKey('gwv1ybUe2JVEpjdWARK1PjZUVY5xdNUCRhu24tgYtxa');

    describe('getVaultApyUrl()', () => {
        it('adds vault as a query param when no placeholder is present', () => {
            const url = getVaultApyUrl('https://example.com/vault-apy', vault);
            assert.strictEqual(url.origin, 'https://example.com');
            assert.strictEqual(url.pathname, '/vault-apy');
            assert.strictEqual(url.searchParams.get('vault'), vault.toBase58());
        });

        it('replaces {vault} placeholder in the endpoint', () => {
            const url = getVaultApyUrl('https://example.com/vaults/{vault}/apy', vault);
            assert.strictEqual(url.origin, 'https://example.com');
            assert.strictEqual(url.pathname, `/vaults/${vault.toBase58()}/apy`);
            assert.strictEqual(url.searchParams.get('vault'), null);
        });
    });

    describe('fetchVaultApy()', () => {
        it('parses apyBps and converts to decimal apy', async () => {
            let seenUrl: string | null = null;
            const res = await fetchVaultApy(vault, {
                endpoint: 'https://example.com/vault-apy',
                fetch: async (input) => {
                    seenUrl = (input instanceof URL ? input : new URL(String(input))).toString();
                    return {
                        ok: true,
                        status: 200,
                        statusText: 'OK',
                        json: async () => ({ apyBps: 1234, asOf: 1_700_000_000 }),
                        text: async () => '',
                    } as unknown as Response;
                },
            });

            assert.ok(seenUrl?.includes(`vault=${vault.toBase58()}`));
            assert.strictEqual(res.apy, 0.1234);
            assert.strictEqual(res.apyBps, 1234);
            assert.ok(res.asOf instanceof Date);
        });

        it('parses apy_percent and converts to decimal apy', async () => {
            const res = await fetchVaultApy(vault, {
                endpoint: 'https://example.com/vault-apy',
                fetch: async () =>
                    ({
                        ok: true,
                        status: 200,
                        statusText: 'OK',
                        json: async () => ({ apy_percent: 5 }),
                        text: async () => '',
                    }) as unknown as Response,
            });

            assert.strictEqual(res.apy, 0.05);
            assert.strictEqual(res.apyBps, 500);
        });

        it('parses apy decimal form as-is', async () => {
            const res = await fetchVaultApy(vault, {
                endpoint: 'https://example.com/vault-apy',
                fetch: async () =>
                    ({
                        ok: true,
                        status: 200,
                        statusText: 'OK',
                        json: async () => ({ apy: 0.08, updatedAt: '2026-02-13T00:00:00.000Z' }),
                        text: async () => '',
                    }) as unknown as Response,
            });

            assert.strictEqual(res.apy, 0.08);
            assert.strictEqual(res.apyBps, null);
            assert.ok(res.asOf instanceof Date);
            assert.strictEqual(res.asOf?.toISOString(), '2026-02-13T00:00:00.000Z');
        });

        it('throws on non-ok responses', async () => {
            await assert.rejects(
                () =>
                    fetchVaultApy(vault, {
                        endpoint: 'https://example.com/vault-apy',
                        fetch: async () =>
                            ({
                                ok: false,
                                status: 500,
                                statusText: 'Internal Server Error',
                                json: async () => ({}),
                                text: async () => 'boom',
                            }) as unknown as Response,
                    }),
                /500/,
            );
        });

        it('throws when response is missing apy fields', async () => {
            await assert.rejects(
                () =>
                    fetchVaultApy(vault, {
                        endpoint: 'https://example.com/vault-apy',
                        fetch: async () =>
                            ({
                                ok: true,
                                status: 200,
                                statusText: 'OK',
                                json: async () => ({ foo: 1 }),
                                text: async () => '',
                            }) as unknown as Response,
                    }),
                /missing apy/,
            );
        });
    });
});

