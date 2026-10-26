const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

const decimalFormatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Rp 1.234.567 (spasi biasa, bukan non-breaking, agar mudah dibagikan). */
export function formatRupiah(value: number) {
  return rupiahFormatter.format(Math.round(value)).replace(/\u00a0/g, ' ');
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

/** 2.5 → '2,5'. */
export function formatDecimal(value: number) {
  return decimalFormatter.format(value);
}

/** '2026-10-25' → '25 Oktober 2026'. */
export function formatDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? isoDate : dateFormatter.format(date);
}

/** Ambil angka saja dari input bebas: 'Rp 1.500.000' → 1500000. */
export function parseDigits(input: string) {
  const digits = input.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits) : 0;
}

/**
 * Untuk teks yang ditempel (mis. saldo dari aplikasi bank): buang sen di belakang dulu
 * ('Rp1.500.000,00' atau '1,500,000.00' → 1500000). Kelompok ribuan selalu 3 digit,
 * jadi 1–2 digit setelah titik/koma terakhir pasti desimal.
 * Jangan dipakai saat mengetik: menghapus satu digit dari '1.500' menghasilkan '1.50'.
 */
export function parsePastedAmount(input: string) {
  return parseDigits(input.trim().replace(/[.,]\d{1,2}$/, ''));
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
