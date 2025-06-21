import { NextFunction, Request, Response } from 'express';
import { MestoDefaultError } from '../types/errors';

export const errorHandler = (
  err: MestoDefaultError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof MestoDefaultError) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    const defaultErr = new MestoDefaultError();
    res.status(defaultErr.statusCode).send({ message: defaultErr.message });
  }
};
