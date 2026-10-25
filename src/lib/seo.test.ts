import { describe, expect, it } from 'vitest';
import { pageHead } from './seo';

describe('pageHead', () => {
  const head = pageHead({
    path: '/zakat-maal',
    title: 'Kalkulator Zakat Maal',
    description: 'Hitung zakat maal.',
    ogImage: 'maal',
    breadcrumb: 'Zakat Maal',
    faq: [{ question: 'Apa itu haul?', answer: 'Satu tahun hijriah.' }],
  });

  it('sets a canonical URL on the production domain', () => {
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://zakat.bimaindra.com/zakat-maal',
    });
  });

  it('emits Open Graph and Twitter tags with an absolute image URL', () => {
    expect(head.meta).toContainEqual({
      property: 'og:image',
      content: 'https://zakat.bimaindra.com/og/maal.jpg',
    });
    expect(head.meta).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' });
  });

  it('emits WebApplication, BreadcrumbList and FAQPage JSON-LD', () => {
    const types = head.scripts.map((script) => JSON.parse(script.children)['@type']);
    expect(types).toEqual(['WebApplication', 'BreadcrumbList', 'FAQPage']);
  });
});
