import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try { res.json(await query('SELECT * FROM services WHERE active = 1')); }
  catch (err) { next(err); }
});

export default router;
