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

export async function addDiscoverItemToList(
  payload: AddDiscoverItemToListPayload,
) {
  return postJson<{ listIds?: string[] }>('/api/lists', payload);
}

export async function getUserListsByItem(itemId: string) {
  const data = await getJson<UserListsResponse<UserListItemDto>>(
    `/api/lists/item/${encodeURIComponent(itemId)}`,
  );

  return data.lists;
}

export async function getUserListsOverview() {
  const data =
    await getJson<UserListsResponse<UserListSummaryDto>>('/api/lists');

  return data.lists;
}
