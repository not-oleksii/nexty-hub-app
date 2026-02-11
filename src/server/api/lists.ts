import { getJson, postJson } from '@/server/utils/fetch-json';

export type UserListItemDto = {
  id: string;
  name: string;
  hasItems: boolean;
};

export type UserListSummaryDto = {
  id: string;
  name: string;
  createdAt: string;
  owner: {
    id: string;
    username: string;
  };
  totalItems: number;
  completedItems: number;
};

type AddDiscoverItemToListPayload = {
  itemId: string;
  listIds?: string[];
};

type UserListsResponse<TList> = {
  lists: TList[];
};

export const listsApi = {
  addOrRemoveDiscoverItemToList: (payload: AddDiscoverItemToListPayload) =>
    postJson<{ listIds?: string[] }>('/api/lists', payload),

  getById: (itemId: string) =>
    getJson<UserListsResponse<UserListItemDto>>(
      `/api/lists/item/${encodeURIComponent(itemId)}`,
    ),

  getOverview: () =>
    getJson<UserListsResponse<UserListSummaryDto>>('/api/lists'),
};
