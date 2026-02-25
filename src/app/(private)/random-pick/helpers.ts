import type { SpinCandidate } from './_components/types';

export const getUniqueCandidates = (candidates: SpinCandidate[]) => {
  return [...new Map(candidates.map((item) => [item.id, item])).values()];
};
