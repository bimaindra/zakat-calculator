import type { KeyValueStorage } from './storage';

export const GRAMS_PER_TROY_OUNCE = 31.1034768;
export const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
export const FETCH_TIMEOUT_MS = 5000;

export const GOLD_PRICE_SOURCES = [
  'https://latest.currency-api.pages.dev/v1/currencies/xau.json',
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json',
] as const;

/** Dipakai saat prerender dan bila semua sumber gagal. Perbarui sesekali. */
export const DEFAULT_GOLD_PRICE: GoldPrice = {
  pricePerGram: 2_320_000,
  date: '2026-10-25',
  source: 'default',
};

export const CACHE_KEY = 'zakat:gold-price';
export const OVERRIDE_KEY = 'zakat:gold-price-override';

export type GoldPriceSource = 'live' | 'cache' | 'default' | 'manual';

export interface GoldPrice {
  pricePerGram: number;
  /** Tanggal harga dalam format YYYY-MM-DD. */
  date: string;
  source: GoldPriceSource;
}

interface CachedGoldPrice {
  pricePerGram: number;
  date: string;
  fetchedAt: number;
}

const isValidPrice = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export function parseGoldResponse(json: unknown): Omit<GoldPrice, 'source'> | null {
  if (typeof json !== 'object' || json === null) return null;
  const { date, xau } = json as { date?: unknown; xau?: { idr?: unknown } };
  const idrPerOunce = xau?.idr;
  if (typeof date !== 'string' || !isValidPrice(idrPerOunce)) return null;
  return { pricePerGram: Math.round(idrPerOunce / GRAMS_PER_TROY_OUNCE), date };
}

export async function fetchGoldPrice(fetchImpl: typeof fetch = fetch) {
  for (const url of GOLD_PRICE_SOURCES) {
    try {
      const response = await fetchImpl(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!response.ok) continue;
      const parsed = parseGoldResponse(await response.json());
      if (parsed) return parsed;
    } catch {
      // Coba sumber berikutnya.
    }
  }
  return null;
}

function readJson<T>(storage: KeyValueStorage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readCache(storage: KeyValueStorage): CachedGoldPrice | null {
  const cached = readJson<CachedGoldPrice>(storage, CACHE_KEY);
  if (!cached || !isValidPrice(cached.pricePerGram) || typeof cached.date !== 'string') {
    return null;
  }
  return cached;
}

export function writeCache(
  storage: KeyValueStorage,
  price: Omit<GoldPrice, 'source'>,
  now: number
) {
  try {
    storage.setItem(CACHE_KEY, JSON.stringify({ ...price, fetchedAt: now }));
  } catch {
    // Storage penuh atau diblokir: harga tetap dipakai tanpa cache.
  }
}

export function readOverride(storage: KeyValueStorage): number | null {
  const value = readJson<{ pricePerGram: number }>(storage, OVERRIDE_KEY)?.pricePerGram;
  return isValidPrice(value) ? value : null;
}

export function writeOverride(storage: KeyValueStorage, pricePerGram: number | null) {
  try {
    if (pricePerGram === null) storage.removeItem(OVERRIDE_KEY);
    else storage.setItem(OVERRIDE_KEY, JSON.stringify({ pricePerGram }));
  } catch {
    // Abaikan: override hanya berlaku untuk sesi ini.
  }
}

/**
 * Urutan: cache segar → sumber utama → mirror → cache lama → harga bawaan.
 * Tidak pernah melempar error sehingga kalkulator tidak pernah terblokir.
 */
export async function resolveGoldPrice({
  storage,
  fetchImpl = fetch,
  now = Date.now(),
}: {
  storage: KeyValueStorage;
  fetchImpl?: typeof fetch;
  now?: number;
}): Promise<GoldPrice> {
  const cached = readCache(storage);
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return { pricePerGram: cached.pricePerGram, date: cached.date, source: 'cache' };
  }

  const live = await fetchGoldPrice(fetchImpl);
  if (live) {
    writeCache(storage, live, now);
    return { ...live, source: 'live' };
  }

  if (cached) return { pricePerGram: cached.pricePerGram, date: cached.date, source: 'cache' };
  return DEFAULT_GOLD_PRICE;
}
