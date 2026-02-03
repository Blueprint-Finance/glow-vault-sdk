# Glow Vaults SDK

A TypeScript SDK for interacting with Glow Vaults on Solana.

## Installation

Note that we have not published this SDK as yet, the initial purpose is to share the patterns that we use to call the vault instructions.

## Usage Pattern

This SDK uses an instruction builder pattern. You create an `TransactionInstruction[]` array and pass it to the `with*` functions, which populate it with the necessary instructions. You then build and send the transaction yourself.

```typescript
import { Connection, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { withVaultWalletDeposit, fetchVault } from 'glow-vaults-sdk';

// 1. Create an empty instructions array
const instructions: TransactionInstruction[] = [];

// 2. Populate it with instructions
await withVaultWalletDeposit({
    program,
    vault,
    depositor: wallet.publicKey,
    instructions,  // <-- instructions get pushed here
    amount: new BN(1_000_000),
});

// 3. Build and send the transaction
const tx = new Transaction().add(...instructions);
const signature = await provider.sendAndConfirm(tx);
```

## Setup

### Creating a Program Instance

```typescript
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { Connection, Keypair } from '@solana/web3.js';
import IDL from 'glow-vaults-sdk/idls/glow_vault.json';
import type { GlowVault } from 'glow-vaults-sdk/idls/glow_vault';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
setProvider(provider);

const program = new Program(IDL as GlowVault, provider);
```

## Fetching Vaults

### Fetch a Single Vault

There is a "Glow Solana" vault that accepts devnet SOL, which you can test with. Its address is `5gyBqq1Lfv8ArywZK2raQQephSrsbc7mVUjLWm9QnZbk`.

```typescript
import { fetchVault, fetchVaultNullable } from 'glow-vaults-sdk';

// Throws if not found
const vault = await fetchVault(program, vaultAddress);

// Returns null if not found
const maybeVault = await fetchVaultNullable(program, vaultAddress);
```

### Fetch All Vaults

```typescript
import { fetchAllVaults } from 'glow-vaults-sdk';

const vaults = await fetchAllVaults(program);

for (const { publicKey, account } of vaults) {
    console.log(`Vault: ${publicKey.toBase58()}`);
    console.log(`  Share Mint: ${account.shareMint.toBase58()}`);
    console.log(`  Underlying Mint: ${account.underlyingMint.toBase58()}`);
}
```

## Instructions

### Deposit to Vault

Deposit tokens from a wallet into a vault. If the underlying token is SOL, it will be wrapped automatically.

```typescript
import { withVaultWalletDeposit } from 'glow-vaults-sdk';
import { BN } from '@coral-xyz/anchor';

const instructions: TransactionInstruction[] = [];

await withVaultWalletDeposit({
    program,
    vault,
    depositor: wallet.publicKey,
    instructions,
    amount: new BN(1_000_000), // Amount in base units
});

// Send transaction
const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

### Initiate Withdrawal

Start a withdrawal from a vault. This creates a pending withdrawal that can be executed after the waiting period.

```typescript
import { withInitiateVaultWithdrawal } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withInitiateVaultWithdrawal({
    program,
    connection,
    vault,
    withdrawer: wallet.publicKey,
    instructions,
    amount: new BN(500_000), // Share amount to withdraw
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

### Execute Withdrawal

Execute a pending withdrawal after the waiting period has passed.

```typescript
import { withExecuteVaultWithdrawal } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withExecuteVaultWithdrawal({
    program,
    vault,
    withdrawer: wallet.publicKey,
    instructions,
    withdrawalIndex: 0, // Index of the pending withdrawal
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

### Cancel Pending Withdrawal

Cancel a pending withdrawal and return the shares to the user.

```typescript
import { withCancelVaultPendingWithdrawal } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withCancelVaultPendingWithdrawal({
    program,
    vault,
    owner: wallet.publicKey,
    instructions,
    withdrawalIndex: 0,
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

### Update Vault Balances

Refresh the vault's balance state. This is called automatically by deposit/withdrawal functions but can be called manually.

```typescript
import { withUpdateVaultBalances } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withUpdateVaultBalances({
    program,
    vault,
    instructions,
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

## Combining Multiple Instructions

You can combine multiple operations in a single transaction:

```typescript
const instructions: TransactionInstruction[] = [];

// First, initiate a withdrawal
await withInitiateVaultWithdrawal({
    program,
    connection,
    vault,
    withdrawer: wallet.publicKey,
    instructions,
    amount: new BN(100_000),
});

// Then deposit to another vault (or the same one)
await withVaultWalletDeposit({
    program,
    vault: anotherVault,
    depositor: wallet.publicKey,
    instructions,
    amount: new BN(50_000),
});

// Send all instructions in one transaction
const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

## Types

### Vault Interface

The SDK provides a `Vault` interface for working with vault data:

```typescript
interface Vault {
    address: PublicKey;
    name: String;
    acceptsDeposits: boolean;
    acceptsWithdrawals: boolean;
    shareMint: PublicKey;
    underlyingMint: PublicKey;
    underlyingMintTokenProgram: PublicKey;
    airspace: PublicKey;
    authority: PublicKey;
    oracleAuthority: PublicKey;
    vaultReserve: PublicKey;
}
```

### VaultAccount Type

For raw IDL-decoded data, use the `VaultAccount` type:

```typescript
import type { VaultAccount } from 'glow-vaults-sdk';

const account: VaultAccount = await fetchVault(program, address);
```

## Running Tests

```bash
pnpm test
```

## License

AGPL-3.0
