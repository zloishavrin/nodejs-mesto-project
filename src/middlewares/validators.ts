import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import { BadRequestError } from '../types/errors';

const urlRegex = /^https?:\/\/(www\.)?[\w-]+\.[\w-._~:/?#[\]@!$&'()*+,;=]+#?$/;

export const userSchema = z.object({
  name: z.string().min(2).max(30).optional(),
  about: z.string().min(2).max(200).optional(),
  avatar: z.string().regex(urlRegex).optional(),
  email: z.string().email(),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userPatchSchema = z.object({
  name: z.string().min(2).max(30).optional(),
  about: z.string().min(2).max(200),
});

export const userAvatarSchema = z.object({
  avatar: z.string().regex(urlRegex),
});

export const cardSchema = z.object({
  name: z.string().min(2).max(30),
  link: z.string().regex(urlRegex),
});

export const validateRequest =
  (schema: z.ZodSchema, errorMessage: string = 'Ошибка') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = new BadRequestError(errorMessage);
      return next(err);
    }

    return next();
  };

export const validateParamObjectId =
  (paramName: string, errorMessage: string = 'Ошибка') =>
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    if (!Types.ObjectId.isValid(id)) {
      return next(new BadRequestError(errorMessage));
    }
    return next();
  };
