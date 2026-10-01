import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { createApiMiddleware } from './server/quizApi.ts';

/** Mounts the EcoQuest quiz API (/api/*) on the dev and preview servers, so `npm run dev` is all you need. */
function ecoquestApi(env: Record<string, string>): Plugin {
  const middleware = createApiMiddleware(env);
  return {
    name: 'ecoquest-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  // Loads every variable (not only VITE_*) for the server-side API. Only VITE_* reach the browser bundle.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), ecoquestApi(env)],
    server: {
      port: 5174,
      host: true, // Listen on all network addresses (0.0.0.0) for Android device / emulator testing
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
    },
  };
});
