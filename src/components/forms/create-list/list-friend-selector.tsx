'use client';

import { useQuery } from '@tanstack/react-query';

import { Caption } from '@/components/typography/caption';
import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { friendsQueries } from '@/server/api/queries/friends.queries';

type ListFriendSelectorProps = {
  value: string[];
  onChange: (memberIds: string[]) => void;
};

export function ListFriendSelector({
  value: memberIds,
  onChange,
}: ListFriendSelectorProps) {
  const friendsQuery = useQuery(friendsQueries.accepted());
  const friends = friendsQuery.data ?? [];

  const toggleMember = (userId: string) => {
    const next = memberIds.includes(userId)
      ? memberIds.filter((id) => id !== userId)
      : memberIds.length < 50
        ? [...memberIds, userId]
        : memberIds;
    onChange(next);
  };

  if (!friendsQuery.isLoading && friends.length === 0) {
    return null;
  }

  return (
    <Field>
      <FieldLabel>Share with friends</FieldLabel>
      <Caption size="base" className="text-muted-foreground mb-2">
        Add friends who can view this list
      </Caption>
      {friendsQuery.isLoading ? (
        <Spinner className="h-6 w-6" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {friends.map((friend) => (
            <Badge
              key={friend.id}
              variant={memberIds.includes(friend.id) ? 'default' : 'outline'}
              size="default"
              className="cursor-pointer"
              onClick={() => toggleMember(friend.id)}
            >
              {friend.username}
            </Badge>
          ))}
        </div>
      )}
    </Field>
  );
}
