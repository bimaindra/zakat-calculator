import { applyTheme } from '@/lib/theme';

export function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
      aria-label="Ganti tema terang/gelap"
    >
      <svg viewBox="0 0 24 24" className="size-5 dark:hidden" aria-hidden="true">
        <path fill="currentColor" d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8.5 8.5 0 1 0 11.5 11.5Z" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden size-5 dark:block" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
