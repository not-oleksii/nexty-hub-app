'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils/common';

import { Field, FieldError, FieldLabel } from './field';
import { Textarea } from './textarea';

export type LimitedTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'maxLength'
> & {
  label: string;
  maxLength: number;
  error?: string | boolean;
  overLimitMessage?: string;
  showCount?: boolean;
};

export const LimitedTextarea = forwardRef<
  HTMLTextAreaElement,
  LimitedTextareaProps
>(
  (
    {
      label,
      maxLength,
      error,
      overLimitMessage,
      showCount = true,
      value = '',
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const stringValue = typeof value === 'string' ? value : '';
    const length = stringValue.length;
    const isOverLimit = length > maxLength;
    const isNearLimit = length >= maxLength * 0.9 && length <= maxLength;
    const isInvalid = isOverLimit || Boolean(error);

    return (
      <Field data-invalid={isInvalid}>
        <div className="flex items-baseline justify-between">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {showCount && (
            <span
              className={cn(
                'text-muted-foreground text-xs tabular-nums',
                isOverLimit && 'text-destructive font-medium',
                isNearLimit && !isOverLimit && 'text-amber-500',
              )}
            >
              {length} / {maxLength}
            </span>
          )}
        </div>
        <Textarea
          ref={ref}
          id={id}
          value={stringValue}
          maxLength={undefined}
          aria-invalid={isInvalid}
          className={className}
          {...props}
        />
        {isOverLimit && (
          <FieldError>
            {overLimitMessage ?? `Maximum ${maxLength} characters.`}
          </FieldError>
        )}
        {error && typeof error === 'string' && !isOverLimit && (
          <FieldError>{error}</FieldError>
        )}
      </Field>
    );
  },
);

LimitedTextarea.displayName = 'LimitedTextarea';
