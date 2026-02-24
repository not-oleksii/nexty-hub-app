import { Prisma } from '@generated/prisma/client';

import { ListSchema } from '@/lib/validators/list';
import type {
  UserListDetail,
  UserListWithItemStatus,
  UserListWithProgress,
} from '@/server/lib/lists';
import { getJson, postJson, putJson } from '@/server/utils/fetch-json';

export type UserListViewDto = Omit<
  UserListWithProgress,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};

export type UserListSummaryDto = Omit<
  UserListWithProgress,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};

export type UserListDto = Prisma.UserListGetPayload<object>;

export const listsApi = {
  getAll: () => getJson<UserListSummaryDto[]>('/api/lists'),

  getPublic: () => getJson<UserListSummaryDto[]>('/api/lists/public'),

  getById: (id: string) => getJson<UserListDetail>(`/api/lists/${id}`),

  getViewById: (id: string) =>
    getJson<UserListViewDto>(`/api/lists/${id}/view`),

  create: (payload: ListSchema) => postJson<UserListDto>('/api/lists', payload),

  update: (id: string, payload: ListSchema) =>
    putJson<UserListDto>(`/api/lists/${id}`, payload),

  addOrRemoveDiscoverItemToList: (payload: {
    discoverItemId: string;
    listId?: string;
  }) => postJson<{ listId: string[] }>('/api/lists/discoverItem', payload),

  getByDiscoverItemId: (discoverItemId: string) =>
    getJson<UserListWithItemStatus[]>(
      `/api/lists/item/${encodeURIComponent(discoverItemId)}`,
    ),
};
