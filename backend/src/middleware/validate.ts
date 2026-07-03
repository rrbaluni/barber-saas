import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(source === 'body' ? req.body : req.query);
      if (source === 'body') {
        req.body = data;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        res.status(400).json({ error: messages.join('; ') });
        return;
      }
      next(err);
    }
  };
}
