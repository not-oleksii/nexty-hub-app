import { Subtitle1 } from '@/components/typography/subtitle1';

import type { Subtitle4Props } from './types';

export function Subtitle4({ className, ...props }: Subtitle4Props) {
  return <Subtitle1 size={4} className={className} {...props} />;
}
