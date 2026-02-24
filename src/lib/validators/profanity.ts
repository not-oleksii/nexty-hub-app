import { Filter } from 'bad-words';
import { z } from 'zod';

export const PROFANITY_MESSAGE =
  'This field contains language that violates our community guidelines.';

const filter = new Filter();

export function containsProfanity(value: string): boolean {
  return filter.isProfane(value);
}

export function noProfanity(message = PROFANITY_MESSAGE) {
  return z.string().refine((value) => !containsProfanity(value), { message });
}
