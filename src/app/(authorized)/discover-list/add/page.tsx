'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ITEM_TYPES = ['MOVIE', 'SERIES', 'GAME', 'BOOK', 'COURSE', 'OTHER'] as const;
const ITEM_STATUSES = ['TODO', 'DONE'] as const;

type ItemType = (typeof ITEM_TYPES)[number];
type ItemStatus = (typeof ITEM_STATUSES)[number];

type FormState = {
  type: ItemType;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  status: ItemStatus;
};

const DEFAULT_FORM: FormState = {
  type: 'MOVIE',
  category: '',
  title: '',
  description: '',
  imageUrl: '',
  status: 'TODO',
};

export default function AddDiscoverItemPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return form.title.trim().length > 0 && !isSubmitting;
  }, [form.title, isSubmitting]);

  const onTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      type: e.target.value as ItemType,
    }));
  }, []);

  const onStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      status: e.target.value as ItemStatus,
    }));
  }, []);

  const onCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  }, []);

  const onTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  }, []);

  const onImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      imageUrl: e.target.value,
    }));
  }, []);

  const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  }, []);

  const onReset = useCallback(() => {
    setForm(DEFAULT_FORM);
    setError(null);
  }, []);

  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: form.type,
          category: form.category.trim() || undefined,
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          imageUrl: form.imageUrl.trim() || undefined,
          status: form.status,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;

        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setForm(DEFAULT_FORM);

      router.push('/discover-list');
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, router]);

  return (
    <ContentWrapper className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Header1>Add item</Header1>
          <Caption1>Create a new discover item (movie/series/game/book/...)</Caption1>
        </div>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          href="/discover-list"
        >
          Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item details</CardTitle>
          <CardDescription>All fields except title are optional.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <Caption1>Type</Caption1>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              onChange={onTypeChange}
              value={form.type}
            >
              {ITEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <Caption1>Status</Caption1>
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              onChange={onStatusChange}
              value={form.status}
            >
              {ITEM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <Caption1>Category</Caption1>
            <Input onChange={onCategoryChange} placeholder="e.g. Sci-Fi" value={form.category} />
          </label>

          <label className="flex flex-col gap-1">
            <Caption1>Title *</Caption1>
            <Input onChange={onTitleChange} placeholder="e.g. Interstellar" value={form.title} />
          </label>

          <label className="flex flex-col gap-1">
            <Caption1>Image URL</Caption1>
            <Input onChange={onImageUrlChange} placeholder="https://..." value={form.imageUrl} />
          </label>

          <label className="flex flex-col gap-1">
            <Caption1>Description</Caption1>
            <Textarea onChange={onDescriptionChange} value={form.description} />
          </label>

          {error ? <Caption1 className="text-destructive">{error}</Caption1> : null}

          <div className="flex gap-2">
            <Button disabled={!canSubmit} onClick={onSubmit}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
            <Button
              onClick={onReset}
              type="button"
              variant="secondary"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </ContentWrapper>
  );
}
