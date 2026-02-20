'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

import { pickGradientPalette } from '@/lib/utils/gradient';
import { cn } from '@/lib/utils/common';

type DiscoverItemWithImage = { imageUrl?: string | null };

type ListCoverProps = {
  coverImageUrl?: string | null;
  listName: string;
  discoverItems?: DiscoverItemWithImage[];
  className?: string;
};

function isValidImageSrc(src?: string | null) {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) return true;
  if (trimmed.startsWith('data:')) return true;

  try {
    const url = new URL(trimmed);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getFirstValidImageUrl(
  coverImageUrl: string | null | undefined,
  discoverItems: DiscoverItemWithImage[] | undefined,
): string | undefined {
  if (isValidImageSrc(coverImageUrl)) return coverImageUrl ?? undefined;

  const firstWithImage = discoverItems?.find((item) =>
    isValidImageSrc(item.imageUrl),
  );

  return firstWithImage?.imageUrl ?? undefined;
}

export function ListCover({
  coverImageUrl = null,
  listName,
  discoverItems,
  className,
}: ListCoverProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = useMemo(
    () => getFirstValidImageUrl(coverImageUrl, discoverItems),
    [coverImageUrl, discoverItems],
  );
  const showGradient = !imageSrc || hasError;
  const palette = useMemo(() => pickGradientPalette(listName), [listName]);
  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div
      className={cn('relative aspect-[16/9] w-full overflow-hidden', className)}
    >
      {imageSrc && !hasError && (
        <Image
          src={imageSrc}
          alt={listName}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      )}
      {showGradient && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${palette.gradient[0]}, ${palette.gradient[1]})`,
          }}
        />
      )}
    </div>
  );
}
