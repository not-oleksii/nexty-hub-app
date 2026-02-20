import { Caption1 } from '@/components/typography/caption1';

import type { Caption2Props } from './types';

export function Caption2({ className, ...props }: Caption2Props) {
  return <Caption1 size={2} className={className} {...props} />;
}
