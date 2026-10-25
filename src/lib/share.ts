import { absoluteUrl } from '@/config/site';
import { formatRupiah } from './format';

/** Teks berbagi sengaja hanya memuat nominal zakat, tanpa rincian harta. */
export function buildShareText({
  label,
  amount,
  path,
}: {
  label: string;
  amount: number;
  path: string;
}) {
  return `${label}: ${formatRupiah(amount)}. Hitung zakatmu di ${absoluteUrl(path)}`;
}

export const whatsappShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
