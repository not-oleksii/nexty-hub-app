'use client';

import { type SubmitEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Header2 } from '@/components/typography/header2';
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
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/utils/common';
import { type ListSchema, listSchema } from '@/lib/validators/list';
import { listsKeys, listsMutations } from '@/server/api/queries/lists.queries';

const DEFAULT_VALUES: ListSchema = {
  name: '',
};

export function CreateListForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError, isSuccess } = useMutation(
    listsMutations.create(),
  );

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: listSchema,
      onChange: listSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          name: value.name.trim(),
        });

        queryClient.invalidateQueries({ queryKey: listsKeys.all });

        router.push(ROUTES.lists.root);
        router.refresh();
      } catch (err) {
        console.error('Error creating list:', err);
      }
    },
  });

  const onSubmitClick = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <CardContent className="mx-auto w-full max-w-md">
      <Header2 className="mb-6">Create list</Header2>
      <form id="create-list-form" onSubmit={onSubmitClick}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="e.g. My Watchlist"
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
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
      <div className="mt-3 flex flex-col gap-2">
        {isError && <FieldError>{getErrorMessage(error)}</FieldError>}
        {isSuccess && (
          <FieldError className="text-success">
            List created successfully.
          </FieldError>
        )}
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="create-list-form"
            size="lg"
            disabled={form.state.isSubmitting || isPending}
            className="bg-primary hover:bg-primary/90 w-full rounded-lg px-6 font-medium shadow-md transition-shadow hover:shadow-lg"
          >
            {form.state.isSubmitting || isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </Field>
      </div>
    </CardContent>
  );
}
