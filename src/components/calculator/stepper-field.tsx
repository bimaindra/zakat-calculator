import { useId } from 'react';

interface StepperFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  hint?: string;
}

export function StepperField({
  label,
  value,
  onChange,
  min = 1,
  max = 50,
  unit,
  hint,
}: StepperFieldProps) {
  const id = useId();
  const clamp = (next: number) => Math.min(max, Math.max(min, Number.isFinite(next) ? next : min));
  const buttonClass =
    'grid size-13 shrink-0 place-items-center rounded-xl border border-line bg-surface text-xl font-semibold transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40';

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          aria-label={`Kurangi ${label.toLowerCase()}`}
        >
          −
        </button>
        <div className="relative flex-1">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={value}
            onChange={(event) => onChange(clamp(Math.floor(Number(event.target.value))))}
            aria-describedby={hint ? `${id}-hint` : undefined}
            className="tabular h-13 w-full [appearance:textfield] rounded-xl border border-line bg-surface px-4 text-center text-lg font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && (
            <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-sm text-ink-muted">
              {unit}
            </span>
          )}
        </div>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          aria-label={`Tambah ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
