import { ALLOWED_IMAGE_HOSTS } from '@/constants/image-hosts';

export function getInitials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'NA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export function isValidImageSrc(src?: string | null, strict = false) {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) return true;
  if (trimmed.startsWith('data:')) return true;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    return strict ? ALLOWED_IMAGE_HOSTS.has(url.hostname) : true;
  } catch {
    return false;
  }
}
