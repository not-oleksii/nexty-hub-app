import { ItemType } from '@prisma/client';

import { getBaseUrl } from '@/server/http/get-base-url';

export async function getJson<T>(path: string): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = new URL(path, baseUrl);

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = new URL(path, baseUrl);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      typeof error?.error === 'string'
        ? error.error
        : `Request failed: ${res.status} ${res.statusText}`;

    throw new Error(message);
  }

  return (await res.json()) as T;
}

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
