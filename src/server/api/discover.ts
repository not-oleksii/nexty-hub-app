import type { Prisma } from '@generated/prisma/client';
import type { ItemType } from '@generated/prisma/enums';

import { DiscoverItemSchema } from '@/lib/validators/discovery-item';
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

type CreateDiscoverItemResponse = {
  item: DiscoverItemBase;
};

export const discoverApi = {
  getDiscoverList: () => getJson<{ items: DiscoverItemDto[] }>('/api/discover'),

  getDiscoverListByType: (type: ItemType) =>
    getJson<{ items: DiscoverItemDto[] }>(`/api/discover/${type}`),

  getDiscoverItemById: (id: string) =>
    getJson<{ item: DiscoverItemDto | null }>(`/api/discover/item/${id}`),

  createDiscoverItem: (payload: DiscoverItemSchema) =>
    postJson<CreateDiscoverItemResponse>('/api/discover/item', payload),
};
