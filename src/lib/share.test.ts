import { describe, expect, it } from 'vitest';
import { buildShareText, whatsappShareUrl } from './share';

describe('share', () => {
  it('includes only the zakat amount and a link', () => {
    expect(
      buildShareText({ label: 'Zakat profesi saya', amount: 625_000, path: '/zakat-profesi' })
    ).toBe(
      'Zakat profesi saya: Rp 625.000. Hitung zakatmu di https://zakat.bimaindra.com/zakat-profesi'
    );
  });

  it('url-encodes WhatsApp text', () => {
    expect(whatsappShareUrl('a b&c')).toBe('https://wa.me/?text=a%20b%26c');
  });
});
