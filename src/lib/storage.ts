export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function createMemoryStorage(): KeyValueStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

/**
 * Bila browser memblokir penyimpanan situs, sekadar membaca `window.localStorage` sudah
 * melempar SecurityError. Fallback ke memori: aplikasi tetap jalan, hanya tidak tersimpan.
 */
export function resolveStorage(getStorage: () => KeyValueStorage): KeyValueStorage {
  try {
    const storage = getStorage();
    storage.getItem('');
    return storage;
  } catch {
    return createMemoryStorage();
  }
}

let browserStorage: KeyValueStorage | null = null;

/** localStorage yang aman dipakai; hanya dipanggil di browser (effect/event). */
export const getBrowserStorage = () =>
  (browserStorage ??= resolveStorage(() => window.localStorage));
