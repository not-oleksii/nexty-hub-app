import z from 'zod';

import { noProfanity } from './profanity';

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters long.')
      .max(20, 'Username must be less than 20 characters long.')
      .transform((val) => val.replace(/\s+/g, ' '))
      .pipe(
        z
          .string()
          .regex(
            /^[a-zA-Z0-9]+$/,
            'Username must contain only letters and numbers.',
          ),
      )
      .pipe(noProfanity()),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters long.')
      .max(30, 'Password must be less than 20 characters long.'),
    confirmPassword: z.string().trim().min(1, 'Confirm password is required.'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

export type SignupSchema = z.infer<typeof signupSchema>;
