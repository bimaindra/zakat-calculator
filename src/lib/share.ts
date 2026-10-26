import { absoluteUrl } from '@/config/site';
import type { CalculatorId } from '@/content/calculators';
import { formatRupiah } from './format';

/** Kalimat penutup sebelum tautan, sesantai pesan WhatsApp ke teman. */
const CLOSING: Record<CalculatorId, string> = {
  profesi: 'Aku ngitungnya pakai ini, gampang kok:',
  maal: 'Kalau mau cek punyamu juga, aku pakai ini:',
  fitrah: 'Yang belum ngitung, bisa pakai ini:',
  perdagangan: 'Aku ngitungnya pakai ini, kalau mau coba:',
};

/** Teks berbagi sengaja hanya memuat jenis dan nominal zakat, tanpa rincian harta. */
export function buildShareText({
  type,
  label,
  amount,
  path,
}: {
  type: CalculatorId;
  /** Awal kalimat, mis. "Zakat profesiku bulan ini". */
  label: string;
  amount: number;
  path: string;
}) {
  return `${label} ${formatRupiah(amount)}. ${CLOSING[type]}\n${absoluteUrl(path)}`;
}

export const whatsappShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
