import { describe, expect, it, vi } from 'vitest';
import {
  CACHE_KEY,
  CACHE_TTL_MS,
  DEFAULT_GOLD_PRICE,
  GOLD_PRICE_SOURCES,
  GRAMS_PER_TROY_OUNCE,
  parseGoldResponse,
  readOverride,
  resolveGoldPrice,
  writeOverride,
} from './gold-price';

const NOW = Date.UTC(2026, 9, 25, 8);
const OUNCE_PRICE = 72_000_000;
const GRAM_PRICE = Math.round(OUNCE_PRICE / GRAMS_PER_TROY_OUNCE);

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    data,
  };
}

const okResponse = (body: unknown) => ({ ok: true, json: async () => body }) as unknown as Response;

const apiBody = { date: '2026-10-25', xau: { idr: OUNCE_PRICE } };

describe('parseGoldResponse', () => {
  it('converts IDR per troy ounce to IDR per gram', () => {
    expect(parseGoldResponse(apiBody)).toEqual({ pricePerGram: GRAM_PRICE, date: '2026-10-25' });
  });

  it.each([null, {}, { date: '2026-10-25' }, { date: 1, xau: { idr: 1 } }, apiBody.xau])(
    'rejects malformed payload %#',
    (body) => {
      expect(parseGoldResponse(body)).toBeNull();
    }
  );

  it('rejects zero or negative prices', () => {
    expect(parseGoldResponse({ date: '2026-10-25', xau: { idr: 0 } })).toBeNull();
  });
});

describe('resolveGoldPrice', () => {
  it('uses a fresh cache without hitting the network', async () => {
    const storage = memoryStorage({
      [CACHE_KEY]: JSON.stringify({ pricePerGram: 2_000_000, date: '2026-10-24', fetchedAt: NOW }),
    });
    const fetchImpl = vi.fn();
    const price = await resolveGoldPrice({ storage, fetchImpl, now: NOW + 1000 });
    expect(price).toEqual({ pricePerGram: 2_000_000, date: '2026-10-24', source: 'cache' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fetches and caches a live price when the cache is stale', async () => {
    const storage = memoryStorage({
      [CACHE_KEY]: JSON.stringify({ pricePerGram: 1, date: '2026-01-01', fetchedAt: NOW }),
    });
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(apiBody));
    const price = await resolveGoldPrice({ storage, fetchImpl, now: NOW + CACHE_TTL_MS });
    expect(price).toEqual({ pricePerGram: GRAM_PRICE, date: '2026-10-25', source: 'live' });
    expect(JSON.parse(storage.getItem(CACHE_KEY) ?? 'null')).toMatchObject({
      pricePerGram: GRAM_PRICE,
    });
  });

  it('falls back to the mirror when the primary source fails', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(okResponse(apiBody));
    const price = await resolveGoldPrice({ storage: memoryStorage(), fetchImpl, now: NOW });
    expect(price.source).toBe('live');
    expect(fetchImpl).toHaveBeenNthCalledWith(2, GOLD_PRICE_SOURCES[1], expect.anything());
  });

  it('skips non-OK and malformed responses', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: false } as Response)
      .mockResolvedValueOnce(okResponse({ nope: true }));
    const price = await resolveGoldPrice({ storage: memoryStorage(), fetchImpl, now: NOW });
    expect(price).toEqual(DEFAULT_GOLD_PRICE);
  });

  it('uses a stale cache when every source fails', async () => {
    const storage = memoryStorage({
      [CACHE_KEY]: JSON.stringify({ pricePerGram: 2_100_000, date: '2026-10-01', fetchedAt: 0 }),
    });
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    const price = await resolveGoldPrice({ storage, fetchImpl, now: NOW });
    expect(price).toEqual({ pricePerGram: 2_100_000, date: '2026-10-01', source: 'cache' });
  });

  it('falls back to the built-in default with no cache and no network', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    const price = await resolveGoldPrice({ storage: memoryStorage(), fetchImpl, now: NOW });
    expect(price).toEqual(DEFAULT_GOLD_PRICE);
  });

  it('ignores corrupted cache entries', async () => {
    const storage = memoryStorage({ [CACHE_KEY]: '{not json' });
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
    expect(await resolveGoldPrice({ storage, fetchImpl, now: NOW })).toEqual(DEFAULT_GOLD_PRICE);
  });
});

describe('override', () => {
  it('round-trips and clears a manual price', () => {
    const storage = memoryStorage();
    writeOverride(storage, 2_500_000);
    expect(readOverride(storage)).toBe(2_500_000);
    writeOverride(storage, null);
    expect(readOverride(storage)).toBeNull();
  });

  it('rejects invalid stored overrides', () => {
    const storage = memoryStorage({ 'zakat:gold-price-override': '{"pricePerGram":-5}' });
    expect(readOverride(storage)).toBeNull();
  });
});
