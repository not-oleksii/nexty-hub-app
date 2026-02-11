import { z } from 'zod';

export const listSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(100, 'Name is too long.')
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .regex(
          /^[A-Za-z0-9][A-Za-z0-9\s'’\-:.,!?()&/+#]*$/,
          'Name contains invalid characters.',
        ),
    ),
});

export type ListSchema = z.infer<typeof listSchema>;
