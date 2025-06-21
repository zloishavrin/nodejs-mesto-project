import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../types/errors';
import { Status } from '../types/responseCodes';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(Status.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      }
      return next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }

      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки.');
      }

      return card.deleteOne();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new NotFoundError('Передан несуществующий _id карточки.'),
        );
      }
      return res.send(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new NotFoundError('Передан несуществующий _id карточки.'),
        );
      }
      return res.send(card);
    })
    .catch(next);
};
