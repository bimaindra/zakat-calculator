import { createFileRoute } from '@tanstack/react-router';
import { FitrahCalculator } from '@/components/calculators/fitrah-calculator';

export const Route = createFileRoute('/zakat-fitrah')({
  component: FitrahCalculator,
});
