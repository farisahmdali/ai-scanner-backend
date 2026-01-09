import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validationPipe = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: err.errors,
      });
    }
  };
};
