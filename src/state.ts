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

import { translateAddress } from '@coral-xyz/anchor';
import BN from 'bn.js';

import type { Address, Program } from '@coral-xyz/anchor';
import type { PublicKey } from '@solana/web3.js';
import type { GlowVault } from './idls/glow_vault';

import { deriveVaultPendingWithdrawals, deriveVaultUser } from './pda';

const ZERO = new BN(0);

/**
 * The raw vault account data as decoded from the IDL.
 * Use this type when working directly with fetched account data.
 */
export type VaultAccount = Awaited<ReturnType<Program<GlowVault>['account']['vault']['fetch']>>;

export type Vault = {
    address: PublicKey;
    account: VaultAccount;
};

export type VaultUserAccount = Awaited<ReturnType<Program<GlowVault>['account']['vaultUser']['fetch']>>;

export type VaultUser = {
    address: PublicKey;
    account: VaultUserAccount;
};

export type PendingWithdrawalsAccount = Awaited<
    ReturnType<Program<GlowVault>['account']['pendingWithdrawals']['fetch']>
>;

export type PendingWithdrawals = {
    address: PublicKey;
    account: PendingWithdrawalsAccount;
};

export type VaultBalances = {
    totalTokens: BN;
    totalShares: BN;
    depositTokens: BN;
    operatorTokens: BN;
    uncollectedManagementFees: BN;
    uncollectedPerformanceFees: BN;
    realisedPerformanceFees: BN;
};

export type VaultExchangeRate = {
    numerator: BN;
    denominator: BN;
};

export type VaultWithBalances = Vault & {
    balances: VaultBalances;
    exchangeRate: VaultExchangeRate | null;
};

export type VaultUserBalance = {
    totalShares: BN;
    pendingShares: BN;
    availableShares: BN;
    totalTokens: BN | null;
    pendingTokens: BN | null;
    availableTokens: BN | null;
    accruedPerformanceFees: BN;
    exchangeRate: VaultExchangeRate | null;
};

/**
 * Fetch a vault account by its address.
 *
 * @param program - The Anchor program instance for GlowVault
 * @param address - The public key of the vault account to fetch
 * @returns The decoded vault account data
 * @throws If the account doesn't exist or cannot be decoded
 */
export async function fetchVault(program: Program<GlowVault>, address: Address): Promise<Vault> {
    const account = await program.account.vault.fetch(translateAddress(address));
    return {
        address: translateAddress(address),
        account,
    };
}

/**
 * Fetch a vault account by its address, returning null if not found.
 *
 * @param program - The Anchor program instance for GlowVault
 * @param address - The public key of the vault account to fetch
 * @returns The decoded vault account data, or null if not found
 */
export async function fetchVaultNullable(program: Program<GlowVault>, address: Address): Promise<Vault | null> {
    const account = await program.account.vault.fetchNullable(translateAddress(address));
    if (!account) {
        return null;
    }
    return {
        address: translateAddress(address),
        account,
    };
}

/**
 * Fetch all vault accounts.
 *
 * @param program - The Anchor program instance for GlowVault
 * @returns An array of all vault accounts with their public keys
 */
export async function fetchAllVaults(program: Program<GlowVault>): Promise<Vault[]> {
    const accounts = await program.account.vault.all();
    return accounts.map(
        ({ publicKey, account: accountData }) =>
            ({
                address: publicKey,
                account: accountData,
            }) as Vault,
    );
}

/**
 * Fetch a vault account and return it with derived balances and exchange rate.
 */
export async function fetchVaultWithBalances(
    program: Program<GlowVault>,
    address: Address,
): Promise<VaultWithBalances> {
    const vault = await fetchVault(program, address);
    return getVaultWithBalances(vault);
}

/**
 * Return the vault with balances and exchange rate derived from its account state.
 */
export function getVaultWithBalances(vault: Vault): VaultWithBalances {
    const balances = calculateVaultBalances(vault.account);
    const exchangeRate = calculateVaultExchangeRate(balances);
    return {
        ...vault,
        balances,
        exchangeRate,
    };
}

/**
 * Calculate vault balances directly from the on-chain account state.
 * totalTokens is derived as depositTokens + operatorTokens, with fees exposed separately.
 */
export function calculateVaultBalances(account: VaultAccount): VaultBalances {
    const depositTokens = account.depositTokens;
    const operatorTokens = account.operatorTokens;

    return {
        totalTokens: depositTokens.add(operatorTokens),
        totalShares: account.depositShares,
        depositTokens,
        operatorTokens,
        uncollectedManagementFees: account.uncollectedManagementFees,
        uncollectedPerformanceFees: account.uncollectedPerformanceFees,
        realisedPerformanceFees: account.realisedPerformanceFees,
    };
}

/**
 * Calculate the vault exchange rate as a ratio of total tokens to total shares.
 */
export function calculateVaultExchangeRate(balances: VaultBalances): VaultExchangeRate | null {
    if (balances.totalShares.isZero()) {
        return null;
    }
    return {
        numerator: balances.totalTokens,
        denominator: balances.totalShares,
    };
}

/**
 * Fetch a vault user account by vault + depositor.
 */
export async function fetchVaultUser(
    program: Program<GlowVault>,
    vault: Address,
    depositor: Address,
): Promise<VaultUser> {
    const address = deriveVaultUser(vault, depositor);
    const account = await program.account.vaultUser.fetch(address);
    return {
        address,
        account,
    };
}

/**
 * Fetch a vault user account by vault + depositor, returning null if missing.
 */
export async function fetchVaultUserNullable(
    program: Program<GlowVault>,
    vault: Address,
    depositor: Address,
): Promise<VaultUser | null> {
    const address = deriveVaultUser(vault, depositor);
    const account = await program.account.vaultUser.fetchNullable(address);
    if (!account) {
        return null;
    }
    return {
        address,
        account,
    };
}

/**
 * Calculate a depositor's balance from a vault + vault user account.
 */
export function calculateVaultUserBalance(vaultAccount: VaultAccount, vaultUser: VaultUserAccount): VaultUserBalance {
    const balances = calculateVaultBalances(vaultAccount);
    const exchangeRate = calculateVaultExchangeRate(balances);
    return calculateVaultUserBalanceWithRate(vaultUser, exchangeRate);
}

/**
 * Calculate a depositor's balance from a vault user account and exchange rate.
 */
export function calculateVaultUserBalanceWithRate(
    vaultUser: VaultUserAccount,
    exchangeRate: VaultExchangeRate | null,
): VaultUserBalance {
    const totalShares = vaultUser.totalShares;
    const pendingShares = vaultUser.pendingWithdrawalShares;
    const availableShares = totalShares.gt(pendingShares) ? totalShares.sub(pendingShares) : ZERO;

    const totalTokens = convertSharesToTokens(totalShares, exchangeRate);
    const pendingTokens = convertSharesToTokens(pendingShares, exchangeRate);
    const availableTokens = convertSharesToTokens(availableShares, exchangeRate);

    return {
        totalShares,
        pendingShares,
        availableShares,
        totalTokens,
        pendingTokens,
        availableTokens,
        accruedPerformanceFees: vaultUser.accruedPerformanceFees,
        exchangeRate,
    };
}

/**
 * Fetch a depositor's balance using the vault + vault user accounts.
 */
export async function fetchVaultUserBalance(
    program: Program<GlowVault>,
    vault: Address,
    depositor: Address,
): Promise<VaultUserBalance | null> {
    const [vaultAccount, vaultUser] = await Promise.all([
        program.account.vault.fetch(translateAddress(vault)),
        program.account.vaultUser.fetchNullable(deriveVaultUser(vault, depositor)),
    ]);

    if (!vaultUser) {
        return null;
    }

    return calculateVaultUserBalance(vaultAccount, vaultUser);
}

/**
 * Fetch pending withdrawals for a withdrawer.
 */
export async function fetchVaultPendingWithdrawals(
    program: Program<GlowVault>,
    vault: Address,
    withdrawer: Address,
): Promise<PendingWithdrawals> {
    const address = deriveVaultPendingWithdrawals(vault, withdrawer);
    const account = await program.account.pendingWithdrawals.fetch(address);
    return {
        address,
        account,
    };
}

/**
 * Fetch pending withdrawals for a withdrawer, returning null if missing.
 */
export async function fetchVaultPendingWithdrawalsNullable(
    program: Program<GlowVault>,
    vault: Address,
    withdrawer: Address,
): Promise<PendingWithdrawals | null> {
    const address = deriveVaultPendingWithdrawals(vault, withdrawer);
    const account = await program.account.pendingWithdrawals.fetchNullable(address);
    if (!account) {
        return null;
    }
    return {
        address,
        account,
    };
}

function convertSharesToTokens(shares: BN, exchangeRate: VaultExchangeRate | null): BN | null {
    if (!exchangeRate || exchangeRate.denominator.isZero()) {
        return null;
    }
    return shares.mul(exchangeRate.numerator).div(exchangeRate.denominator);
}
