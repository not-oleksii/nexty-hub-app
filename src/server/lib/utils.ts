import { ItemType } from '@prisma/client';

const itemTypeMap: Record<string, ItemType> = {
  movie: ItemType.MOVIE,
  movies: ItemType.MOVIE,
  series: ItemType.SERIES,
  game: ItemType.GAME,
  games: ItemType.GAME,
  book: ItemType.BOOK,
  books: ItemType.BOOK,
  course: ItemType.COURSE,
};

export function mapItemTypeToPrisma(type: string): ItemType {
  return itemTypeMap[type.toLowerCase()];
}
