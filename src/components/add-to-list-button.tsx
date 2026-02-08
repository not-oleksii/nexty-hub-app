import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AddToListButtonProps {
  itemId: string;
  inList: boolean;
}

export function AddToListButton({ itemId, inList }: AddToListButtonProps) {
  return (
    <Button variant="secondary">
      <PlusIcon className="h-4 w-4" />
      Add To List
    </Button>
  );
}
