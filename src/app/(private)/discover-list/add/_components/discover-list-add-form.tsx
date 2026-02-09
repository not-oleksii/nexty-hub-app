'use client';

import { type SubmitEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ItemType } from '@generated/prisma/enums';
import { useForm } from '@tanstack/react-form-nextjs';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createDiscoverItem } from '@/server/api/discover';
import { getErrorMessage } from '@/server/lib/utils';

const toOptionalTrimmed = (value: string) => {
  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
};

const formSchema = z.object({
  type: z.enum(ItemType),
  completed: z.boolean(),
  category: z.string().max(50, 'Category is too long.'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9\s'’\-:.,!?()&/+#]*$/,
      'Title can only include letters, numbers, spaces, and common title symbols.',
    ),
  description: z.string().max(1000, 'Description is too long.'),
  imageUrl: z.union([z.url('Enter a valid URL.'), z.literal('')]),
});

type AddItemFormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: AddItemFormValues = {
  type: ItemType.MOVIE,
  completed: false,
  category: '',
  title: '',
  description: '',
  imageUrl: '',
};

export function AddDiscoverItemForm() {
  const router = useRouter();
  const { mutateAsync, isPending, error, isSuccess, isError } = useMutation({
    mutationFn: createDiscoverItem,
  });

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          type: value.type,
          title: value.title.trim(),
          category: toOptionalTrimmed(value.category),
          description: toOptionalTrimmed(value.description),
          imageUrl: toOptionalTrimmed(value.imageUrl),
          completed: value.completed,
        });

        form.reset(DEFAULT_VALUES);
        router.push('/discover-list');
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const onSubmitClick = useCallback(
    (event: SubmitEvent) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form],
  );

  const onResetClick = useCallback(() => {
    form.reset(DEFAULT_VALUES);
  }, [form]);

  return (
    <CardContent>
      <form id="discover-item-form" onSubmit={onSubmitClick}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <form.Field name="type">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const handleTypeChange = (value: string) => {
                    field.handleChange(value as ItemType);
                  };

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                      <Select
                        value={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onValueChange={handleTypeChange}
                      >
                        <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.values(ItemType) as ItemType[]).map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="category">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="e.g. Sci-Fi"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="completed">
                {(field) => (
                  <Field>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={field.name}
                        checked={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onCheckedChange={(checked) =>
                          field.handleChange(Boolean(checked))
                        }
                      />
                      <FieldLabel htmlFor={field.name}>
                        Mark as completed
                      </FieldLabel>
                    </div>
                  </Field>
                )}
              </form.Field>

              <form.Field name="title">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="e.g. Interstellar"
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

              <form.Field name="imageUrl">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="https://..."
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
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="min-h-24"
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
            Item created successfully.
          </FieldError>
        )}
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="discover-item-form"
            disabled={form.state.isSubmitting || isPending}
          >
            {form.state.isSubmitting || isPending ? 'Saving…' : 'Save'}
          </Button>
          <Button type="reset" variant="secondary" onClick={onResetClick}>
            Reset
          </Button>
        </Field>
      </div>
    </CardContent>
  );
}
