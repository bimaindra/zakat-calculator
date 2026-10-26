import { describe, expect, it } from 'vitest';
import { buildShareText, whatsappShareUrl } from './share';

describe('share', () => {
  it('includes only the zakat type, amount, a nudge and a link', () => {
    expect(
      buildShareText({
        type: 'profesi',
        label: 'zakat profesi bulan ini',
        amount: 625_000,
        path: '/zakat-profesi',
      })
    ).toBe(
      [
        'Barusan ngitung zakat profesi bulan ini, hasilnya Rp 625.000 🤲',
        '',
        'Ternyata cepat, nisabnya langsung ikut harga emas hari ini. Kamu udah hitung punyamu? 👇',
        'https://zakat.bimaindra.com/zakat-profesi',
      ].join('\n')
    );
  });

  it('uses a nudge that fits the zakat type', () => {
    const text = buildShareText({
      type: 'fitrah',
      label: 'zakat fitrah sekeluarga',
      amount: 188_000,
      path: '/zakat-fitrah',
    });
    expect(text).toContain('Lebaran');
    expect(text).not.toContain('nisab');
  });

  it('url-encodes WhatsApp text', () => {
    expect(whatsappShareUrl('a b&c\nd')).toBe('https://wa.me/?text=a%20b%26c%0Ad');
  });
});
