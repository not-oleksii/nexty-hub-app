'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { PlusIcon } from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Caption1 } from '@/components/typography/caption1';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils/common';

export function CreateListCard() {
  const router = useRouter();

  const onCardClick = useCallback(() => {
    router.push(ROUTES.lists.create);
  }, [router]);

  return (
    <Card
      onClick={onCardClick}
      className={cn(
        'group relative flex h-full min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden',
        'border-muted-foreground/20 border-2 border-dashed bg-transparent',
        'transition-all duration-300 ease-in-out',
        'hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      )}
    >
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="bg-muted/30 group-hover:bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_-3px_hsl(var(--primary)/0.2)]">
          <PlusIcon className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors duration-300" />
        </div>

        <div className="flex flex-col gap-1">
          <Body className="text-muted-foreground group-hover:text-primary text-lg font-medium transition-colors duration-300">
            Create New List
          </Body>
          <Caption1 className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors duration-300">
            Start tracking your next favorites
          </Caption1>
        </div>
      </div>
    </Card>
  );
}
