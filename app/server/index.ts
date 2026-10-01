/**
 * Production server: serves the built app from ./dist and the quiz API from /api.
 *   npm run build && npm start
 * Reads AI_API_KEY (and friends) from the environment or a local .env file.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiMiddleware } from './quizApi.ts';

try {
  process.loadEnvFile();
} catch {
  // No .env file — environment variables only.
}

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT ?? 3000);
const api = createApiMiddleware(process.env);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(join(root, 'index.html'))) {
  console.error('dist/ not found — run "npm run build" first.');
  process.exit(1);
}

createServer((req, res) => {
  api(req, res, () => {
    const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    const safe = normalize(join(root, pathname));
    const isFile = safe.startsWith(root) && existsSync(safe) && statSync(safe).isFile();
    const file = isFile ? safe : join(root, 'index.html'); // SPA fallback
    res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream');
    if (isFile && pathname.startsWith('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    createReadStream(file).pipe(res);
  });
}).listen(port, () => {
  console.log(`EcoQuest running at http://localhost:${port}`);
});
