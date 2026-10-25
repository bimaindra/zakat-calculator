import { createFileRoute } from '@tanstack/react-router';
import { CalculatorArticle } from '@/components/article/calculator-article';
import { ProfesiCalculator } from '@/components/calculators/profesi-calculator';
import { calculatorHead } from '@/content/head';

export const Route = createFileRoute('/zakat-profesi')({
  head: () => calculatorHead('profesi'),
  component: ProfesiPage,
});

function ProfesiPage() {
  return (
    <ProfesiCalculator>
      <CalculatorArticle id="profesi" />
    </ProfesiCalculator>
  );
}
