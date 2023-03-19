import { NextFunction, Request, Response } from 'express';
import { AnyObject } from 'yup';

export const validate =
  (schema: AnyObject) => (req: Request, res: Response, next: NextFunction) => {
    schema
      .validate(req.body)
      .then(() => {
        next();
      })
      .catch((err: any) => {
        return res.status(400).json({ error: err.message });
      });
  };

export default validate;
