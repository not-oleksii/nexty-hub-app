import { ListVisibility } from '@generated/prisma/enums';
import { z } from 'zod';

const listVisibilityEnum = z.enum([
  ListVisibility.PRIVATE,
  ListVisibility.FRIENDS_ONLY,
  ListVisibility.PUBLIC,
]);

export const listSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(50, 'Name is too long.')
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .regex(
          /^[A-Za-z0-9][A-Za-z0-9\s'’\-:.,!?()&/+#]*$/,
          'Name contains invalid characters.',
        ),
    ),
  description: z
    .string()
    .trim()
    .max(500, 'Description is too long.')
    .optional()
    .or(z.literal('')),
  coverImageUrl: z
    .union([
      z.literal(''),
      z.string().trim().url('Enter a valid URL for cover image.'),
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Tag cannot be empty.')
        .max(30, 'Tag is too long.'),
    )
    .max(20, 'Maximum 20 tags allowed.')
    .default([]),
  memberIds: z.array(z.uuid()).max(50, 'Maximum 50 members.').default([]),
  discoverItemIds: z
    .array(z.string().uuid())
    .max(100, 'Maximum 100 items.')
    .default([]),
  visibility: listVisibilityEnum.default(ListVisibility.PRIVATE),
});

export type ListSchema = z.infer<typeof listSchema>;
