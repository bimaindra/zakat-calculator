import type { CalculatorId } from '@/content/calculators';
import type { KeyValueStorage } from './storage';

export const HISTORY_KEY = 'zakat:history';
export const HISTORY_LIMIT = 5;

/** Hanya nominal zakat yang disimpan, bukan rincian harta. */
export interface HistoryEntry {
  id: string;
  type: CalculatorId;
  amount: number;
  createdAt: string;
}

const CALCULATOR_IDS: readonly string[] = ['profesi', 'maal', 'fitrah', 'perdagangan'];

const isEntry = (value: unknown): value is HistoryEntry => {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.type === 'string' &&
    CALCULATOR_IDS.includes(entry.type) &&
    typeof entry.amount === 'number' &&
    Number.isFinite(entry.amount) &&
    typeof entry.createdAt === 'string'
  );
};

export function readHistory(storage: KeyValueStorage): HistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(
  storage: KeyValueStorage,
  entry: Omit<HistoryEntry, 'id' | 'createdAt'>,
  now = new Date()
): HistoryEntry[] {
  const next = [
    { ...entry, id: `${now.getTime()}-${entry.type}`, createdAt: now.toISOString() },
    ...readHistory(storage),
  ].slice(0, HISTORY_LIMIT);
  try {
    storage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Storage penuh atau diblokir.
  }
  return next;
}

export function clearHistory(storage: KeyValueStorage) {
  try {
    storage.removeItem(HISTORY_KEY);
  } catch {
    // Abaikan.
  }
}
