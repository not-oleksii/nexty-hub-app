'use client';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import {
  CalendarIcon,
  Edit2Icon,
  EyeIcon,
  GlobeIcon,
  LockIcon,
  UsersIcon,
} from 'lucide-react';

import { ItemsProgress } from '@/components/items-progress';
import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Label } from '@/components/typography/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ListCover } from '@/components/ui/list-cover';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/utils/format-date';
import type { UserListSummaryDto } from '@/server/api/lists';
import { usersQueries } from '@/server/api/queries/users.queries';

const VISIBILITY_LABELS: Record<
  string,
  { label: string; icon: typeof LockIcon }
> = {
  PRIVATE: { label: 'Private', icon: LockIcon },
  FRIENDS_ONLY: { label: 'Friends', icon: UsersIcon },
  PUBLIC: { label: 'Public', icon: GlobeIcon },
};

const DESCRIPTION_MAX_LENGTH = 80;

type ListCardProps = {
  list: UserListSummaryDto;
};

export function ListCard({ list }: ListCardProps) {
  const { data: currentUser } = useQuery(usersQueries.current());
  const isOwner = list.owner.id === currentUser?.id;

  const tags = list.tags ?? [];
  const members = list.members ?? [];
  const visibilityKey = list.visibility ?? 'PRIVATE';
  const visibility =
    VISIBILITY_LABELS[visibilityKey] ?? VISIBILITY_LABELS.PRIVATE;
  const VisibilityIcon = visibility.icon;

  const displayedTags = tags.slice(0, 3);
  const remainingTagsCount = Math.max(0, tags.length - 3);

  const displayedMembers = members.slice(0, 3);
  const remainingMembersCount = Math.max(0, members.length - 3);

  const shortDescription = list.description
    ? list.description.length > DESCRIPTION_MAX_LENGTH
      ? `${list.description.slice(0, DESCRIPTION_MAX_LENGTH).trim()}…`
      : list.description
    : null;

  const hoverContent = (
    <div className="flex max-w-56 flex-col gap-1">
      <Body className="leading-tight font-medium break-words" size="sm">
        {list.name}
      </Body>
      {shortDescription && (
        <Caption size="xs" className="leading-relaxed font-normal break-words">
          {shortDescription}
        </Caption>
      )}
    </div>
  );

  return (
    <Card
      variant="interactive"
      className="group flex h-full flex-col overflow-hidden pt-0"
    >
      <div className="relative shrink-0">
        <ListCover
          coverImageUrl={list.coverImageUrl}
          listName={list.name}
          discoverItems={list.discoverItems}
          className="w-full"
        />
        {isOwner && (
          <Link
            href={ROUTES.lists.edit(list.id)}
            className="absolute top-3 right-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/60 hover:bg-background/90 h-8 w-8 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-105"
            >
              <Edit2Icon className="text-foreground h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <CardHeader className="px-5 pt-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <HoverCard>
              <HoverCardTrigger asChild>
                <CardTitle className="hover:text-primary line-clamp-1 cursor-pointer text-lg transition-colors">
                  {list.name}
                </CardTitle>
              </HoverCardTrigger>
              <HoverCardContent side="top" align="start" className="shadow-lg">
                {hoverContent}
              </HoverCardContent>
            </HoverCard>
            <Caption className="line-clamp-1">
              By{' '}
              <Label className="text-foreground/80">
                {list.owner.username}
              </Label>
            </Caption>
          </div>
          <Badge
            variant="outline"
            size="sm"
            className="bg-background/50 shrink-0"
          >
            <VisibilityIcon className="text-muted-foreground mr-1.5 h-3 w-3" />
            {visibility.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-5">
        <div className="min-h-[40px]">
          {shortDescription ? (
            <Caption
              size="base"
              className="text-muted-foreground line-clamp-2 leading-snug"
            >
              {shortDescription}
            </Caption>
          ) : (
            <Caption
              size="base"
              className="text-muted-foreground/40 line-clamp-2 leading-snug italic"
            >
              No description provided.
            </Caption>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <UsersIcon className="text-muted-foreground/50 mr-1 h-3.5 w-3.5" />
            {members.length > 0 ? (
              <>
                {displayedMembers.map((m) => (
                  <Badge
                    key={m.id}
                    variant="outline"
                    className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase"
                  >
                    {m.username}
                  </Badge>
                ))}
                {remainingMembersCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-[10px] font-medium"
                  >
                    +{remainingMembersCount}
                  </Badge>
                )}
              </>
            ) : (
              <Badge
                variant="outline"
                className="border-muted-foreground/20 text-muted-foreground/40 border-dashed text-[10px] font-medium tracking-wider uppercase"
              >
                Only you
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.length > 0 ? (
              <>
                {displayedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="hover:bg-muted text-[11px] font-normal"
                  >
                    #{tag}
                  </Badge>
                ))}
                {remainingTagsCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-normal"
                  >
                    +{remainingTagsCount}
                  </Badge>
                )}
              </>
            ) : (
              <Badge
                variant="outline"
                className="border-muted-foreground/20 text-muted-foreground/40 border-dashed text-[11px] font-normal"
              >
                No tags
              </Badge>
            )}
          </div>
        </div>

        <div className="text-muted-foreground mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
            <Caption size="xs" className="font-medium">
              Last updated:&nbsp;
              {list.updatedAt ? formatDate(list.updatedAt) : 'Recently'}
            </Caption>
          </div>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="h-3.5 w-3.5 opacity-70" />
            <Caption size="xs" className="font-medium">
              {list.viewsCount ?? 0}
            </Caption>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/5 border-t px-5 py-3">
        <ItemsProgress
          value={list.completedDiscoverItems}
          maxValue={list.totalDiscoverItems}
        />
      </CardFooter>
    </Card>
  );
}
