import { createFileRoute } from '@tanstack/react-router';
import { MaalCalculator } from '@/components/calculators/maal-calculator';

export const Route = createFileRoute('/zakat-maal')({
  component: MaalCalculator,
});
