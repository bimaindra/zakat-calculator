import { beforeEach, expect, it, vi } from 'vitest';
import { createMemoryStorage } from '@/lib/storage';
import { addHistoryEntry, clearHistory, HISTORY_KEY } from '@/lib/history';

const store = vi.hoisted(() => ({
  subscribe: (_listener: () => void): (() => void) => {
    throw new Error('Hook not initialized');
  },
  getSnapshot: (): unknown => {
    throw new Error('Hook not initialized');
  },
}));
vi.mock('react', () => ({
  useSyncExternalStore: (subscribe: typeof store.subscribe, getSnapshot: () => unknown) => {
    store.subscribe = subscribe;
    store.getSnapshot = getSnapshot;
    return getSnapshot();
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal(
    'window',
    Object.assign(new EventTarget(), { localStorage: createMemoryStorage() })
  );
});

it('refreshes history changed in another tab while unsubscribed', async () => {
  const { useHistory } = await import('./use-history');
  useHistory();
  const unsubscribe = store.subscribe(vi.fn());
  unsubscribe();
  addHistoryEntry(window.localStorage, { type: 'maal', amount: 100 });
  const notify = vi.fn();
  store.subscribe(notify)();
  expect(store.getSnapshot()).toMatchObject([{ type: 'maal', amount: 100 }]);
});

it('updates for history saves, deletion and storage clearing in another tab', async () => {
  const { useHistory } = await import('./use-history');
  useHistory();
  const notify = vi.fn();
  const unsubscribe = store.subscribe(notify);
  const dispatch = (key: string | null, storageArea = window.localStorage) =>
    window.dispatchEvent(Object.assign(new Event('storage'), { key, storageArea }));
  addHistoryEntry(window.localStorage, { type: 'fitrah', amount: 50000 });
  dispatch(HISTORY_KEY);
  expect(store.getSnapshot()).toMatchObject([{ amount: 50000 }]);
  clearHistory(window.localStorage);
  dispatch(null);
  expect(store.getSnapshot()).toEqual([]);
  expect(notify).toHaveBeenCalledTimes(2);
  dispatch('unrelated');
  dispatch(HISTORY_KEY, createMemoryStorage() as Storage);
  expect(notify).toHaveBeenCalledTimes(2);
  unsubscribe();
});
