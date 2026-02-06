import { ItemStatus, ItemType } from '@prisma/client';

import { getJson, postJson } from '@/server/http/get-base-url';

export type DiscoverItemDto = {
  id: string;
  type: ItemType;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  status?: ItemStatus | null;
};

type CreateDiscoverItemPayload = {
  type: ItemType;
  title: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  status?: ItemStatus;
};

type CreateDiscoverItemResponse = {
  item: DiscoverItemDto;
};

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

export async function createDiscoverItem(payload: CreateDiscoverItemPayload) {
  return postJson<CreateDiscoverItemResponse>('/api/items', payload);
}
