import { createFileRoute } from '@tanstack/react-router';
import { CalculatorArticle } from '@/components/article/calculator-article';
import { FitrahCalculator } from '@/components/calculators/fitrah-calculator';
import { calculatorHead } from '@/content/head';

export const Route = createFileRoute('/zakat-fitrah')({
  head: () => calculatorHead('fitrah'),
  component: FitrahPage,
});

function FitrahPage() {
  return (
    <FitrahCalculator>
      <CalculatorArticle id="fitrah" />
    </FitrahCalculator>
  );
}
