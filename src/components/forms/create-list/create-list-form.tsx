'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ListVisibility } from '@generated/prisma/enums';
import { useForm, useStore } from '@tanstack/react-form-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GlobeIcon, LockIcon, UsersIcon } from 'lucide-react';
import type { SubmitEvent } from 'react';
import { toast } from 'sonner';

import { ListDiscoverItemSearch } from '@/components/forms/create-list/list-discover-item-search';
import { ListFriendSelector } from '@/components/forms/create-list/list-friend-selector';
import { ListTagInput } from '@/components/forms/create-list/list-tag-input';
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
import { LimitedTextarea } from '@/components/ui/limited-textarea';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/utils/common';
import { type ListSchema, listSchema } from '@/lib/validators/list';
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

const DESCRIPTION_MAX_LENGTH = 500;

const VISIBILITY_OPTIONS = [
  { value: ListVisibility.PRIVATE, label: 'Private', icon: LockIcon },
  { value: ListVisibility.FRIENDS_ONLY, label: 'Friends', icon: UsersIcon },
  { value: ListVisibility.PUBLIC, label: 'Public', icon: GlobeIcon },
] as const;

type CreateListFormProps = {
  list?: UserListDetail;
  onDirtyChange?: (dirty: boolean) => void;
  onCancelClick?: () => void;
};

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((val, i) => val === sortedB[i]);
}

export function CreateListForm({
  list,
  onDirtyChange,
  onCancelClick,
}: CreateListFormProps) {
  const isEditMode = Boolean(list);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [tags, setTags] = useState<string[]>(() =>
    isEditMode ? (list?.tags ?? []) : [],
  );
  const [memberIds, setMemberIds] = useState<string[]>(() =>
    isEditMode ? (list?.memberIds ?? []) : [],
  );
  const [discoverItemIds, setDiscoverItemIds] = useState<string[]>(() =>
    isEditMode ? (list?.discoverItems?.map((i) => i.id) ?? []) : [],
  );

  const initialValues = useMemo(
    () =>
      isEditMode && list
        ? {
            name: list.name,
            description: list.description ?? '',
            coverImageUrl: list.coverImageUrl ?? '',
            tags: list.tags ?? [],
            memberIds: list.memberIds ?? [],
            discoverItemIds: list.discoverItems?.map((i) => i.id) ?? [],
            visibility:
              (list.visibility as ListVisibility) ?? ListVisibility.PRIVATE,
          }
        : {
            name: DEFAULT_VALUES.name,
            description: DEFAULT_VALUES.description,
            coverImageUrl: DEFAULT_VALUES.coverImageUrl,
            tags: DEFAULT_VALUES.tags,
            memberIds: DEFAULT_VALUES.memberIds,
            discoverItemIds: DEFAULT_VALUES.discoverItemIds,
            visibility: DEFAULT_VALUES.visibility,
          },
    [isEditMode, list],
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

  const computeIsDirty = useCallback(
    (values: {
      name?: string;
      description?: string;
      coverImageUrl?: string;
      visibility?: ListVisibility;
    }) => {
      const str = (s: string | undefined) => (s ?? '').trim();

      return (
        str(values?.name) !== str(initialValues.name) ||
        str(values?.description) !== str(initialValues.description) ||
        str(values?.coverImageUrl) !== str(initialValues.coverImageUrl) ||
        (values?.visibility ?? ListVisibility.PRIVATE) !==
          initialValues.visibility ||
        !arraysEqual(tags, initialValues.tags) ||
        !arraysEqual(memberIds, initialValues.memberIds) ||
        !arraysEqual(discoverItemIds, initialValues.discoverItemIds)
      );
    },
    [initialValues, tags, memberIds, discoverItemIds],
  );

  const formValues = useStore(form.store, (state) => state.values);
  const dirty =
    computeIsDirty((formValues as Record<string, unknown>) ?? {}) || false;

  const hasFormErrors = useMemo(() => {
    const v = (formValues ?? {}) as Record<string, unknown>;

    return !listSchema.safeParse({
      ...v,
      tags,
      memberIds,
      discoverItemIds,
    }).success;
  }, [formValues, tags, memberIds, discoverItemIds]);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const onSubmitClick = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form],
  );

  const onCancel = useCallback(() => {
    if (onCancelClick) {
      onCancelClick();
    } else {
      router.push(ROUTES.lists.root);
      router.refresh();
    }
  }, [router, onCancelClick]);

  return (
    <CardContent className="mx-auto w-full max-w-2xl">
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
              {(field) => {
                const description = field.state.value ?? '';

                return (
                  <LimitedTextarea
                    id={field.name}
                    name={field.name}
                    label="Description"
                    value={description}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="Tell what your list is about..."
                    rows={3}
                    overLimitMessage={`Description is too long. Maximum ${DESCRIPTION_MAX_LENGTH} characters.`}
                  />
                );
              }}
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

            <ListTagInput value={tags} onChange={setTags} />

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
                    <ListFriendSelector
                      value={memberIds}
                      onChange={setMemberIds}
                    />
                  )}
                </>
              )}
            </form.Field>

            <ListDiscoverItemSearch
              value={discoverItemIds}
              initialItems={
                isEditMode ? (list?.discoverItems ?? []) : undefined
              }
              onChange={(itemIds) => setDiscoverItemIds(itemIds)}
            />
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
            disabled={form.state.isSubmitting || isPending || hasFormErrors}
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
