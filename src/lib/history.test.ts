import { describe, expect, it } from 'vitest';
import { HISTORY_KEY, addHistoryEntry, clearHistory, readHistory } from './history';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

describe('history', () => {
  it('adds newest entries first and keeps only the last five', () => {
    const storage = memoryStorage();
    for (let i = 1; i <= 7; i += 1) {
      addHistoryEntry(storage, { type: 'profesi', amount: i * 1000 }, new Date(2026, 9, i));
    }
    const history = readHistory(storage);
    expect(history).toHaveLength(5);
    expect(history.map((entry) => entry.amount)).toEqual([7000, 6000, 5000, 4000, 3000]);
  });

  it('stores only type, amount and timestamp', () => {
    const storage = memoryStorage();
    const [entry] = addHistoryEntry(
      storage,
      { type: 'maal', amount: 5_000_000 },
      new Date('2026-10-25T08:00:00Z')
    );
    expect(Object.keys(entry).sort()).toEqual(['amount', 'createdAt', 'id', 'type']);
  });

  it('drops corrupted or unknown entries', () => {
    const storage = memoryStorage({
      [HISTORY_KEY]: JSON.stringify([
        { id: 'a', type: 'maal', amount: 1, createdAt: '2026-10-25' },
        { id: 'b', type: 'hacked', amount: 1, createdAt: '2026-10-25' },
        { id: 'c', type: 'fitrah', amount: 'lots', createdAt: '2026-10-25' },
      ]),
    });
    expect(readHistory(storage).map((entry) => entry.id)).toEqual(['a']);
    expect(readHistory(memoryStorage({ [HISTORY_KEY]: '{oops' }))).toEqual([]);
  });

  it('clears all entries', () => {
    const storage = memoryStorage();
    addHistoryEntry(storage, { type: 'fitrah', amount: 47_000 });
    clearHistory(storage);
    expect(readHistory(storage)).toEqual([]);
  });
});
