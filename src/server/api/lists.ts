import type {
  UserListWithItemStatus,
  UserListWithProgress,
} from '@/server/lib/lists';
import { getJson, postJson } from '@/server/utils/fetch-json';

export type UserListSummaryDto = Omit<UserListWithProgress, 'createdAt'> & {
  createdAt: string;
};

export const listsApi = {
  addOrRemoveDiscoverItemToList: (payload: {
    itemId: string;
    listIds?: string[];
  }) => postJson<{ listIds?: string[] }>('/api/lists', payload),

  getById: (itemId: string) =>
    getJson<UserListWithItemStatus[]>(
      `/api/lists/item/${encodeURIComponent(itemId)}`,
    ),

  getOverview: () => getJson<UserListSummaryDto[]>('/api/lists'),
};
