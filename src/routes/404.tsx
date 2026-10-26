import { createFileRoute } from '@tanstack/react-router';
import { NotFound } from '@/components/not-found';

// Diprerender menjadi 404.html, yang otomatis dipakai Cloudflare untuk URL tak dikenal.
export const Route = createFileRoute('/404')({
  component: NotFound,
});
