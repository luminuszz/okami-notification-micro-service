import { z } from 'zod';

export const recentNotificationsSchemaResponse = z.array(
  z.object({
    content: z.string().transform((value) => JSON.parse(value)),
    createdAt: z.date().transform((value) => value.toISOString()),
    id: z.string(),
    readAt: z.string().or(z.date()).nullable(),
  }),
);
