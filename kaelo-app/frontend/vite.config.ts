import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built into the Astro site's public/ so it is served at /kaelo-app/.
// The API lives elsewhere (see kaelo-app/README.md): set VITE_API_URL at
// build time to point at the deployed FastAPI backend.
export default defineConfig({
  plugins: [react()],
  base: '/kaelo-app/',
  build: {
    outDir: '../../public/kaelo-app',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
