import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://elliotlee.info',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],
  redirects: {
    '/hobbies': '/awards',
    // Old CV filename, kept alive because the link has been shared externally.
    '/ESLee_CV_UPDATED.pdf': '/ESLEE_CV.pdf',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
