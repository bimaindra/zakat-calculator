export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://zakat.bimaindra.com').replace(
  /\/$/,
  ''
);

export const SITE_NAME = 'Kalkulator Zakat';

export const AUTHOR = {
  name: 'Bima Indra',
  url: 'https://bimaindra.com',
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;
