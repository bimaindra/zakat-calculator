import { createFileRoute } from '@tanstack/react-router';
import { CalculatorArticle } from '@/components/article/calculator-article';
import { MaalCalculator } from '@/components/calculators/maal-calculator';
import { calculatorHead } from '@/content/head';

export const Route = createFileRoute('/zakat-maal')({
  head: () => calculatorHead('maal'),
  component: MaalPage,
});

function MaalPage() {
  return (
    <MaalCalculator>
      <CalculatorArticle id="maal" />
    </MaalCalculator>
  );
}
