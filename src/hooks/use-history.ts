import { useSyncExternalStore } from 'react';
import {
  addHistoryEntry,
  clearHistory,
  readHistory,
  HISTORY_KEY,
  type HistoryEntry,
} from '@/lib/history';
import { getBrowserStorage } from '@/lib/storage';

const listeners = new Set<() => void>();
const EMPTY: HistoryEntry[] = [];
let snapshot: HistoryEntry[] | null = null;

const emit = () => {
  snapshot = null;
  listeners.forEach((listener) => listener());
};

function onStorage(event: StorageEvent) {
  if (
    event.storageArea === getBrowserStorage() &&
    (event.key === HISTORY_KEY || event.key === null)
  ) {
    emit();
  }
}

function subscribe(listener: () => void) {
  // Other tabs may have changed storage while no history component was mounted.
  if (listeners.size === 0) snapshot = null;
  listeners.add(listener);
  // Sinkron antar-tab.
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

const getSnapshot = () => (snapshot ??= readHistory(getBrowserStorage()));

export function useHistory() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  return {
    entries,
    add: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => {
      addHistoryEntry(getBrowserStorage(), entry);
      emit();
    },
    clear: () => {
      clearHistory(getBrowserStorage());
      emit();
    },
  };
}
