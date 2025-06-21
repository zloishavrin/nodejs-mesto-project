import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { Status } from '../types/responseCodes';
import { NotFoundError } from '../types/errors';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(Status.CREATED).send(card);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const { deletedCount } = await Card.deleteOne({ _id: cardId });
    if (!deletedCount) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    const message = { message: 'Пост удалён' };
    res.send(message);
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
};
