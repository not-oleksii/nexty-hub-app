import type { Prisma } from '@generated/prisma/client';
import type { ItemType } from '@generated/prisma/enums';

import { getJson, postJson } from '@/server/utils/fetch-json';

export type DiscoverItemDto = Prisma.DiscoverItemGetPayload<{
  include: {
    usersSaved: { select: { id: true } };
    usersCompleted: { select: { id: true } };
  };
}> & {
  isSaved: boolean;
  isCompleted: boolean;
};

type DiscoverItemBase = Prisma.DiscoverItemGetPayload<{}>;

type CreateDiscoverItemPayload = {
  type: ItemType;
  category?: string | null;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  completed?: boolean;
};

type CreateDiscoverItemResponse = {
  item: DiscoverItemBase;
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
  const data = await getJson<{ item: DiscoverItemDto | null }>(
    `/api/discover/${type}/${id}`,
  );

  return data.item;
}

export async function createDiscoverItem(payload: CreateDiscoverItemPayload) {
  return postJson<CreateDiscoverItemResponse>('/api/items', payload);
}
