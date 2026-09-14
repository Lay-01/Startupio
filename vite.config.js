import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use '/' for Vercel (root deployment).
// For GitHub Pages subdirectory builds, override at build time:
//   vite build --base=/Startupio/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});
