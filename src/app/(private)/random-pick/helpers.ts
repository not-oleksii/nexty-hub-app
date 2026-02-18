import { Reel } from './_components/random-reel';

export const getUniqueReels = (reels: Reel[]) => {
  return [...new Map(reels.map((item) => [item.id, item])).values()];
};
