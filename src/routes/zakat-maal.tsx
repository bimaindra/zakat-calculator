import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/zakat-maal')({
  component: Page,
});

function Page() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Zakat maal</h1>
    </main>
  );
}
