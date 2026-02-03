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
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

import type { Address } from '@coral-xyz/anchor';

export type AccountSeed = { toBytes(): Uint8Array } | { publicKey: PublicKey } | Uint8Array | string;

/**
 * Derive a PDA from the argued list of seeds.
 * @param {PublicKey} programId
 * @param {AccountSeed[]} seeds
 * @returns {Promise<PublicKey>}
 * @memberof GlowClient
 */
export function findDerivedAccount(programId: Address, ...seeds: AccountSeed[]): PublicKey {
    const seedBytes = seeds.map((s) => {
        if (typeof s == 'string') {
            const pubkeyBytes = bs58.decodeUnsafe(s);
            if (!pubkeyBytes || pubkeyBytes.length !== 32) {
                return new TextEncoder().encode(s);
            } else {
                return translateAddress(s).toBytes();
            }
        } else if ('publicKey' in s) {
            return s.publicKey.toBytes();
        } else if ('toBytes' in s) {
            return s.toBytes();
        } else {
            return s;
        }
    });

    const [address] = PublicKey.findProgramAddressSync(seedBytes, translateAddress(programId));

    return address;
}
