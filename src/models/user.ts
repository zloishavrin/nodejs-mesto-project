import { model, Schema } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../types/errors';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v: string) {
          return /^https?:\/\/(www\.)?[\w-]+\.[\w-._~:/?#[\]@!$&'()*+,;=]+#?$/.test(v);
        },
        message: 'Некорректный формат URL аватара',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user: IUser | null) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }

      return bcrypt.compare(password, user.password!).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }

        return user;
      });
    });
};

export default model<IUser>('user', userSchema);
