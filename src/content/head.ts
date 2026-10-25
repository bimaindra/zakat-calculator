import { pageHead } from '@/lib/seo';
import { ARTICLES, HOME_ARTICLE } from './articles';
import { getCalculator, type CalculatorId } from './calculators';

export const homeHead = () =>
  pageHead({
    path: '/',
    title: HOME_ARTICLE.seoTitle,
    description: HOME_ARTICLE.description,
    ogImage: 'home',
    faq: HOME_ARTICLE.faq,
  });

export const calculatorHead = (id: CalculatorId) => {
  const article = ARTICLES[id];
  return pageHead({
    path: getCalculator(id).path,
    title: article.seoTitle,
    description: article.description,
    ogImage: id,
    faq: article.faq,
    breadcrumb: article.breadcrumb,
  });
};
