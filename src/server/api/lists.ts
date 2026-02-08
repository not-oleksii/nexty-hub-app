import { getJson, postJson } from '@/server/lib/fetch-json';

type UserListDto = {
  id: string;
  name: string;
  hasItem?: boolean;
};

type AddDiscoverItemToListPayload = {
  itemId: string;
  listIds?: string[];
};

type UserListsResponse = {
  lists: UserListDto[];
};

export async function addDiscoverItemToList(
  payload: AddDiscoverItemToListPayload,
) {
  return postJson<{ listIds?: string[] }>('/api/lists', payload);
}

export async function getUserLists(itemId?: string) {
  const query = itemId ? `?itemId=${encodeURIComponent(itemId)}` : '';
  const data = await getJson<UserListsResponse>(`/api/lists${query}`);

  return data.lists;
}
