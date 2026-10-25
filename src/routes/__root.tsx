import type { ReactNode } from 'react';
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SkipLink } from '@/components/skip-link';
import { GoldPriceProvider } from '@/context/gold-price-context';
import { themeInitScript } from '@/lib/theme';
import appCss from '@/styles/app.css?url';
import fontUrl from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#fbf8f1', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#0d1f1a', media: '(prefers-color-scheme: dark)' },
      { title: 'Kalkulator Zakat' },
    ],
    links: [
      { rel: 'preload', href: fontUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
    scripts: [{ children: themeInitScript }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <GoldPriceProvider>
        <SkipLink />
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </GoldPriceProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
