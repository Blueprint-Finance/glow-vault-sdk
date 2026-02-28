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
    instructions, // <-- instructions get pushed here
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

There are two ways to fetch a vault's information.

1. Using the Glow API
2. Fetching the on-chain state

### 1. Glow API

The Glow API is used internally by the team, and its account layout is different to the on-chain state. In the short-term (as of February 2026) we suggest using it only to fetch APY values of vaults. The team will publish a public API that can be consumed widely in the future.

The endpoint to fetch vaults is

```
# devnet
https://api.dev.shinylab.xyz/vaults
# mainnet
https://api.glowfinance.xyz/vaults
```

and a single vault can be fetched using its name (and replacing spaces with '-').

```
# devnet
https://api.dev.shinylab.xyz/vaults/Maple-SyrupUSDC
# mainnet
https://api.glowfinance.xyz/vaults/perena-usdt
```

An example response from the endpoint is shown below.

```json
{
  "name": "Maple SyrupUSDC",
  "address": "fEM3AFDMxZBFPGucL8uJutEWC2MRNjpHJPWPX2PcqjK",
  "acceptsDeposits": true,
  "acceptsWithdrawals": true,
  "apy": {
    "7": -0.00999922279231638, // the 7 and 30 day APY and APR are tracked
    "30": -0.00999607065517712,
    "7rewards": 9.49000077720768, // if there are rewards, they are added to the APY & APR
    "30rewards": 9.49000392934482,
    "lastUpdated": 1770938826000
  },
  "apr": {
    "7": -0.00994953238095342,
    "30": -0.00994641151570974,
    "7rewards": -0.00994953238095342,
    "30rewards": -0.00994641151570974,
    "lastUpdated": 1770938826000
  },
  "exchangeRate": 1.0107943059,
  "shareMint": "DT1SEWR5zCq32qXXwJcnGRrqtCcGayJWWRbLNLfpBDKH",
  "depositTokens": [ // Array for future support of multi-token vaults. The team currently plans to support single tokens for now.
    {
      "symbol": "SyrupUSDC",
      "name": "SyrupUSDC",
      "address": "Cu5hn1k9FeHoJN2rpo2xvSwNSuphuGMQvxt566cYKVni",
      "decimals": 6,
      "precision": 3,
      "tokenProgram": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "minimumDeposit": 10000000, // In the mint's decimal units, 
      "availableTokens": 82839082222,
      "depositLimit": 10000000000000,
      "depositAmount": 82839082222,
      "pendingWithdrawals": 7553468465
    }
  ]
}
```

### 2. On chain using the SDK

The SDK has options to fetch all vaults or a single vault if the address of the vault is known.

A vault's state is laid out below.

```ts
type VaultAccount = {
    version: number;
    bumpSeed: number[];
    flags: any;
    vaultIndex: number[];
    underlyingMintExponent: number;
    // space padded name in bytes
    vaultName: number[];
    airspace: PublicKey;
    authority: PublicKey;
    oracleAuthority: PublicKey;
    feeReceiver: PublicKey;
    shareMint: PublicKey;
    underlyingMint: PublicKey;
    // Address with the total funds available in the vault for deposit/withdrawal.
    vaultReserve: PublicKey;
    // "pendingWithdrawals" in the internal API
    vaultRedemptionReserve: PublicKey;
    underlyingMintTokenProgram: PublicKey;
    // Total funds available in the vault for deposit/withdrawal.
    // To determine if a user's withdrawals would succeed, check the user's total against the balance in the reserve.
    // This is "availableTokens" in the internal API.
    depositTokens: BN;
    // Tokens invested by an operator, the number changes when operators report their latest valuation.
    // Thus this is what drives exchange rate fluctuations in the vault.
    operatorTokens: BN;
    // Number of shares minted by the vault
    depositShares: BN;
    uncollectedManagementFees: BN;
    uncollectedPerformanceFees: BN;
    lastUpdateTimestamp: BN;
    lastManagementFeeTimestamp: BN;
    // The overall limit of deposits into the vault
    depositLimit: BN;
    // The maximum a user can withdraw
    withdrawalLimit: BN;
    // Pending period in seconds
    withdrawalWaitingPeriod: BN;
    // The minimum amount a user should deposit
    minimumDeposit: BN;
    // The minimum amount at which the vault's exchange rate resets to 1:1.
    // This is to avoid manipulation of the exchange rate by small operations.
    minimumSharesDustThreshold: BN;
    performanceFee: number;
    // A fee that is charged annualized on the assets under management
    managementFee: number;
    padding: number[];
    oracleType: number;
    // NOTE: the oracle fields below will only be used when adding margin program integration.
    // An oracle field to record either:
    // * Pyth Feed ID
    // * Glow Feed Address
    oracleField1: number[];
    // An oracle field to record:
    // * Pyth Redemption Feed ID
    //
    // The goal is to deprecate this and move exclusively to using Glow Feed Address, whereby
    // we will empty this field and potentially extend reserved data below, or reuse it.
    oracleField2: number[];
    // Performance fees that can be withdrawn because they have been charged to the
    // user, and the user has withdrawn their funds after the fees were charged.
    realisedPerformanceFees: BN;
    // --- Transferable vault fields ---
    // Seconds before a depositor can receive their shares (delivery lock)
    depositDeliveryLockPeriod: BN;
    // Seconds before a depositor can redeem their shares (redemption lock)
    depositRedemptionLockPeriod: BN;
    // Length of one withdrawal epoch in seconds (0 if epoch withdrawals are disabled)
    epochPeriodSeconds: number;
    // How many seconds before epoch settlement to stop accepting new withdrawal requests
    epochCutoffBeforeSettlementSeconds: number;
    // Tokens earmarked for withdrawals whose yield is frozen at the initiation-time rate
    reservedWithdrawalTokens: BN;
    // Shares earmarked for those same frozen withdrawals
    reservedWithdrawalShares: BN;
    reserved: number[];
}
```

The `flags` field is a bitfield that controls vault behaviour. The flags relevant to transferable vaults are:

| Bit | Name | Description |
| --- | --- | --- |
| `1 << 3` | `SHARES_TRANSFERABLE` | Shares are freely transferable tokens held in user wallets |
| `1 << 4` | `DEPOSIT_TIME_LOCK_ENABLED` | Deposits are escrowed and time-locked before delivery |
| `1 << 5` | `EPOCH_WITHDRAWALS` | Withdrawals follow a fixed epoch schedule |
| `1 << 6` | `FREEZE_WITHDRAWAL_YIELD` | Withdrawal payout is locked at the initiation-time exchange rate |

#### Fetch a Single Vault

There is a "Glow Solana" vault that accepts devnet SOL, which you can test with. Its address is `5gyBqq1Lfv8ArywZK2raQQephSrsbc7mVUjLWm9QnZbk`.

```typescript
import { fetchVault, fetchVaultNullable } from 'glow-vaults-sdk';

// Throws if not found
const vault = await fetchVault(program, vaultAddress);

// Returns null if not found
const maybeVault = await fetchVaultNullable(program, vaultAddress);
```

#### Fetch All Vaults

```typescript
import { fetchAllVaults } from 'glow-vaults-sdk';

const vaults = await fetchAllVaults(program);

for (const { address, account } of vaults) {
    console.log(`Vault: ${address.toBase58()}`);
    console.log(`  Share Mint: ${account.shareMint.toBase58()}`);
    console.log(`  Underlying Mint: ${account.underlyingMint.toBase58()}`);
}
```

#### Fetch Vault with Balances and Exchange Rate

For convenience, you can fetch a vault along with its calculated balances and exchange rate:

```typescript
import { fetchVaultWithBalances, getVaultWithBalances } from 'glow-vaults-sdk';

// Fetch and calculate in one call
const vaultWithBalances = await fetchVaultWithBalances(program, vaultAddress);

// Or calculate from an already-fetched vault
const vault = await fetchVault(program, vaultAddress);
const vaultWithBalances = getVaultWithBalances(vault);

console.log(`Total Tokens: ${vaultWithBalances.balances.totalTokens.toString()}`);
console.log(`Total Shares: ${vaultWithBalances.balances.totalShares.toString()}`);

if (vaultWithBalances.exchangeRate) {
    const rate = vaultWithBalances.exchangeRate.numerator
        .mul(new BN(1_000_000))
        .div(vaultWithBalances.exchangeRate.denominator);
    console.log(`Exchange Rate: ${rate.toNumber() / 1_000_000}`);
}
```

#### Calculate Vault Balances and Exchange Rate

You can also calculate balances and exchange rate directly from a vault account:

```typescript
import { calculateVaultBalances, calculateVaultExchangeRate } from 'glow-vaults-sdk';

const vault = await fetchVault(program, vaultAddress);
const balances = calculateVaultBalances(vault.account);
const exchangeRate = calculateVaultExchangeRate(balances);

// VaultBalances contains:
// - totalTokens: depositTokens + operatorTokens
// - totalShares: total shares minted
// - depositTokens: tokens available for withdrawal
// - operatorTokens: tokens invested by operators
// - uncollectedManagementFees
// - uncollectedPerformanceFees
// - realisedPerformanceFees
```

#### Derive Vault Share Mint

The share mint address for a vault can be derived:

```typescript
import { deriveVaultShareMint } from 'glow-vaults-sdk';

const shareMintAddress = deriveVaultShareMint(vaultAddress);
```

## Fetching User Balances

There are two kinds of depositors supported by the program.

1. Glow margin account
2. Any other user (wallet or PDA that is not a margin account)

For Glow margin accounts, shares minted by the vault are transferred to the margin account to be treated as collateral.

For other users in **standard vaults**, the shares are minted but kept by a `VaultUser` account.

For **transferable vaults** (where the `SHARES_TRANSFERABLE` flag is set), shares are minted directly to the user's wallet as tokens. This means the shares can be freely transferred between wallets. See the [Transferable Vault Instructions](#transferable-vault-instructions) section for the corresponding instruction helpers.

```ts
// VaultUserAccount
type VaultUserAccount = {
    owner: PublicKey;
    vault: PublicKey;
    // Watermark when performance fee was last charged, an i128 in [u8; 16]
    lastPerformanceFeeRate: number[];
    // Performance fees that have not been withdrawn from the user (will be 0 for Perena vault)
    accruedPerformanceFees: BN;
    // The total number of shares, gross of pending withdrawals below
    totalShares: BN;
    // Portion of totalShares above that the user has requested to withdraw
    pendingWithdrawalShares: BN;
    // i64 timestamp
    lastUpdateTimestamp: BN;
    bump: number;
}
```

### Deriving VaultUser Address

The vault user address can be derived with `deriveVaultUser`:

```typescript
import { deriveVaultUser } from 'glow-vaults-sdk';

const vaultUserAddress = deriveVaultUser(vaultAddress, depositorAddress);
```

### Fetching VaultUser

```typescript
import { fetchVaultUser, fetchVaultUserNullable } from 'glow-vaults-sdk';

// Throws if not found
const vaultUser = await fetchVaultUser(program, vaultAddress, depositorAddress);

// Returns null if not found
const maybeVaultUser = await fetchVaultUserNullable(program, vaultAddress, depositorAddress);
```

### Fetching User Balance with Exchange Rate

The SDK provides a convenience function to fetch a user's balance with token amounts calculated using the current exchange rate:

```typescript
import { fetchVaultUserBalance } from 'glow-vaults-sdk';

const balance = await fetchVaultUserBalance(program, vaultAddress, depositorAddress);

if (balance) {
    console.log(`Total Shares: ${balance.totalShares.toString()}`);
    console.log(`Pending Shares: ${balance.pendingShares.toString()}`);
    console.log(`Available Shares: ${balance.availableShares.toString()}`);
    // Token amounts are calculated using the exchange rate (null if exchange rate unavailable)
    console.log(`Total Tokens: ${balance.totalTokens?.toString()}`);
    console.log(`Pending Tokens: ${balance.pendingTokens?.toString()}`);
    console.log(`Available Tokens: ${balance.availableTokens?.toString()}`);
}
```

## Pending Withdrawals

Users have a `PendingWithdrawals` account with the following layout.

```ts
type PendingWithdrawal = {
    pendingAssets: BN;
    pendingShares: BN;
    withdrawalRequestTimestamp: BN;
    // in seconds, add to withdrawalRequestTimestamp to get the timestamp when the withdrawal will be ready
    withdrawalWaitingPeriod: number;
}

type PendingWithdrawalsAccount = {
    owner: PublicKey;
    // PublicKey.default if not a margin account
    marginAccount: PublicKey;
    vault: PublicKey;
    // Total underlying the user will receive from all their withdrawals
    totalPendingAssets: BN;
    // Shares held by the program pending the withdrawal
    totalPendingShares: BN;
    // If the user has multiple pending withdrawals, shows the earliest one in epoch seconds
    earliestWithdrawalTimestamp: BN;
    // Fixed size array of 8 pending withdrawals
    // If values are 0, the slot is empty
    withdrawals: PendingWithdrawal[];
}
```

### Deriving Pending Withdrawals Address

Use `deriveVaultPendingWithdrawals` to derive the PDA for a user's pending withdrawals account:

```typescript
import { deriveVaultPendingWithdrawals } from 'glow-vaults-sdk';

const pendingWithdrawalsAddress = deriveVaultPendingWithdrawals(vaultAddress, withdrawerAddress);
```

### Fetching Pending Withdrawals

```typescript
import { fetchVaultPendingWithdrawals, fetchVaultPendingWithdrawalsNullable } from 'glow-vaults-sdk';

// Throws if not found
const pendingWithdrawals = await fetchVaultPendingWithdrawals(program, vaultAddress, withdrawerAddress);

// Returns null if not found
const maybePendingWithdrawals = await fetchVaultPendingWithdrawalsNullable(program, vaultAddress, withdrawerAddress);
```

## Pending Deposits (Transferable Vaults)

Transferable vaults with the `DEPOSIT_TIME_LOCK_ENABLED` flag set escrow deposited shares in a `PendingDeposits` account until the delivery lock period expires.

```ts
type PendingDeposit = {
    pendingShares: BN;
    depositTimestamp: BN;
    // Snapshotted from the vault config at deposit time
    deliveryWaitingPeriod: number;
    redemptionWaitingPeriod: number;
}

type PendingDepositsAccount = {
    owner: PublicKey;
    vault: PublicKey;
    totalPendingShares: BN;
    // Fixed size array of 8 pending deposits
    // If values are 0, the slot is empty
    deposits: PendingDeposit[];
}
```

### Deriving Pending Deposits Address

```typescript
import { deriveVaultPendingDeposits } from 'glow-vaults-sdk';

const pendingDepositsAddress = deriveVaultPendingDeposits(vaultAddress, depositorAddress);
```

### Fetching Pending Deposits

```typescript
import { fetchVaultPendingDeposits, fetchVaultPendingDepositsNullable } from 'glow-vaults-sdk';

// Throws if not found
const pendingDeposits = await fetchVaultPendingDeposits(program, vaultAddress, depositorAddress);

// Returns null if not found
const maybePendingDeposits = await fetchVaultPendingDepositsNullable(program, vaultAddress, depositorAddress);
```

## Instructions

The SDK provides instruction helpers for both standard vaults and transferable vaults.

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

### Transferable Vault Instructions

The following instruction helpers are for vaults with the `SHARES_TRANSFERABLE` flag set. In these vaults, shares are held directly in the user's wallet as token-2022 tokens rather than being held by a `VaultUser` PDA.

#### Deposit to Transferable Vault

Deposit tokens into a transferable vault. The function reads the vault's on-chain flags to determine whether the deposit is time-locked.

- **Non-locked**: shares are minted directly to the depositor's wallet ATA.
- **Time-locked** (`DEPOSIT_TIME_LOCK_ENABLED`): shares are escrowed in the vault's pending deposits custody. The depositor must later call `withClaimDepositedShares` to claim them.

```typescript
import { withTransferableVaultDeposit } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withTransferableVaultDeposit({
    program,
    vault,
    depositor: wallet.publicKey,
    instructions,
    amount: new BN(1_000_000),
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

#### Claim Deposited Shares

Claim escrowed shares after the delivery lock period has expired. Only applicable to transferable vaults with `DEPOSIT_TIME_LOCK_ENABLED`.

```typescript
import { withClaimDepositedShares } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withClaimDepositedShares({
    program,
    vault,
    depositor: wallet.publicKey,
    instructions,
    depositIndex: 0, // Index of the pending deposit to claim
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

#### Initiate Transferable Vault Withdrawal

Start a withdrawal from a transferable vault. Shares are transferred from the user's wallet to the vault's pending withdrawals custody account. The user must later call `withExecuteTransferableVaultWithdrawal` after the waiting period.

```typescript
import { withInitiateTransferableVaultWithdrawal } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withInitiateTransferableVaultWithdrawal({
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

#### Execute Transferable Vault Withdrawal

Execute a pending withdrawal from a transferable vault after the waiting period has passed.

```typescript
import { withExecuteTransferableVaultWithdrawal } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withExecuteTransferableVaultWithdrawal({
    program,
    vault,
    withdrawer: wallet.publicKey,
    instructions,
    withdrawalIndex: 0,
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

#### Cancel Transferable Vault Pending Withdrawal

Cancel a pending withdrawal from a transferable vault. The escrowed shares are returned to the user's wallet.

```typescript
import { withCancelTransferableVaultPendingWithdrawal } from 'glow-vaults-sdk';

const instructions: TransactionInstruction[] = [];

await withCancelTransferableVaultPendingWithdrawal({
    program,
    vault,
    owner: wallet.publicKey,
    instructions,
    withdrawalIndex: 0,
});

const tx = new Transaction().add(...instructions);
await provider.sendAndConfirm(tx);
```

#### Derive Transferable Share Token Account

You can derive the share token ATA for a transferable vault user directly:

```typescript
import { deriveTransferableShareTokenAccount, fetchVault } from 'glow-vaults-sdk';

const vault = await fetchVault(program, vaultAddress);
const shareAta = deriveTransferableShareTokenAccount(vault, wallet.publicKey);
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

The SDK wraps raw IDL-decoded account data with their addresses for convenience. This means you always have access to both the account address and its data together.

### Wrapper Types

All fetch functions return wrapper types that include both the account address and the decoded data:

```typescript
import type { Vault, VaultUser, PendingWithdrawals, PendingDeposits } from 'glow-vaults-sdk';

// Vault wrapper - includes address and account data
type Vault = {
    address: PublicKey;
    account: VaultAccount;
}

// VaultUser wrapper
type VaultUser = {
    address: PublicKey;
    account: VaultUserAccount;
}

// PendingWithdrawals wrapper
type PendingWithdrawals = {
    address: PublicKey;
    account: PendingWithdrawalsAccount;
}

// PendingDeposits wrapper (transferable vaults with time-locked deposits)
type PendingDeposits = {
    address: PublicKey;
    account: PendingDepositsAccount;
}
```

### Raw Account Types

The raw IDL-decoded types are also exported if you need to work with just the account data:

```typescript
import type {
    VaultAccount,
    VaultUserAccount,
    PendingWithdrawalsAccount,
    PendingDepositsAccount,
} from 'glow-vaults-sdk';
```

### Balance and Exchange Rate Types

```typescript
import type { VaultBalances, VaultExchangeRate, VaultUserBalance, VaultWithBalances } from 'glow-vaults-sdk';

// VaultBalances - calculated from vault account
type VaultBalances = {
    totalTokens: BN;       // depositTokens + operatorTokens
    totalShares: BN;
    depositTokens: BN;
    operatorTokens: BN;
    uncollectedManagementFees: BN;
    uncollectedPerformanceFees: BN;
    realisedPerformanceFees: BN;
}

// VaultExchangeRate - ratio of tokens to shares
type VaultExchangeRate = {
    numerator: BN;    // totalTokens
    denominator: BN;  // totalShares
}

// VaultWithBalances - vault with calculated balances
type VaultWithBalances = Vault & {
    balances: VaultBalances;
    exchangeRate: VaultExchangeRate | null;
}

// VaultUserBalance - user balance with token amounts
type VaultUserBalance = {
    totalShares: BN;
    pendingShares: BN;
    availableShares: BN;
    totalTokens: BN | null;      // null if exchange rate unavailable
    pendingTokens: BN | null;
    availableTokens: BN | null;
    accruedPerformanceFees: BN;
    exchangeRate: VaultExchangeRate | null;
}
```

## Running Tests

```bash
pnpm test
```

## License

AGPL-3.0
