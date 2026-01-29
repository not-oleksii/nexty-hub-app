import { getBaseUrl } from '@/server/http/get-base-url';

export type DiscoverItemDto = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  status?: string | null;
};

async function getJson<T>(path: string): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = new URL(path, baseUrl);

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function getDiscoverItems() {
  const data = await getJson<{ items: DiscoverItemDto[] }>('/api/discover');

  return data.items;
}

export async function getDiscoverMovies() {
  const data = await getJson<{ items: DiscoverItemDto[] }>('/api/discover/movies');

  return data.items;
}
