import type { FriendSummary } from '@/server/lib/friends';
import { getJson } from '@/server/utils/fetch-json';

export const friendsApi = {
  getAccepted: () => getJson<FriendSummary[]>('/api/friends'),
};
