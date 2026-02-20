'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, Edit2Icon } from 'lucide-react';

import { ItemsProgress } from '@/components/items-progress';
import { Body } from '@/components/typography/body';
import { Caption1 } from '@/components/typography/caption1';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbnailStack } from '@/components/ui/thumbnail-stack';
import { formatDate } from '@/lib/utils/format-date';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { CreateListCard } from './create-list-card';

export function ListsGrid() {
  const { data, isLoading, isError } = useQuery(listsQueries.all());

  if (isLoading) {
    return <ListsGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive flex h-32 items-center justify-center rounded-xl border">
        There was an error loading your lists.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CreateListCard />

      {data?.map((list) => {
        return (
          <Card
            key={list.id}
            className="group hover:border-primary/50 flex h-full flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ThumbnailStack
                    items={list.discoverItems.slice(0, 5).map((item) => ({
                      id: item.id,
                      title: item.title,
                      imageUrl: item.imageUrl,
                    }))}
                  />

                  <div className="flex flex-col pr-2">
                    <CardTitle className="group-hover:text-primary line-clamp-1 text-lg transition-colors">
                      {list.name}
                    </CardTitle>
                    <Caption1 className="text-muted-foreground line-clamp-1">
                      By {list.owner.username}
                    </Caption1>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary text-muted-foreground h-8 w-8 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                <Body>Created {formatDate(list.createdAt)}</Body>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/10 flex flex-col gap-2 border-t px-6 py-4">
              <ItemsProgress
                value={list.completedDiscoverItems}
                maxValue={list.totalDiscoverItems}
              />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export function ListsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col justify-between">
          <CardHeader className="pb-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <Skeleton className="h-3 w-2/5" />
          </CardContent>
          <CardFooter className="bg-muted/5 flex flex-col gap-3 border-t px-6 py-4">
            <div className="flex w-full justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
