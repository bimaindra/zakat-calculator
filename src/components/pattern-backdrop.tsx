import { cn } from '@/lib/format';

const FADES = {
  bottom: '[mask-image:linear-gradient(to_bottom,black,transparent)]',
  radial: '[mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]',
  none: '',
} as const;

/** Pola bintang khatam dekoratif; fade dipisah ke wrapper agar tidak menimpa mask pola. */
export function PatternBackdrop({
  fade = 'none',
  className,
}: {
  fade?: keyof typeof FADES;
  className?: string;
}) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', FADES[fade], className)}
      aria-hidden="true"
    >
      <div className="geometric-pattern absolute inset-0" />
    </div>
  );
}
