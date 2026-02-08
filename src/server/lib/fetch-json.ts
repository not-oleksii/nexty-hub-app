interface FetchConfig extends RequestInit {}

async function resolveRequestUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (typeof window !== 'undefined') {
    return path;
  }

  const { getBaseUrl } = await import('@/server/http/get-base-url');
  const baseUrl = await getBaseUrl();

  return new URL(path, baseUrl).toString();
}

export async function getJson<T>(
  path: string,
  config?: FetchConfig,
): Promise<T> {
  const url = await resolveRequestUrl(path);

  const res = await fetch(url, {
    cache: 'no-store',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);

    throw new Error(
      errorBody?.message ||
        `GET Request failed: ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}

export async function postJson<T>(
  path: string,
  body: unknown,
  config?: FetchConfig,
): Promise<T> {
  const url = await resolveRequestUrl(path);

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      typeof error?.error === 'string'
        ? error.error
        : `POST Request failed: ${res.status} ${res.statusText}`;

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
