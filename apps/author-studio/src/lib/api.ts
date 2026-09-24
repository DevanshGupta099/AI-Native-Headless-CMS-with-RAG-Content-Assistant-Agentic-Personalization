const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
  }
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('cp_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, BASE_URL);

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v));
      });
    }

    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message || 'Request failed', res.status, err?.error?.code);
    }

    return res.json();
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = new URL(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, BASE_URL);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message || 'Request failed', res.status, err?.error?.code);
    }

    return res.json();
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = new URL(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, BASE_URL);

    const res = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message || 'Request failed', res.status, err?.error?.code);
    }

    return res.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, BASE_URL);

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message || 'Request failed', res.status, err?.error?.code);
    }

    return res.json();
  }
}

export const api = new ApiClient();
