import { Router } from 'express';
import {
  userAvatarSchema,
  userPatchSchema,
  userSchema,
  validateParamObjectId,
  validateRequest,
} from '../middlewares/validators';
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get(
  '/:userId',
  validateParamObjectId('userId', 'Передан некорректный _id пользователя.'),
  getUserById,
);
router.post(
  '/',
  validateRequest(
    userSchema,
    'Переданы некорректные данные при создании пользователя.',
  ),
  createUser,
);

router.patch(
  '/me',
  validateRequest(
    userPatchSchema,
    'Переданы некорректные данные при обновлении профиля.',
  ),
  updateUser,
);
router.patch(
  '/me/avatar',
  validateRequest(
    userAvatarSchema,
    ' Переданы некорректные данные при обновлении аватара.',
  ),
  updateUserAvatar,
);

export default router;
