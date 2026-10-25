import { AUTHOR, SITE_NAME, absoluteUrl } from '@/config/site';

export interface FaqItem {
  question: string;
  answer: string;
}

interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** Nama file di /public/og tanpa ekstensi. */
  ogImage: string;
  faq?: FaqItem[];
  breadcrumb?: string;
}

const jsonLd = (data: object) => ({
  type: 'application/ld+json',
  children: JSON.stringify(data),
});

export function pageHead({ path, title, description, ogImage, faq, breadcrumb }: PageSeo) {
  const url = absoluteUrl(path);
  const image = absoluteUrl(`/og/${ogImage}.jpg`);

  const structuredData: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      url,
      description,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: 'id-ID',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
      author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    },
  ];

  if (breadcrumb) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: breadcrumb, item: url },
      ],
    });
  }

  if (faq?.length) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'id_ID' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: structuredData.map(jsonLd),
  };
}
