// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cakemarketingllc.com',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    server: {
      host: '127.0.0.1',
    },
  },
});
