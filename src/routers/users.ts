import { Router } from 'express';
import {
  userAvatarSchema,
  userPatchSchema,
  validateParamObjectId,
  validateRequest,
} from '../middlewares/validators';
import {
  getMe,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/me', getMe);
router.get('/', getUsers);
router.get(
  '/:userId',
  validateParamObjectId('userId', 'Передан некорректный _id пользователя.'),
  getUserById,
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
