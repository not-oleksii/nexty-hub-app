'use client';

import { useCallback, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';

import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { DynamicCover } from '@/components/ui/dynamic-cover';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { DiscoverItemSearchResult } from '@/server/api/discover';
import { discoverQueries } from '@/server/api/queries/discover.queries';

type ListDiscoverItemSearchProps = {
  value: string[];
  initialItems?: DiscoverItemSearchResult[];
  onChange: (itemIds: string[], items: DiscoverItemSearchResult[]) => void;
};

function DiscoverItemCard({
  item,
  onAdd,
  disabled,
}: {
  item: DiscoverItemSearchResult;
  onAdd: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className="border-border bg-card hover:border-primary flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    >
      <DynamicCover
        title={item.title}
        src={item.imageUrl}
        aspectRatio="aspect-4/3"
        strictHosts
        className="h-20 w-full object-cover"
      />
      <div className="truncate px-2 py-1 text-xs font-medium">{item.title}</div>
      {item.category && (
        <Caption size="xs" className="text-muted-foreground truncate px-2 pb-1">
          {item.category}
        </Caption>
      )}
    </button>
  );
}

export function ListDiscoverItemSearch({
  value: discoverItemIds,
  initialItems = [],
  onChange,
}: ListDiscoverItemSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState<DiscoverItemSearchResult[]>(
    () => initialItems,
  );
  const debouncedSearch = useDebouncedValue(searchQuery);

  const searchResultsQuery = useQuery(
    discoverQueries.search(debouncedSearch, 12),
  );
  const searchResults = searchResultsQuery.data ?? [];

  const addDiscoverItem = useCallback(
    (item: DiscoverItemSearchResult) => {
      if (discoverItemIds.includes(item.id) || discoverItemIds.length >= 100) {
        return;
      }
      const nextIds = [...discoverItemIds, item.id];
      const nextItems = addedItems.some((i) => i.id === item.id)
        ? addedItems
        : [...addedItems, item];
      onChange(nextIds, nextItems);
      setAddedItems(nextItems);
    },
    [discoverItemIds, addedItems, onChange],
  );

  const removeDiscoverItem = useCallback(
    (itemId: string) => {
      const nextIds = discoverItemIds.filter((id) => id !== itemId);
      const nextItems = addedItems.filter((i) => i.id !== itemId);
      onChange(nextIds, nextItems);
      setAddedItems(nextItems);
    },
    [discoverItemIds, addedItems, onChange],
  );

  return (
    <Field>
      <FieldLabel>Discover items</FieldLabel>
      <Caption size="base" className="text-muted-foreground mb-2">
        Search and add items to your list
      </Caption>
      <Input
        placeholder="Search by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />
      {discoverItemIds.length > 0 && (
        <div className="mb-3">
          <Caption className="text-muted-foreground mb-2">
            Added ({discoverItemIds.length})
          </Caption>
          <div className="flex flex-wrap gap-2">
            {addedItems.map((item) => (
              <div
                key={item.id}
                className="border-border bg-card flex items-center gap-2 rounded-lg border px-2 py-1"
              >
                <span className="line-clamp-1 max-w-32 text-sm">
                  {item.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeDiscoverItem(item.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${item.title}`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {searchQuery.length >= 2 && (
        <div
          className={`border-border rounded-lg border p-3 ${searchQuery !== debouncedSearch || searchResultsQuery.isLoading ? 'min-h-[200px]' : ''}`}
        >
          {searchQuery !== debouncedSearch || searchResultsQuery.isLoading ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-lg"
                >
                  <Skeleton className="h-20 w-full rounded-t-lg" />
                  <Skeleton className="mt-2 h-3 w-full rounded" />
                  <Skeleton className="mt-1 h-3 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <Body variant="muted">No results found</Body>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {searchResults
                .filter((r) => !discoverItemIds.includes(r.id))
                .slice(0, 9)
                .map((item) => (
                  <DiscoverItemCard
                    key={item.id}
                    item={item}
                    onAdd={() => addDiscoverItem(item)}
                    disabled={discoverItemIds.length >= 100}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
