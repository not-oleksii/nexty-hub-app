import { Subtitle1 } from '@/components/typography/subtitle1';

import type { Subtitle2Props } from './types';

export function Subtitle2({ className, ...props }: Subtitle2Props) {
  return <Subtitle1 size={2} className={className} {...props} />;
}
