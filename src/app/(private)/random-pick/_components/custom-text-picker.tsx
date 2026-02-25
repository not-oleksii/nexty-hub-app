'use client';

import { useEffect, useMemo, useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import type { SpinCandidate } from './types';

interface CustomTextPickerProps {
  onPoolChange: (candidates: SpinCandidate[]) => void;
}

export function CustomTextPicker({ onPoolChange }: CustomTextPickerProps) {
  const [text, setText] = useState('');
  const debouncedText = useDebouncedValue(text);

  const candidates = useMemo(() => {
    const lines = debouncedText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line, index) => ({
      id: `text-${index}-${line.slice(0, 20)}`,
      name: line,
    })) as SpinCandidate[];
  }, [debouncedText]);

  useEffect(() => {
    if (debouncedText === '') return;

    onPoolChange(candidates);
  }, [candidates, onPoolChange, debouncedText]);

  return (
    <Textarea
      className="min-h-[200px] resize-y"
      placeholder="Enter options here...&#10;(one option per line)"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
