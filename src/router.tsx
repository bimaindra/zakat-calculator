import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Crossfade antarhalaman lewat View Transitions API (animasinya di app.css).
    defaultViewTransition: true,
  });
}
