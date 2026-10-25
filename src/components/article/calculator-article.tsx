import { useGoldPrice } from '@/context/gold-price-context';
import { ARTICLES } from '@/content/articles';
import type { CalculatorId } from '@/content/calculators';
import { ArticleContent } from './article-content';

export function CalculatorArticle({ id }: { id: CalculatorId }) {
  const { price } = useGoldPrice();
  const article = ARTICLES[id];

  return (
    <ArticleContent
      sections={article.sections}
      formula={article.formula}
      example={article.example(price.pricePerGram)}
      faq={article.faq}
      sources={article.sources}
    />
  );
}
