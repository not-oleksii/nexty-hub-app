'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils/common';
import { pickGradientPalette } from '@/lib/utils/gradient';

const ALLOWED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'cdn.pixabay.com',
  'images.pexels.com',
  'res.cloudinary.com',
  'i.imgur.com',
  'upload.wikimedia.org',
  'lh3.googleusercontent.com',
  'avatars.githubusercontent.com',
  'media.istockphoto.com',
  'www.vecteezy.com',
]);

type AlbumImageProps = {
  src?: string | null;
  title: string;
  className?: string;
  aspectRatio?: string;
};

function getInitials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return 'NA';
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

function isValidImageSrc(src?: string | null) {
  if (!src) return false;
  if (src.startsWith('/')) return true;
  if (src.startsWith('data:')) return true;

  try {
    const url = new URL(src);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    return ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function AlbumImage({
  src = null,
  title,
  className,
  aspectRatio = 'aspect-album',
}: AlbumImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = useMemo(
    () => (isValidImageSrc(src) ? src : undefined),
    [src],
  );
  const showFallback = !imageSrc || hasError;
  const palette = useMemo(() => pickGradientPalette(title), [title]);
  const initials = useMemo(() => getInitials(title), [title]);
  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div
      className={cn(
        `${aspectRatio} relative overflow-hidden rounded-lg`,
        className,
      )}
    >
      {imageSrc && !hasError && (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      )}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 scale-110 blur-2xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${palette.gradient[0]}, ${palette.gradient[1]})`,
            }}
          />
          <div
            className="relative flex size-16 items-center justify-center rounded-full text-lg font-semibold tracking-wide shadow-sm"
            style={{ backgroundColor: palette.bg, color: palette.text }}
            aria-label={title}
          >
            {initials}
          </div>
        </div>
      )}
    </div>
  );
}
