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

export const discoverApi = {
  getAll: () => getJson<DiscoverItemDto[]>('/api/discover'),

  getByType: (type: ItemType) =>
    getJson<DiscoverItemDto[]>(`/api/discover/${type}`),

  getById: (id: string) =>
    getJson<DiscoverItemDto | null>(`/api/discover/item/${id}`),

  create: (payload: DiscoverItemSchema) =>
    postJson<{ item: DiscoverItemDto }>('/api/discover/item', payload),
};
