import { useSyncExternalStore } from 'react';
import { addHistoryEntry, clearHistory, readHistory, type HistoryEntry } from '@/lib/history';

const listeners = new Set<() => void>();
const EMPTY: HistoryEntry[] = [];
let snapshot: HistoryEntry[] | null = null;

const emit = () => {
  snapshot = null;
  listeners.forEach((listener) => listener());
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Sinkron antar-tab.
  window.addEventListener('storage', emit);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', emit);
  };
}

const getSnapshot = () => (snapshot ??= readHistory(localStorage));

export function useHistory() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  return {
    entries,
    add: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => {
      addHistoryEntry(localStorage, entry);
      emit();
    },
    clear: () => {
      clearHistory(localStorage);
      emit();
    },
  };
}
