import { ListVisibility } from '@generated/prisma/enums';
import { GlobeIcon, LockIcon, UsersIcon } from 'lucide-react';

export const LIST_VISIBILITY_LABELS: Record<
  ListVisibility,
  { label: string; icon: typeof LockIcon }
> = {
  [ListVisibility.PRIVATE]: { label: 'Private', icon: LockIcon },
  [ListVisibility.FRIENDS_ONLY]: { label: 'Friends', icon: UsersIcon },
  [ListVisibility.PUBLIC]: { label: 'Public', icon: GlobeIcon },
};
