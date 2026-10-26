import { describe, expect, it } from 'vitest';
import { buildShareText, whatsappShareUrl } from './share';

describe('share', () => {
  it('includes only the zakat type, amount and a link', () => {
    expect(
      buildShareText({
        type: 'profesi',
        label: 'Zakat profesiku bulan ini',
        amount: 625_000,
        path: '/zakat-profesi',
      })
    ).toBe(
      'Zakat profesiku bulan ini Rp 625.000. Aku ngitungnya pakai ini, gampang kok:\nhttps://zakat.bimaindra.com/zakat-profesi'
    );
  });

  it('uses a closing line per zakat type', () => {
    const text = buildShareText({
      type: 'fitrah',
      label: 'Zakat fitrah keluargaku',
      amount: 188_000,
      path: '/zakat-fitrah',
    });
    expect(text).toBe(
      'Zakat fitrah keluargaku Rp 188.000. Yang belum ngitung, bisa pakai ini:\nhttps://zakat.bimaindra.com/zakat-fitrah'
    );
  });

  it('url-encodes WhatsApp text', () => {
    expect(whatsappShareUrl('a b&c\nd')).toBe('https://wa.me/?text=a%20b%26c%0Ad');
  });
});
