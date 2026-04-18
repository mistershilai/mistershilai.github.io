import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mistershilai.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
