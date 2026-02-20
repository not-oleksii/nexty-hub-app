'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Layers } from 'lucide-react';

import { cn } from '@/lib/utils/common';

interface ThumbnailItem {
  id: string;
  title: string;
  imageUrl: string | null;
}

interface ThumbnailStackProps {
  items: ThumbnailItem[];
  className?: string;
}

export function ThumbnailStack({ items, className }: ThumbnailStackProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const validItems = items.filter((item) => item.imageUrl).slice(0, 3);

  if (validItems.length === 0) {
    return (
      <div className="bg-muted/50 text-muted-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
        <Layers className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className={cn('relative h-12 w-12 shrink-0', className)}>
      {validItems.map((item, index) => {
        const isBroken = failedImages[item.id];

        return (
          <div
            key={item.id}
            className={cn(
              'border-card bg-muted absolute inset-0 overflow-hidden rounded-lg border-2 shadow-sm',
              index === 0 && 'z-30 scale-100',
              index === 1 &&
                'z-20 translate-x-1 translate-y-1 scale-95 opacity-80',
              index === 2 &&
                'z-10 translate-x-2 translate-y-2 scale-90 opacity-60',
            )}
          >
            {isBroken ? (
              <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-sm font-semibold uppercase">
                {item.title.charAt(0)}
              </div>
            ) : (
              <Image
                src={item.imageUrl ?? ''}
                alt={item.title}
                fill
                sizes="48px"
                className="object-cover"
                onError={() => {
                  setFailedImages((prev) => ({
                    ...prev,
                    [item.id]: true,
                  }));
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
