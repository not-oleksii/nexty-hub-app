import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { PlusIcon } from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

export function CreateListCard() {
  const router = useRouter();

  const onCardClick = useCallback(() => {
    router.push(ROUTES.lists.create);
  }, [router]);

  return (
    <Card
      onClick={onCardClick}
      className="group flex min-h-56 cursor-pointer items-center justify-center border-dashed"
    >
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="border-border/60 bg-background/60 group-hover:border-primary/60 group-hover:text-primary rounded-full border p-6 shadow-sm transition">
          <PlusIcon className="text-muted-foreground group-hover:text-primary h-10 w-10" />
        </div>
        <Body className="text-foreground group-hover:text-primary text-base font-medium">
          Create A New List
        </Body>
      </div>
    </Card>
  );
}
