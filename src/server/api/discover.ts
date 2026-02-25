import type { DiscoverItemType, TrackingStatus } from '@generated/prisma/enums';

import { DiscoverItemSchema } from '@/lib/validators/discovery-item';
import { getJson, patchJson, postJson } from '@/server/utils/fetch-json';

export type DiscoverItemDto = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  totalUnits?: number | null;
  unitName?: string | null;
  isSaved: boolean;
  isCompleted: boolean;
  rating: number | null;
  userListsCount: number;
  trackingStatus?: TrackingStatus | null;
  progress?: number | null;
};

export type DiscoverItemSearchResult = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
};

export const discoverApi = {
  getAll: () => getJson<DiscoverItemDto[]>('/api/discover'),

  getByType: (type: DiscoverItemType) =>
    getJson<DiscoverItemDto[]>(`/api/discover/${type}`),

  getById: (id: string) =>
    getJson<DiscoverItemDto | null>(`/api/discover/item/${id}`),

  search: (query: string, limit = 20) =>
    getJson<DiscoverItemSearchResult[]>(
      `/api/discover/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    ),

  create: (payload: DiscoverItemSchema) =>
    postJson<{ item: DiscoverItemDto }>('/api/discover/item', payload),

  updateTracking: (
    itemId: string,
    payload: { status?: TrackingStatus; progress?: number },
  ) =>
    patchJson<DiscoverItemDto>(
      `/api/discover/item/${encodeURIComponent(itemId)}/track`,
      payload,
    ),
};
