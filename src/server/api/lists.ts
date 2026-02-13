import { Prisma } from '@generated/prisma/client';

import { ListSchema } from '@/lib/validators/list';
import type {
  UserListWithItemStatus,
  UserListWithProgress,
} from '@/server/lib/lists';
import { getJson, postJson } from '@/server/utils/fetch-json';

export type UserListSummaryDto = Omit<UserListWithProgress, 'createdAt'> & {
  createdAt: string;
};

export type UserListDto = Prisma.UserListGetPayload<{
  include: {
    users: { select: { id: true } };
    items: { select: { id: true } };
  };
}>;

export const listsApi = {
  getAll: () => getJson<UserListSummaryDto[]>('/api/lists'),

  create: (payload: ListSchema) => postJson<UserListDto>('/api/lists', payload),

  addOrRemoveDiscoverItemToList: (payload: {
    discoverItemId: string;
    listId?: string;
  }) => postJson<{ listId: string[] }>('/api/lists/discoverItem', payload),

  getByDiscoverItemId: (discoverItemId: string) =>
    getJson<UserListWithItemStatus[]>(
      `/api/lists/item/${encodeURIComponent(discoverItemId)}`,
    ),
};
