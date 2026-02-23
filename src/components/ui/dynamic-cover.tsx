'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils/common';
import { pickGradientPalette } from '@/lib/utils/gradient';
import { getInitials, isValidImageSrc } from '@/lib/utils/image';

type DynamicCoverProps = {
  title: string;
  src?: string | null;
  fallbackSrcs?: (string | null | undefined)[];
  className?: string;
  aspectRatio?: string;
  fallbackVariant?: 'gradient-only' | 'initials';
  strictHosts?: boolean;
  actions?: ReactNode;
};

export function DynamicCover({
  title,
  src,
  fallbackSrcs = [],
  className,
  aspectRatio = 'aspect-[16/9]',
  fallbackVariant = 'initials',
  strictHosts = false,
  actions,
}: DynamicCoverProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageSrc = useMemo(() => {
    const candidates = [src, ...fallbackSrcs];

    return candidates.find((c) => isValidImageSrc(c, strictHosts)) ?? null;
  }, [src, fallbackSrcs, strictHosts]);

  const showFallback = !imageSrc || hasError;
  const palette = useMemo(() => pickGradientPalette(title), [title]);
  const initials = useMemo(() => getInitials(title), [title]);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div
      className={cn(
        'bg-muted/10 group relative overflow-hidden',
        aspectRatio,
        className,
      )}
    >
      {imageSrc && !hasError && (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className={cn(
            'object-cover transition-all duration-700 ease-in-out group-hover:scale-105',
            isLoaded ? 'blur-0 opacity-100' : 'scale-105 opacity-0 blur-md',
          )}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
        />
      )}

      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, ${palette.gradient[0]}, ${palette.gradient[1]}, ${palette.gradient[2]})`,
            }}
          />

          {fallbackVariant === 'initials' && (
            <div
              className="relative z-10 flex size-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold tracking-wider text-white shadow-xl ring-2 ring-white/80 backdrop-blur-md"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </div>
      )}

      {actions && (
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
      )}

      {actions && (
        <div
          className="absolute top-3 right-3 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
