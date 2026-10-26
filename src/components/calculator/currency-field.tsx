import { useId, useLayoutEffect, useRef, type ChangeEvent } from 'react';
import { formatNumber, parseDigits } from '@/lib/format';

const MAX_VALUE = 999_999_999_999_999;

interface CurrencyFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  placeholder?: string;
  /** Tampilkan penanda "Opsional" di samping label. */
  optional?: boolean;
}

export function CurrencyField({
  label,
  value,
  onChange,
  hint,
  placeholder = '0',
  optional = false,
}: CurrencyFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);

  // Setelah angka diformat ulang (titik ribuan), kembalikan kursor ke digit yang sama.
  useLayoutEffect(() => {
    const input = inputRef.current;
    const digitsBefore = caretDigits.current;
    if (!input || digitsBefore === null || document.activeElement !== input) return;
    let position = 0;
    let seen = 0;
    while (position < input.value.length && seen < digitsBefore) {
      if (/\d/.test(input.value[position])) seen += 1;
      position += 1;
    }
    input.setSelectionRange(position, position);
    caretDigits.current = null;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: raw, selectionStart } = event.target;
    caretDigits.current = raw.slice(0, selectionStart ?? raw.length).replace(/\D/g, '').length;
    onChange(Math.min(parseDigits(raw), MAX_VALUE));
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold">
        {label}
        {optional && (
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-muted">
            Opsional
          </span>
        )}
      </label>
      <div className="group relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 grid w-12 place-items-center text-sm font-semibold text-ink-muted"
          aria-hidden="true"
        >
          Rp
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          enterKeyHint="next"
          value={value ? formatNumber(value) : ''}
          onChange={handleChange}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="tabular h-13 w-full rounded-xl border border-line bg-surface pr-4 pl-12 text-lg font-semibold transition-[border-color,box-shadow] outline-none placeholder:text-ink-muted/50 hover:border-ink-muted/40 focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
