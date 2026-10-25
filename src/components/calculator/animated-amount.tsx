import { useEffect, useRef } from 'react';
import { animate } from 'motion';
import { formatRupiah } from '@/lib/format';

/** Nominal rupiah yang "menghitung" ke nilai baru; langsung lompat bila reduced motion. */
export function AnimatedAmount({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || current.current === value) {
      current.current = value;
      node.textContent = formatRupiah(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        current.current = latest;
        node.textContent = formatRupiah(latest);
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {formatRupiah(value)}
    </span>
  );
}
