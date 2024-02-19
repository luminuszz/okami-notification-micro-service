import { z } from 'zod';

export const envSchema = z.object({
  DB_PORT: z.coerce.number().optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  AMQP_URL: z.string(),
  DATABASE_URL: z.string(),
  ONE_SIGNAL_SERVICE_ENDPOINT: z.string(),
  ONE_SIGNAL_API_TOKEN: z.string(),
  ONE_SIGNAL_APP_ID: z.string(),
  WEB_PUSH_PUBLIC_KEY: z.string(),
  WEB_PUSH_PRIVATE_KEY: z.string(),
  TELEGRAM_NOTIFICATION_BOT: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
