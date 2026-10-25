import { createFileRoute } from '@tanstack/react-router';
import { CalculatorArticle } from '@/components/article/calculator-article';
import { PerdaganganCalculator } from '@/components/calculators/perdagangan-calculator';
import { calculatorHead } from '@/content/head';

export const Route = createFileRoute('/zakat-perdagangan')({
  head: () => calculatorHead('perdagangan'),
  component: PerdaganganPage,
});

function PerdaganganPage() {
  return (
    <PerdaganganCalculator>
      <CalculatorArticle id="perdagangan" />
    </PerdaganganCalculator>
  );
}
