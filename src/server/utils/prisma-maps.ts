import { DiscoverItemType } from '@generated/prisma/enums';

const itemTypeMap: Record<string, DiscoverItemType> = {
  movie: DiscoverItemType.MOVIE,
  series: DiscoverItemType.SERIES,
  game: DiscoverItemType.GAME,
  book: DiscoverItemType.BOOK,
  course: DiscoverItemType.COURSE,
  other: DiscoverItemType.OTHER,
};

const PrismaItemTypeMap: Record<DiscoverItemType, string> = {
  [DiscoverItemType.MOVIE]: 'movie',
  [DiscoverItemType.SERIES]: 'series',
  [DiscoverItemType.GAME]: 'game',
  [DiscoverItemType.BOOK]: 'book',
  [DiscoverItemType.COURSE]: 'course',
  [DiscoverItemType.OTHER]: 'other',
};

export function mapItemTypeToPrisma(type: string): DiscoverItemType {
  return itemTypeMap[type.toLowerCase()];
}

export function mapPrismaToItemType(type: DiscoverItemType): string {
  return PrismaItemTypeMap[type];
}
