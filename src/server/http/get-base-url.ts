'use server';

import { headers } from 'next/headers';

export async function getBaseUrl() {
  const h = await headers();

  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host');

  if (!host) {
    return 'http://localhost:3000';
  }

  return `${proto}://${host}`;
}

export async function getJson<T>(path: string): Promise<T> {
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

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = new URL(path, baseUrl);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      typeof error?.error === 'string'
        ? error.error
        : `Request failed: ${res.status} ${res.statusText}`;

    throw new Error(message);
  }

  return (await res.json()) as T;
}
