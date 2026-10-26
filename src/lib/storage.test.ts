import { describe, expect, it } from 'vitest';
import { createMemoryStorage, resolveStorage } from './storage';

describe('resolveStorage', () => {
  it('returns the real storage when it works', () => {
    const storage = createMemoryStorage();
    expect(resolveStorage(() => storage)).toBe(storage);
  });

  it('falls back to memory when accessing storage throws (site data blocked)', () => {
    const storage = resolveStorage(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });
    storage.setItem('a', '1');
    expect(storage.getItem('a')).toBe('1');
    storage.removeItem('a');
    expect(storage.getItem('a')).toBeNull();
  });

  it('falls back when reading throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {},
      removeItem: () => {},
    };
    expect(resolveStorage(() => broken)).not.toBe(broken);
  });
});
