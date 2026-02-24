'use client';

import { useCallback, useRef, useState } from 'react';

import { XIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { Caption } from '@/components/typography/caption';
import { Badge } from '@/components/ui/badge';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SUGGESTED_TAGS } from '@/constants/suggested-tags';
import {
  containsProfanity,
  PROFANITY_MESSAGE,
} from '@/lib/validators/profanity';

type ListTagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export function ListTagInput({ value: tags, onChange }: ListTagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().toLowerCase();

      if (!trimmed) return;

      if (containsProfanity(trimmed)) {
        setTagError(PROFANITY_MESSAGE);

        return;
      }

      setTagError(null);

      if (tags.length >= 20) return;
      if (tags.some((t) => t.toLowerCase() === trimmed)) return;

      onChange([...tags, trimmed]);
      setTagInput('');
    },
    [tags, onChange],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(tags.filter((_, i) => i !== index));
    },
    [tags, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(tagInput);
      }
    },
    [tagInput, addTag],
  );

  return (
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
            ref={inputRef}
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              if (tagError) setTagError(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => tagInput.trim() && addTag(tagInput)}
            placeholder="Add tag..."
            className="h-7 w-24 text-sm"
          />
        )}
      </div>
      {tagError && <FieldError>{tagError}</FieldError>}
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
  );
}
