import express from 'express';
import cors from 'cors';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { initDb } from './db/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import barbersRouter from './routes/barbers.js';
import servicesRouter from './routes/services.js';
import bookingsRouter from './routes/bookings.js';
import adminRouter from './routes/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/barbers', barbersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const staticDir = join(__dirname, '..', '..', 'frontend', 'dist');
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(staticDir, 'index.html'));
    }
  });
}

app.use(errorHandler);

await initDb();
console.log('Database initialized');

app.listen(PORT, () => console.log(`Barber API running on http://localhost:${PORT}`));
