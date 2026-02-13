'use client';

import { useQuery } from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Caption1 } from '@/components/typography/caption1';
import { Header2 } from '@/components/typography/header2';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { listsQueries } from '@/server/api/queries/lists.queries';

import { CreateListCard } from './create-list-card';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    new Date(value),
  );

export function ListsGrid() {
  const { data, isLoading, isError } = useQuery(listsQueries.all());

  if (isLoading) {
    return <ListsGridSkeleton />;
  }

  if (isError) {
    return <Body>There was an error loading your lists.</Body>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CreateListCard />
      {data?.map((list) => {
        const progress =
          list.totalDiscoverItems > 0
            ? (list.completedDiscoverItems / list.totalDiscoverItems) * 100
            : 0;

        return (
          <Card key={list.id}>
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <Header2>{list.name}</Header2>
                  <Caption1>By {list.owner.username}</Caption1>
                </div>
                <Button variant="secondary" size="sm">
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Button>
              </div>
              <Caption1>Created {formatDate(list.createdAt)}</Caption1>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              <Body className="w-full text-left">
                Your progress: {list.completedDiscoverItems} /{' '}
                {list.totalDiscoverItems}
              </Body>
              <Progress value={progress} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export function ListsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
