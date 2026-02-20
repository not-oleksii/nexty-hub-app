'use client';

import {
  type KeyboardEvent,
  type SubmitEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import { ListVisibility } from '@generated/prisma/enums';
import { useForm } from '@tanstack/react-form-nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GlobeIcon, LockIcon, UsersIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Body } from '@/components/typography/body';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { AlbumImage } from '@/components/ui/album-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ROUTES } from '@/constants/routes';
import { SUGGESTED_TAGS } from '@/constants/suggested-tags';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { getErrorMessage } from '@/lib/utils/common';
import { type ListSchema, listSchema } from '@/lib/validators/list';
import type { DiscoverItemSearchResult } from '@/server/api/discover';
import { discoverQueries } from '@/server/api/queries/discover.queries';
import { friendsQueries } from '@/server/api/queries/friends.queries';
import { listsKeys, listsMutations } from '@/server/api/queries/lists.queries';
import type { UserListDetail } from '@/server/lib/lists';

const DEFAULT_VALUES: ListSchema = {
  name: '',
  description: '',
  coverImageUrl: '',
  tags: [],
  memberIds: [],
  discoverItemIds: [],
  visibility: ListVisibility.PRIVATE,
};

const VISIBILITY_OPTIONS = [
  { value: ListVisibility.PRIVATE, label: 'Private', icon: LockIcon },
  { value: ListVisibility.FRIENDS_ONLY, label: 'Friends', icon: UsersIcon },
  { value: ListVisibility.PUBLIC, label: 'Public', icon: GlobeIcon },
] as const;

type CreateListFormProps = {
  list?: UserListDetail;
};

export function CreateListForm({ list }: CreateListFormProps) {
  const isEditMode = Boolean(list);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);

  const friendsQuery = useQuery(friendsQueries.accepted());
  const searchResultsQuery = useQuery(
    discoverQueries.search(debouncedSearch, 12),
  );

  const createMutation = useMutation(listsMutations.create());
  const updateMutation = useMutation(listsMutations.update());

  const isPending = isEditMode
    ? updateMutation.isPending
    : createMutation.isPending;
  const error = isEditMode ? updateMutation.error : createMutation.error;
  const isError = isEditMode ? updateMutation.isError : createMutation.isError;

  const form = useForm({
    defaultValues: isEditMode
      ? {
          name: list!.name,
          description: list!.description ?? '',
          coverImageUrl: list!.coverImageUrl ?? '',
          tags: list!.tags ?? [],
          memberIds: list!.memberIds ?? [],
          discoverItemIds: list!.discoverItems?.map((i) => i.id) ?? [],
          visibility:
            (list!.visibility as ListVisibility) ?? ListVisibility.PRIVATE,
        }
      : DEFAULT_VALUES,
    validators: {
      onSubmit: ({ value }) => {
        const result = listSchema.safeParse({
          ...value,
          tags,
          memberIds,
          discoverItemIds,
        });

        return result.success ? undefined : result.error.issues[0]?.message;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          name: value.name.trim(),
          description: value.description?.trim() || undefined,
          coverImageUrl: value.coverImageUrl?.trim() || undefined,
          tags,
          memberIds,
          discoverItemIds,
          visibility: value.visibility ?? ListVisibility.PRIVATE,
        };

        const validated = listSchema.safeParse(payload);
        if (!validated.success) {
          const msg = validated.error.issues[0]?.message ?? 'Validation failed';
          toast.error(msg);

          return;
        }

        if (isEditMode) {
          await updateMutation.mutateAsync({
            id: list!.id,
            ...validated.data,
          });
          queryClient.invalidateQueries({ queryKey: listsKeys.all });
          queryClient.invalidateQueries({
            queryKey: listsKeys.detail(list!.id),
          });
          toast.success('List updated successfully');
        } else {
          await createMutation.mutateAsync(validated.data);
          queryClient.invalidateQueries({ queryKey: listsKeys.all });
          toast.success('List created successfully');
        }

        router.push(ROUTES.lists.root);
        router.refresh();
      } catch (err) {
        console.error(
          isEditMode ? 'Error updating list:' : 'Error creating list:',
          err,
        );
        toast.error(getErrorMessage(err));
      }
    },
  });

  const [tags, setTags] = useState<string[]>(() =>
    isEditMode ? (list?.tags ?? []) : [],
  );
  const [memberIds, setMemberIds] = useState<string[]>(() =>
    isEditMode ? (list?.memberIds ?? []) : [],
  );
  const [discoverItemIds, setDiscoverItemIds] = useState<string[]>(() =>
    isEditMode ? (list?.discoverItems?.map((i) => i.id) ?? []) : [],
  );
  const [addedDiscoverItems, setAddedDiscoverItems] = useState<
    DiscoverItemSearchResult[]
  >(() => (isEditMode ? (list?.discoverItems ?? []) : []));

  const friends = friendsQuery.data ?? [];
  const searchResults = searchResultsQuery.data ?? [];

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed) return;
    setTags((prev) => {
      if (prev.length >= 20) return prev;
      if (prev.some((t) => t.toLowerCase() === trimmed)) return prev;

      return [...prev, trimmed];
    });
    setTagInput('');
  }, []);

  const removeTag = useCallback((index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleMember = useCallback((userId: string) => {
    setMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : prev.length < 50
          ? [...prev, userId]
          : prev,
    );
  }, []);

  const addDiscoverItem = useCallback((item: DiscoverItemSearchResult) => {
    setDiscoverItemIds((prev) =>
      prev.includes(item.id) || prev.length >= 100 ? prev : [...prev, item.id],
    );
    setAddedDiscoverItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item],
    );
  }, []);

  const removeDiscoverItem = useCallback((itemId: string) => {
    setDiscoverItemIds((prev) => prev.filter((id) => id !== itemId));
    setAddedDiscoverItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(tagInput);
      }
    },
    [tagInput, addTag],
  );

  const onSubmitClick = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form],
  );

  const onCancel = useCallback(() => {
    router.push(ROUTES.lists.root);
    router.refresh();
  }, [router]);

  return (
    <CardContent className="mx-auto w-full max-w-2xl">
      <Header size="lg" className="mb-6">
        {isEditMode ? 'Edit list' : 'Create list'}
      </Header>
      <form
        id={isEditMode ? 'edit-list-form' : 'create-list-form'}
        onSubmit={onSubmitClick}
      >
        <FieldGroup>
          <FieldSet>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="e.g. My Watch List"
                      maxLength={50}
                      required
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Optional description..."
                    maxLength={500}
                    rows={3}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="coverImageUrl">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Cover image URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="https://..."
                  />
                </Field>
              )}
            </form.Field>

            <Field>
              <FieldLabel>Tags</FieldLabel>
              <Caption size="base" className="text-muted-foreground mb-2">
                Add custom tags or click suggested ones below
              </Caption>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <Badge
                    key={`${tag}-${i}`}
                    variant="secondary"
                    size="default"
                    className="cursor-pointer gap-1 pr-1"
                    onClick={() => removeTag(i)}
                  >
                    {tag}
                    <XIcon className="h-3 w-3" />
                  </Badge>
                ))}
                {tags.length < 20 && (
                  <Input
                    ref={searchInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => tagInput.trim() && addTag(tagInput)}
                    placeholder="Add tag..."
                    className="h-7 w-24 text-sm"
                  />
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {SUGGESTED_TAGS.filter(
                  (t) => !tags.some((f) => f.toLowerCase() === t),
                ).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    size="default"
                    className="hover:bg-primary/10 hover:text-primary cursor-pointer"
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            </Field>

            <form.Field name="visibility">
              {(field) => (
                <>
                  <Field>
                    <FieldLabel>Visibility</FieldLabel>
                    <ToggleGroup
                      type="single"
                      value={field.state.value ?? ListVisibility.PRIVATE}
                      onValueChange={(v) =>
                        v && field.handleChange(v as ListVisibility)
                      }
                      className="flex flex-wrap gap-2"
                    >
                      {VISIBILITY_OPTIONS.map(
                        ({ value, label, icon: Icon }) => (
                          <ToggleGroupItem
                            key={value}
                            value={value}
                            aria-label={label}
                            className="hover:bg-primary/10 hover:text-primary cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </ToggleGroupItem>
                        ),
                      )}
                    </ToggleGroup>
                  </Field>
                  {(field.state.value ?? ListVisibility.PRIVATE) !==
                    ListVisibility.PRIVATE && (
                    <Field>
                      <FieldLabel>Share with friends</FieldLabel>
                      <Caption
                        size="base"
                        className="text-muted-foreground mb-2"
                      >
                        Add friends who can view this list
                      </Caption>
                      {friendsQuery.isLoading ? (
                        <Spinner className="h-6 w-6" />
                      ) : friends.length === 0 ? (
                        <Body variant="muted">No friends yet</Body>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {friends.map((friend) => (
                            <Badge
                              key={friend.id}
                              variant={
                                memberIds.includes(friend.id)
                                  ? 'default'
                                  : 'outline'
                              }
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
                  )}
                </>
              )}
            </form.Field>

            <Field>
              <FieldLabel>Discover items</FieldLabel>
              <Caption size="base" className="text-muted-foreground mb-2">
                Search and add items to your list
              </Caption>
              <Input
                ref={searchInputRef}
                placeholder="Search by title (min 2 chars)..."
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
                    {addedDiscoverItems.map((item) => (
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
                  {searchQuery !== debouncedSearch ||
                  searchResultsQuery.isLoading ? (
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
          </FieldSet>
        </FieldGroup>
      </form>
      <div className="mt-6 flex flex-col gap-2">
        {isError && <FieldError>{getErrorMessage(error)}</FieldError>}
        <div className="flex gap-3">
          <Button
            type="submit"
            form={isEditMode ? 'edit-list-form' : 'create-list-form'}
            size="lg"
            disabled={form.state.isSubmitting || isPending}
            className={
              isEditMode
                ? undefined
                : 'bg-primary hover:bg-primary/90 w-full rounded-lg px-6 font-medium shadow-md transition-shadow hover:shadow-lg'
            }
          >
            {form.state.isSubmitting || isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                {isEditMode ? 'Saving...' : 'Creating...'}
              </>
            ) : isEditMode ? (
              'Save'
            ) : (
              'Create'
            )}
          </Button>
          {isEditMode && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={form.state.isSubmitting || isPending}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  );
}

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
      <AlbumImage
        src={item.imageUrl}
        title={item.title}
        aspectRatio="aspect-4/3"
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
