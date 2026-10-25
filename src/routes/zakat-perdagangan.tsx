import { createFileRoute } from '@tanstack/react-router';
import { PerdaganganCalculator } from '@/components/calculators/perdagangan-calculator';

export const Route = createFileRoute('/zakat-perdagangan')({
  component: PerdaganganCalculator,
});
