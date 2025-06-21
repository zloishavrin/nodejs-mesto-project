import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import { BadRequestError } from '../types/errors';

export const userSchema = z.object({
  name: z.string().min(2).max(30),
  about: z.string().min(2).max(200),
  avatar: z.string().url(),
});

export const userPatchSchema = z.object({
  name: z.string().min(2).max(30),
  about: z.string().min(2).max(200),
});

export const userAvatarSchema = z.object({
  avatar: z.string().url(),
});

export const cardSchema = z.object({
  name: z.string().min(2).max(30),
  link: z.string().url(),
});

export const validateRequest =
  (schema: z.ZodSchema, errorMessage: string = 'Ошибка') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = new BadRequestError(errorMessage);
      next(err);
    }

    next();
  };

export const validateParamObjectId =
  (paramName: string, errorMessage: string = 'Ошибка') =>
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    if (!Types.ObjectId.isValid(id)) {
      next(new BadRequestError(errorMessage));
    }
    next();
  };
