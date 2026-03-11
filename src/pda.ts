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

import { PublicKey } from '@solana/web3.js';
import { address as ID } from './idls/glow_vault.json';

import type { Address } from '@coral-xyz/anchor';

import { findDerivedAccount } from './utils';

export const GLOW_VAULT_ID: PublicKey = new PublicKey(ID);

export function deriveVaultUser(vault: Address, depositor: Address): PublicKey {
    return findDerivedAccount(GLOW_VAULT_ID, 'vault_user', vault, depositor);
}

export function deriveVaultPendingWithdrawals(vault: Address, withdrawer: Address): PublicKey {
    return findDerivedAccount(GLOW_VAULT_ID, 'vault_pending_withdrawals', vault, withdrawer);
}

export function deriveVaultShareMint(vault: Address): PublicKey {
    return findDerivedAccount(GLOW_VAULT_ID, 'vault_deposit_mint', vault);
}

export function deriveVaultPendingDeposits(vault: Address, depositor: Address): PublicKey {
    return findDerivedAccount(GLOW_VAULT_ID, 'vault_pending_deposits', vault, depositor);
}

export function deriveVaultPendingDepositsCustody(vault: Address): PublicKey {
    return findDerivedAccount(GLOW_VAULT_ID, 'vault_deposits_custody', vault);
}

export function deriveVaultPendingWithdrawalsCustody(vault: Address): PublicKey {
    return findDerivedAccount(GLOW_VAULT_ID, 'vault_withdrawals_custody', vault);
}
