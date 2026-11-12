import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Ganti `site` bila domain produksi sudah dipastikan (dipakai sitemap & canonical).
export default defineConfig({
  site: 'https://arrustendi.vercel.app',
  integrations: [sitemap({ filter: (p) => !p.includes('/admin') })],
  vite: { plugins: [tailwindcss()] },
  trailingSlash: 'never',
  build: { format: 'file' }
});
