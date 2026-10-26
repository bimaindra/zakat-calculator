import { Link } from '@tanstack/react-router';
import { SITE_NAME } from '@/config/site';
import { LogoMark } from './logo';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header
      data-vt="site-header"
      className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg font-bold tracking-tight">
          <LogoMark className="size-8" />
          <span className="text-lg">{SITE_NAME}</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
