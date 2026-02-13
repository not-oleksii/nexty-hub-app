import { DiscoverItemType } from '@generated/prisma/enums';
import { z } from 'zod';

export const discoverItemSchema = z.object({
  type: z.enum(DiscoverItemType),
  completed: z.boolean(),
  category: z.string().max(50, 'Category is too long.'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .regex(
          /^[A-Za-z0-9][A-Za-z0-9\s'’\-:.,!?()&/+#]*$/,
          'Title contains invalid characters.',
        ),
    ),
  description: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(z.string().max(1000, 'Description is max 1000 characters.')),
  imageUrl: z.union([
    z.literal(''),
    z.string().trim().url('Enter a valid URL.'),
  ]),
});

export type DiscoverItemSchema = z.infer<typeof discoverItemSchema>;
