import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { fetchAllVaults } from '../src/instructions';
import type { GlowVault } from '../src/idls/glow_vault';
import IDL from '../src/idls/glow_vault.json';

const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey(IDL.address);

/**
 * Creates a read-only Anchor provider for fetching data (no wallet needed).
 */
function createReadOnlyProvider(connection: Connection): AnchorProvider {
    // Create a dummy wallet for read-only operations
    const dummyKeypair = Keypair.generate();
    const dummyWallet = {
        publicKey: dummyKeypair.publicKey,
        signTransaction: () => Promise.reject(new Error('Read-only provider')),
        signAllTransactions: () => Promise.reject(new Error('Read-only provider')),
    };

    return new AnchorProvider(connection, dummyWallet, {
        commitment: 'confirmed',
    });
}

describe('Vault Fetching', () => {
    it('should fetch all vaults from devnet', async () => {
        const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
        const provider = createReadOnlyProvider(connection);
        setProvider(provider);

        const program = new Program(IDL as GlowVault, provider);

        console.log(`\nFetching vaults from program: ${PROGRAM_ID.toBase58()}`);
        console.log(`RPC: ${DEVNET_RPC_URL}\n`);

        const vaults = await fetchAllVaults(program);

        console.log(`Found ${vaults.length} vault(s)\n`);

        for (const { publicKey, account } of vaults) {
            console.log(`Vault: ${publicKey.toBase58()}`);
            console.log(`  Share Mint: ${account.shareMint.toBase58()}`);
            console.log(`  Underlying Mint: ${account.underlyingMint.toBase58()}`);
            console.log(`  Authority: ${account.authority.toBase58()}`);
            console.log(`  Airspace: ${account.airspace.toBase58()}`);
            console.log('');
        }

        // The test passes if we can fetch without errors
        // There may be 0 vaults on devnet, which is valid
        assert.ok(Array.isArray(vaults), 'fetchAllVaults should return an array');
    });
});
