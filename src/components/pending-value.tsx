import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

/**
 * Menyamarkan angka yang belum final (mis. harga emas bawaan dari prerender) dengan skeleton
 * selebar teksnya, supaya tidak terlihat "lompat" saat harga asli dimuat.
 */
export function PendingValue({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(pending && 'animate-pulse rounded-md bg-ink/10 text-transparent select-none')}
      aria-hidden={pending || undefined}
    >
      {children}
    </span>
  );
}
