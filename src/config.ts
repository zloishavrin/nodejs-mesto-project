import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url().default('mongodb://localhost:27017/mestodb'),
  JWT_SECRET: z.string().default('dev-secret-key'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Ошибка в переменных окружения:', parsedEnv.error.format());
  process.exit(1);
}

const config = {
  port: parsedEnv.data.PORT,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwtSecret: parsedEnv.data.JWT_SECRET,
};

export default config;
