import { Subtitle1 } from '@/components/typography/subtitle1';

import { ListsGrid } from './lists-grid';
import { RandomReel } from './random-reel';

export function RandomPickContent() {
  return (
    <div>
      <RandomReel />
      <div className="mt-8 flex flex-col gap-4">
        <Subtitle1>Select lists to pick from</Subtitle1>
        <ListsGrid />
      </div>
    </div>
  );
}
