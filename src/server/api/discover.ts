import { ItemStatus, ItemType } from '@prisma/client';

import { getBaseUrl } from '@/server/http/get-base-url';

export type DiscoverItemDto = {
  id: string;
  type: ItemType;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  status?: ItemStatus | null;
};

async function getJson<T>(path: string): Promise<T> {
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

export async function getDiscoverList() {
  const data = await getJson<{ items: DiscoverItemDto[] }>('/api/discover');

  return data.items;
}

export async function getDiscoverListByType(type: ItemType) {
  const data = await getJson<{ items: DiscoverItemDto[] }>(
    `/api/discover/${type}`,
  );

  return data.items;
}

export async function getDiscoverItemById(type: ItemType, id: string) {
  const data = await getJson<{ item: DiscoverItemDto }>(
    `/api/discover/${type}/${id}`,
  );

  return data.item;
}
