// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cakemarketingllc.com',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), sitemap()],
  vite: {
    server: {
      host: '127.0.0.1',
    },
  },
});
