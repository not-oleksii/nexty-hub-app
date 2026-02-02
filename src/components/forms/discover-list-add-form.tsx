'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ItemStatus, ItemType } from '@prisma/client';
import { useController, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Caption1 } from '@/components/typography/caption1';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const toOptionalTrimmed = (value: string) => {
  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
};

const formSchema = z.object({
  type: z.enum(ItemType),
  status: z.enum(ItemStatus),
  category: z.string().max(50, 'Category is too long.'),
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().max(1000, 'Description is too long.'),
  imageUrl: z.union([z.url('Enter a valid URL.'), z.literal('')]),
});

type AddItemFormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: AddItemFormValues = {
  type: ItemType.MOVIE,
  status: ItemStatus.TODO,
  category: '',
  title: '',
  description: '',
  imageUrl: '',
};

export function AddDiscoverItemForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const onSubmit = useCallback(
    async (values: AddItemFormValues) => {
      setSubmitError(null);

      try {
        const payload = {
          type: values.type,
          status: values.status,
          title: values.title.trim(),
          category: toOptionalTrimmed(values.category),
          description: toOptionalTrimmed(values.description),
          imageUrl: toOptionalTrimmed(values.imageUrl),
        };

        const res = await fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;

          throw new Error(data?.error || `Request failed (${res.status})`);
        }

        form.reset(DEFAULT_VALUES);
        router.push('/discover-list');
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';

        setSubmitError(message);
      }
    },
    [form, router],
  );

  const {
    control,
    formState: { errors, isSubmitting, isValid },
  } = form;

  const handleSubmit = useCallback(() => {
    void form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  const handleReset = useCallback(() => {
    form.reset(DEFAULT_VALUES);
    setSubmitError(null);
  }, [form]);

  const typeField = useController({ name: 'type', control });
  const statusField = useController({ name: 'status', control });
  const categoryField = useController({ name: 'category', control });
  const titleField = useController({ name: 'title', control });
  const imageUrlField = useController({ name: 'imageUrl', control });
  const descriptionField = useController({ name: 'description', control });
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const formElement = formRef.current;

    if (!formElement) {
      return;
    }

    const submitHandler = (event: Event) => {
      event.preventDefault();
      void handleSubmit();
    };

    const resetHandler = (event: Event) => {
      event.preventDefault();
      handleReset();
    };

    formElement.addEventListener('submit', submitHandler);
    formElement.addEventListener('reset', resetHandler);

    return () => {
      formElement.removeEventListener('submit', submitHandler);
      formElement.removeEventListener('reset', resetHandler);
    };
  }, [handleReset, handleSubmit]);

  return (
    <CardContent className="flex flex-col gap-3">
      <form className="flex flex-col gap-3" ref={formRef}>
        <label className="flex flex-col gap-1">
          <Caption1>Type</Caption1>
          <select
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            {...typeField.field}
          >
            {Object.values(ItemType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <Caption1>Status</Caption1>
          <select
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            {...statusField.field}
          >
            {Object.values(ItemStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <Caption1>Category</Caption1>
          <Input {...categoryField.field} placeholder="e.g. Sci-Fi" />
          {errors.category && (
            <Caption1 className="text-destructive">
              {errors.category.message}
            </Caption1>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <Caption1>Title *</Caption1>
          <Input {...titleField.field} placeholder="e.g. Interstellar" />
          {errors.title && (
            <Caption1 className="text-destructive">
              {errors.title.message}
            </Caption1>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <Caption1>Image URL</Caption1>
          <Input {...imageUrlField.field} placeholder="https://..." />
          {errors.imageUrl && (
            <Caption1 className="text-destructive">
              {errors.imageUrl.message}
            </Caption1>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <Caption1>Description</Caption1>
          <Textarea {...descriptionField.field} className="min-h-24" />
          {errors.description && (
            <Caption1 className="text-destructive">
              {errors.description.message}
            </Caption1>
          )}
        </label>

        {submitError && (
          <Caption1 className="text-destructive">{submitError}</Caption1>
        )}

        <div className="flex gap-2">
          <Button disabled={!isValid || isSubmitting} type="submit">
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
