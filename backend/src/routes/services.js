import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

router.get('/', async (req, res) => {
  const services = await query('SELECT * FROM services WHERE active = 1');
  res.json(services);
});

export default router;
