import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        // /zakat-maal -> zakat-maal.html so Cloudflare serves it without a trailing-slash redirect.
        autoSubfolderIndex: false,
      },
    }),
    // The React plugin must come after the Start plugin.
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
