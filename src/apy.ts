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

import type { Address } from '@coral-xyz/anchor';
import type { PublicKey } from '@solana/web3.js';

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type VaultApy = {
    vault: PublicKey;
    /**
     * APY as a decimal fraction. Example: 0.12 == 12% APY.
     */
    apy: number;
    /**
     * APY in basis points, if available/derivable from the response.
     */
    apyBps: number | null;
    /**
     * Best-effort timestamp parsed from the response (if present).
     */
    asOf: Date | null;
    /**
     * The URL used to fetch this APY.
     */
    sourceUrl: string;
    /**
     * Raw decoded JSON response from the API.
     */
    raw: unknown;
};

export type VaultApyEndpoint = string | URL | ((vaultBase58: string) => string | URL);

export type FetchVaultApyOptions = {
    endpoint: VaultApyEndpoint;
    fetch?: FetchLike;
    signal?: AbortSignal;
    headers?: HeadersInit;
    /**
     * Optional custom parser for non-standard API responses.
     *
     * Return `apy` as a decimal fraction (0.12 == 12%).
     */
    parse?: (raw: unknown) => { apy: number; apyBps: number | null; asOf: Date | null };
};

/**
 * Build a URL to fetch APY for a given vault.
 *
 * Rules:
 * - If `endpoint` contains `{vault}`, it is replaced with the vault base58 address.
 * - Otherwise, the vault is added as a `vault` query parameter.
 */
export function getVaultApyUrl(endpoint: VaultApyEndpoint, vault: Address): URL {
    const vaultKey = translateAddress(vault);
    const vaultBase58 = vaultKey.toBase58();

    if (typeof endpoint === 'function') {
        const out = endpoint(vaultBase58);
        return out instanceof URL ? out : new URL(out);
    }

    const endpointStr = endpoint instanceof URL ? endpoint.toString() : endpoint;
    if (endpointStr.includes('{vault}')) {
        return new URL(endpointStr.replaceAll('{vault}', vaultBase58));
    }

    const url = new URL(endpointStr);
    url.searchParams.set('vault', vaultBase58);
    return url;
}

export async function fetchVaultApy(vault: Address, options: FetchVaultApyOptions): Promise<VaultApy> {
    const url = getVaultApyUrl(options.endpoint, vault);

    const fetchFn: unknown = options.fetch ?? globalThis.fetch;
    if (typeof fetchFn !== 'function') {
        throw new Error('fetchVaultApy: no fetch implementation available; pass options.fetch');
    }

    const res = await (fetchFn as FetchLike)(url, {
        method: 'GET',
        headers: withDefaultHeaders(options.headers),
        signal: options.signal,
    });

    if (!res.ok) {
        let body = '';
        try {
            body = await res.text();
        } catch {
            // ignore
        }
        const suffix = body ? `: ${body}` : '';
        throw new Error(`fetchVaultApy: ${res.status} ${res.statusText} for ${url.toString()}${suffix}`);
    }

    const raw = (await res.json()) as unknown;
    const parse = options.parse ?? defaultParseVaultApyResponse;
    const parsed = parse(raw);

    if (!Number.isFinite(parsed.apy)) {
        throw new Error(`fetchVaultApy: parsed apy is not a finite number for ${url.toString()}`);
    }

    return {
        vault: translateAddress(vault),
        apy: parsed.apy,
        apyBps: parsed.apyBps,
        asOf: parsed.asOf,
        sourceUrl: url.toString(),
        raw,
    };
}

function withDefaultHeaders(headers?: HeadersInit): HeadersInit {
    if (!headers) {
        return { accept: 'application/json' };
    }

    // Prefer the platform's Headers implementation when available, since it can normalize all formats.
    if (typeof Headers !== 'undefined') {
        const h = new Headers(headers);
        if (!h.has('accept')) {
            h.set('accept', 'application/json');
        }
        return h;
    }

    // Best-effort merge without Headers.
    if (Array.isArray(headers)) {
        const hasAccept = headers.some(([k]) => k.toLowerCase() === 'accept');
        return hasAccept ? headers : [...headers, ['accept', 'application/json']];
    }

    if (typeof headers === 'object') {
        const obj = { ...(headers as Record<string, string>) };
        if (!('accept' in obj) && !('Accept' in obj)) {
            obj.accept = 'application/json';
        }
        return obj;
    }

    return headers;
}

function defaultParseVaultApyResponse(raw: unknown): { apy: number; apyBps: number | null; asOf: Date | null } {
    if (!isRecord(raw)) {
        throw new Error('Invalid APY response: expected a JSON object');
    }

    const asOf = parseAsOf(raw);

    // Preferred: basis points (unambiguous)
    const apyBpsRaw = raw.apyBps ?? raw.apy_bps;
    if (apyBpsRaw != null) {
        const apyBps = coerceFiniteNumber(apyBpsRaw, 'apyBps');
        return {
            apy: apyBps / 10000,
            apyBps: Math.round(apyBps),
            asOf,
        };
    }

    // Percent form
    const apyPercentRaw = raw.apyPercent ?? raw.apy_percent ?? raw.apyPct ?? raw.apy_pct;
    if (apyPercentRaw != null) {
        const apyPercent = coerceFiniteNumber(apyPercentRaw, 'apyPercent');
        return {
            apy: apyPercent / 100,
            apyBps: Math.round(apyPercent * 100),
            asOf,
        };
    }

    // Decimal form
    const apyRaw = raw.apy ?? raw.apyDecimal ?? raw.apy_decimal;
    if (apyRaw == null) {
        throw new Error('Invalid APY response: missing apy/apyBps/apy_percent');
    }

    const apy = coerceFiniteNumber(apyRaw, 'apy');
    return {
        apy,
        apyBps: null,
        asOf,
    };
}

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function coerceFiniteNumber(v: unknown, field: string): number {
    if (typeof v === 'number' && Number.isFinite(v)) {
        return v;
    }
    if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v);
        if (Number.isFinite(n)) {
            return n;
        }
    }
    throw new Error(`Invalid APY response: ${field} is not a finite number`);
}

function parseAsOf(raw: Record<string, unknown>): Date | null {
    const v = raw.asOf ?? raw.as_of ?? raw.updatedAt ?? raw.updated_at ?? raw.timestamp ?? raw.ts;
    if (v == null) {
        return null;
    }

    if (typeof v === 'string') {
        const d = new Date(v);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    if (typeof v === 'number' && Number.isFinite(v)) {
        // Heuristic: seconds timestamps are usually < 1e12; ms timestamps are ~1.7e12+ in modern time.
        const ms = v < 1e12 ? v * 1000 : v;
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    return null;
}
