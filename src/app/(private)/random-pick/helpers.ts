import type { UserListSummaryDto } from '@/server/api/lists';

import type { SpinCandidate } from './_components/types';

export const getUniqueCandidates = (candidates: SpinCandidate[]) => {
  return [...new Map(candidates.map((item) => [item.id, item])).values()];
};

export const isWinnerLinkable = (winner: SpinCandidate): boolean =>
  Boolean(winner.type && !winner.id.startsWith('text-'));

export function toggleSetMember<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);

  if (next.has(value)) next.delete(value);
  else next.add(value);

  return next;
}

export function splitLists(data: UserListSummaryDto[] | undefined) {
  const nonEmpty = data?.filter((list) => list.discoverItems.length > 0) ?? [];
  const empty = data?.filter((list) => list.discoverItems.length === 0) ?? [];

  return { nonEmpty, empty };
}
