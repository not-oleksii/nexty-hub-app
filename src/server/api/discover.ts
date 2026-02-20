import type { DiscoverItemType } from '@generated/prisma/enums';

import { DiscoverItemSchema } from '@/lib/validators/discovery-item';
import { getJson, postJson } from '@/server/utils/fetch-json';

export type DiscoverItemDto = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  isSaved: boolean;
  isCompleted: boolean;
};

export const discoverApi = {
  getAll: () => getJson<DiscoverItemDto[]>('/api/discover'),

  getByType: (type: DiscoverItemType) =>
    getJson<DiscoverItemDto[]>(`/api/discover/${type}`),

  getById: (id: string) =>
    getJson<DiscoverItemDto | null>(`/api/discover/item/${id}`),

  create: (payload: DiscoverItemSchema) =>
    postJson<{ item: DiscoverItemDto }>('/api/discover/item', payload),
};
