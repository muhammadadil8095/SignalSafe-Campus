/**
 * Central API client for SignalSafe Campus.
 *
 * All backend calls go through this module so that
 * the base URL and error handling are managed in one place.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  /** If true, JSON-parse the response body. Defaults to true. */
  json?: boolean;
}

/**
 * Low-level fetch wrapper that prepends the API base URL
 * and handles common error patterns.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json = true, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error ${response.status}: ${errorBody}`);
  }

  if (json) {
    return response.json() as Promise<T>;
  }

  return response as unknown as T;
}

/** API client with typed methods for each endpoint. */
export const api = {
  /** GET request */
  get<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'GET' });
  },

  /** POST request */
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** PATCH request */
  patch<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};

