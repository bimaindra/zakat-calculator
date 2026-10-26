import { useGoldPrice } from '@/context/gold-price-context';
import { ARTICLES } from '@/content/articles';
import { getCalculator, type CalculatorId } from '@/content/calculators';
import { ArticleContent } from './article-content';

export function CalculatorArticle({ id }: { id: CalculatorId }) {
  const { price, isPricePending } = useGoldPrice();
  const article = ARTICLES[id];

  return (
    <ArticleContent
      sections={article.sections}
      formula={article.formula}
      example={article.example(price.pricePerGram)}
      examplePending={getCalculator(id).usesGoldPrice && isPricePending}
      faq={article.faq}
      sources={article.sources}
    />
  );
}
