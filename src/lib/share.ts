import { absoluteUrl } from '@/config/site';
import type { CalculatorId } from '@/content/calculators';
import { formatRupiah } from './format';

/** Ajakan penutup per jenis zakat, ditulis seperti pesan WhatsApp biasa. */
const NUDGE: Record<CalculatorId, string> = {
  profesi: 'Ternyata cepat, nisabnya langsung ikut harga emas hari ini. Kamu udah hitung punyamu?',
  maal: 'Tabungan sama emas yang udah disimpan setahun ternyata ada zakatnya lho. Coba cek punyamu, siapa tahu udah sampai nisab.',
  fitrah: 'Biar nggak mepet pas Lebaran, yuk hitung punya keluargamu juga.',
  perdagangan: 'Buat yang punya usaha, coba cek zakat dagangmu juga. Cuma semenit kok.',
};

/** Teks berbagi sengaja hanya memuat jenis dan nominal zakat, tanpa rincian harta. */
export function buildShareText({
  type,
  label,
  amount,
  path,
}: {
  type: CalculatorId;
  /** Mis. "zakat profesi bulan ini". */
  label: string;
  amount: number;
  path: string;
}) {
  return [
    `Barusan ngitung ${label}, hasilnya ${formatRupiah(amount)} 🤲`,
    '',
    `${NUDGE[type]} 👇`,
    absoluteUrl(path),
  ].join('\n');
}

export const whatsappShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
