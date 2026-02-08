import { ItemType } from '@generated/prisma/enums';

import { ApiErrorType } from '@/app/api/error-types';

const itemTypeMap: Record<string, ItemType> = {
  movie: ItemType.MOVIE,
  series: ItemType.SERIES,
  game: ItemType.GAME,
  book: ItemType.BOOK,
  course: ItemType.COURSE,
  other: ItemType.OTHER,
};

const PrismaItemTypeMap: Record<ItemType, string> = {
  [ItemType.MOVIE]: 'movie',
  [ItemType.SERIES]: 'series',
  [ItemType.GAME]: 'game',
  [ItemType.BOOK]: 'book',
  [ItemType.COURSE]: 'course',
  [ItemType.OTHER]: 'other',
};

export function mapItemTypeToPrisma(type: string): ItemType {
  return itemTypeMap[type.toLowerCase()];
}

export function mapPrismaToItemType(type: ItemType): string {
  return PrismaItemTypeMap[type];
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return ApiErrorType.UNKNOWN_ERROR;
}
