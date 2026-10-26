import type { ReactNode } from 'react';
import type { CalculatorId } from '@/content/calculators';
import { cn } from '@/lib/format';

// Garis memakai currentColor (hijau), aksen emas memakai var(--gold).
const GLYPHS: Record<CalculatorId, ReactNode> = {
  // Tas kerja: gaji dan penghasilan profesi.
  profesi: (
    <>
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M3 12.5h18" />
      <rect x="10" y="11" width="4" height="3.5" rx="1" fill="var(--gold)" />
    </>
  ),
  // Tumpukan koin emas: harta simpanan.
  maal: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" fill="var(--gold)" />
      <path d="M5 6v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V6" />
      <path d="M5 10v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-4" />
      <path d="M5 14v4c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-4" />
    </>
  ),
  // Mangkuk beras: 2,5 kg beras per jiwa.
  fitrah: (
    <>
      <path d="M6 11a6 4.5 0 0 1 12 0Z" fill="var(--gold)" />
      <path d="M3 11h18a9 7 0 0 1-18 0Z" />
      <path d="M9.5 20.5h5" />
      <path d="M10 4.5l.5 1.5M14 4.5l-.5 1.5M12 3.5v1.75" />
    </>
  ),
  // Toko dengan kanopi: usaha dan perdagangan.
  perdagangan: (
    <>
      <path d="M4.5 4h15L21 9a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" fill="var(--gold)" />
      <path d="M4.5 12v8h15v-8" />
      <path d="M10 20v-4.5h4V20" />
    </>
  ),
};

export function ZakatIcon({ type, className }: { type: CalculatorId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[type]}
    </svg>
  );
}

/** Ikon dalam ubin berwarna lembut. Ukuran dan sudut ubin diatur lewat className (tanpa tailwind-merge). */
export function ZakatIconTile({
  type,
  className,
  iconClassName = 'size-7',
}: {
  type: CalculatorId;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn('grid shrink-0 place-items-center bg-primary-soft text-primary', className)}
    >
      <ZakatIcon type={type} className={iconClassName} />
    </span>
  );
}
