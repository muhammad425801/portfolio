import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDevServer() {
  const app = express();

  const vite = await createViteServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  // Example API route - add your actual API routes here
  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from API!' });
  });

  // Serve index.html for all other requests (SPA fallback)
  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      let html = await vite.transformIndexHtml(url, path.resolve(__dirname, '../client/index.html'));
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Vite client served from ${vite.config.root}`);
  });
}

createDevServer();