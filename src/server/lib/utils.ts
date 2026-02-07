import { ItemType } from '@generated/prisma/enums';

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

async function resolveRequestUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (typeof window !== 'undefined') {
    return path;
  }

  const { getBaseUrl } = await import('@/server/http/get-base-url');
  const baseUrl = await getBaseUrl();

  return new URL(path, baseUrl).toString();
}

export async function getJson<T>(path: string): Promise<T> {
  const url = await resolveRequestUrl(path);
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = await resolveRequestUrl(path);
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
