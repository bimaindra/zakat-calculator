import { useId } from 'react';
import { cn } from '@/lib/format';

interface SegmentedFieldProps<T extends string> {
  label: string;
  options: readonly [{ value: T; label: string }, { value: T; label: string }];
  value: T;
  onChange: (value: T) => void;
  hint?: string;
}

/** Pilihan dua opsi berbasis radio button; penanda aktif bergeser dengan CSS saja. */
export function SegmentedField<T extends string>({
  label,
  options,
  value,
  onChange,
  hint,
}: SegmentedFieldProps<T>) {
  const id = useId();
  const isSecond = value === options[1].value;

  return (
    <fieldset className="space-y-2" aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="mb-2 block text-sm font-semibold">{label}</legend>
      <div className="relative grid grid-cols-2 rounded-xl border border-line bg-surface-muted p-1">
        <span
          className={cn(
            'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-primary shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isSecond && 'translate-x-full'
          )}
          aria-hidden="true"
        />
        {options.map((option) => (
          <label
            key={option.value}
            className="relative z-10 cursor-pointer rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-ink-muted transition-colors not-has-checked:hover:text-ink has-checked:text-on-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
          >
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
    </fieldset>
  );
}
