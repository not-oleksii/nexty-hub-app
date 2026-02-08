import { DiscoverItem } from '@generated/prisma/browser';
import type { ItemType } from '@generated/prisma/enums';

import { getJson, postJson } from '@/server/lib/fetch-json';

type CreateDiscoverItemPayload = Omit<
  DiscoverItem,
  'id' | 'createdAt' | 'updatedAt'
>;

type CreateDiscoverItemResponse = {
  item: DiscoverItem;
};

export async function getDiscoverList() {
  const data = await getJson<{ items: DiscoverItem[] }>('/api/discover');

  return data.items;
}

export async function getDiscoverListByType(type: ItemType) {
  const data = await getJson<{ items: DiscoverItem[] }>(
    `/api/discover/${type}`,
  );

  return data.items;
}

export async function getDiscoverItemById(type: ItemType, id: string) {
  const data = await getJson<{ item: DiscoverItem }>(
    `/api/discover/${type}/${id}`,
  );

  return data.item;
}

export async function createDiscoverItem(payload: CreateDiscoverItemPayload) {
  return postJson<CreateDiscoverItemResponse>('/api/items', payload);
}
