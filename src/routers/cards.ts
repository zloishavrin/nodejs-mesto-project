import { Router } from 'express';
import {
  cardSchema,
  validateParamObjectId,
  validateRequest,
} from '../middlewares/validators';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.post(
  '/',
  validateRequest(
    cardSchema,
    'Переданы некорректные данные при создании карточки.',
  ),
  createCard,
);
router.delete(
  '/:cardId',
  validateParamObjectId('cardId', 'Передан некорректный _id карточки.'),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  validateParamObjectId(
    'cardId',
    'Переданы некорректные данные для постановки/снятия лайка или некорректный _id карточки.',
  ),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  validateParamObjectId(
    'cardId',
    'Переданы некорректные данные для постановки/снятия лайка или некорректный _id карточки.',
  ),
  dislikeCard,
);

export default router;
