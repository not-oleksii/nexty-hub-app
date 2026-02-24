interface FetchConfig extends RequestInit {}

function getErrorMessageFromBody(body: unknown, fallback: string): string {
  if (typeof body !== 'object' || body === null) {
    return fallback;
  }

  const obj = body as Record<string, unknown>;

  if (typeof obj.error === 'string') {
    return obj.error;
  }

  if (typeof obj.message === 'string') {
    return obj.message;
  }

  return fallback;
}

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
    const responseBody = await res.json().catch(() => ({}));
    const message = getErrorMessageFromBody(
      responseBody,
      `Request failed: ${res.status} ${res.statusText}`,
    );

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function postJson<T>(
  path: string,
  body: unknown = {},
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
    const responseBody = await res.json().catch(() => ({}));
    const message = getErrorMessageFromBody(
      responseBody,
      `Request failed: ${res.status} ${res.statusText}`,
    );

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function putJson<T>(
  path: string,
  body: unknown = {},
  config?: FetchConfig,
): Promise<T> {
  const url = await resolveRequestUrl(path);

  const res = await fetch(url, {
    method: 'PUT',
    cache: 'no-store',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    const message = getErrorMessageFromBody(
      responseBody,
      `Request failed: ${res.status} ${res.statusText}`,
    );

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function deleteJson<T>(
  path: string,
  config?: FetchConfig,
): Promise<T> {
  const url = await resolveRequestUrl(path);

  const res = await fetch(url, {
    method: 'DELETE',
    cache: 'no-store',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    const message = getErrorMessageFromBody(
      responseBody,
      `Request failed: ${res.status} ${res.statusText}`,
    );

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function patchJson<T>(
  path: string,
  body: unknown = {},
  config?: FetchConfig,
): Promise<T> {
  const url = await resolveRequestUrl(path);

  const res = await fetch(url, {
    method: 'PATCH',
    cache: 'no-store',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    const message = getErrorMessageFromBody(
      responseBody,
      `Request failed: ${res.status} ${res.statusText}`,
    );

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
