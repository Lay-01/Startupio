import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleStartupApi } from './server/startupsApi.js';

const localStartupApi = {
  name: 'local-startups-api',
  configureServer: installStartupApi,
  configurePreviewServer: installStartupApi
};

function installStartupApi(server) {
    server.middlewares.use((req, res, next) => {
      const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
      let decodedPath = pathname;
      try {
        decodedPath = decodeURIComponent(pathname).replace(/\\/g, '/');
      } catch {
        res.statusCode = 400;
        return res.end('Bad request.');
      }

      if (
        decodedPath === '/server' || decodedPath.startsWith('/server/') ||
        decodedPath === '/.kilo' || decodedPath.startsWith('/.kilo/') ||
        decodedPath.toLocaleLowerCase().endsWith('.json')
      ) {
        res.statusCode = 404;
        return res.end('Not found.');
      }
      if (pathname !== '/api/startups') return next();
      return handleStartupApi(req, res);
    });
}

// Use '/' for Vercel (root deployment).
// For GitHub Pages subdirectory builds, override at build time:
//   vite build --base=/Startupio/
export default defineConfig({
  base: '/',
  plugins: [react(), localStartupApi],
  server: {
    port: 3000,
    host: true
  }
});
