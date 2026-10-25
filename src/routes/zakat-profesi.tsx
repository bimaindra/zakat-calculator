import { createFileRoute } from '@tanstack/react-router';
import { ProfesiCalculator } from '@/components/calculators/profesi-calculator';

export const Route = createFileRoute('/zakat-profesi')({
  component: ProfesiCalculator,
});
