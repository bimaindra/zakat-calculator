export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g fill="var(--primary)">
        <rect x="6" y="6" width="20" height="20" rx="2.5" />
        <rect x="6" y="6" width="20" height="20" rx="2.5" transform="rotate(45 16 16)" />
      </g>
      <circle cx="16" cy="16" r="5" fill="var(--gold)" />
    </svg>
  );
}
