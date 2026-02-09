import { PlusIcon } from 'lucide-react';

import { Header2 } from '@/components/typography/header2';
import { Card } from '@/components/ui/card';

export function CreateListCard() {
  return (
    <Card className="border-dashed">
      <div className="flex items-center gap-2 p-6">
        <PlusIcon className="text-muted-foreground" />
        <Header2>Create A New List</Header2>
      </div>
    </Card>
  );
}
