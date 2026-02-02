'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const ALBUM_PALETTE = [
  { bg: '#3B82F6', gradient: ['#60A5FA', '#1D4ED8'], text: '#FFFFFF' },
  { bg: '#22C55E', gradient: ['#4ADE80', '#15803D'], text: '#FFFFFF' },
  { bg: '#F97316', gradient: ['#FDBA74', '#C2410C'], text: '#111827' },
  { bg: '#A855F7', gradient: ['#C084FC', '#6D28D9'], text: '#FFFFFF' },
  { bg: '#14B8A6', gradient: ['#5EEAD4', '#0F766E'], text: '#0F172A' },
  { bg: '#F43F5E', gradient: ['#FDA4AF', '#BE123C'], text: '#111827' },
] as const;

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
};

function getInitials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return 'NA';
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

function pickPaletteKey(title: string) {
  let hash = 0;

  for (let i = 0; i < title.length; i += 1) {
    hash = (hash + title.charCodeAt(i) * 17) % 9973;
  }

  return hash % ALBUM_PALETTE.length;
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

export function AlbumImage({ src = null, title, className }: AlbumImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = useMemo(
    () => (isValidImageSrc(src) ? src : undefined),
    [src],
  );
  const showFallback = !imageSrc || hasError;
  const palette = useMemo(() => ALBUM_PALETTE[pickPaletteKey(title)], [title]);
  const initials = useMemo(() => getInitials(title), [title]);
  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div
      className={cn(
        'aspect-album relative overflow-hidden rounded-lg',
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
