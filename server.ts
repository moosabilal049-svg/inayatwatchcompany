import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/api';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing with generous limit for product and brand image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Static uploads serving
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // API Routes first
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'Inayat Watch Company' });
  });

  app.use('/api', apiRouter);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inayat Watch Company server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
