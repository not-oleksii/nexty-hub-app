'use client';

import { ListVisibility } from '@generated/prisma/enums';
import { useQuery } from '@tanstack/react-query';

import { ItemsProgress } from '@/components/items-progress';
import { ListEditButton } from '@/components/list-edit-button';
import { ListMembersBadges } from '@/components/list-members-badges';
import { ListTagsBadges } from '@/components/list-tags-badges';
import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { ListCover } from '@/components/ui/list-cover';
import { LIST_VISIBILITY_LABELS } from '@/constants/list-visibility';
import { formatDate } from '@/lib/utils/format-date';
import type { UserListViewDto } from '@/server/api/lists';
import { usersQueries } from '@/server/api/queries/users.queries';

type ListDetailsHeaderProps = {
  list: UserListViewDto;
};

export function ListDetailsHeader({ list }: ListDetailsHeaderProps) {
  const { data: currentUser } = useQuery(usersQueries.current());
  const isOwner = list.owner.id === currentUser?.id;

  const tags = list.tags ?? [];
  const members = list.members ?? [];
  const visibilityKey = (list.visibility ??
    ListVisibility.PRIVATE) as ListVisibility;
  const visibility =
    LIST_VISIBILITY_LABELS[visibilityKey] ?? LIST_VISIBILITY_LABELS.PRIVATE;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-4 md:min-h-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Header size="xl">{list.name}</Header>
            <Caption size="base" className="text-muted-foreground">
              {`By ${list.owner.username}`} • {visibility.label} •{' '}
              {`Updated ${list.updatedAt ? formatDate(list.updatedAt) : 'Recently'}`}{' '}
              • {list.viewsCount ?? 0} views
            </Caption>
          </div>

          {list.description && (
            <Body className="text-muted-foreground max-w-2xl leading-relaxed">
              {list.description}
            </Body>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {members.length > 0 && (
            <ListMembersBadges
              members={members}
              size="md"
              prefix={`Shared with ${members.length} users `}
            />
          )}
          {tags.length > 0 && <ListTagsBadges tags={tags} size="md" />}
        </div>

        <div className="border-border/50 bg-background/40 rounded-lg border p-4 backdrop-blur-xl">
          <ItemsProgress
            value={list.completedDiscoverItems}
            maxValue={list.totalDiscoverItems}
          />
        </div>
      </div>

      <div className="relative shrink-0 overflow-hidden rounded-xl md:w-64 md:min-w-64">
        <ListCover
          coverImageUrl={list.coverImageUrl}
          listName={list.name}
          discoverItems={list.discoverItems}
          className="aspect-[3/4] w-full"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent"
          aria-hidden
        />
        {isOwner && <ListEditButton listId={list.id} variant="static" />}
      </div>
    </div>
  );
}
