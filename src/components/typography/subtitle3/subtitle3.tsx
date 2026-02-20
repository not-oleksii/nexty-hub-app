import { Subtitle1 } from '@/components/typography/subtitle1';

import type { Subtitle3Props } from './types';

export function Subtitle3({ className, ...props }: Subtitle3Props) {
  return <Subtitle1 size={3} className={className} {...props} />;
}
