import { performanceMonitor } from './performance';
import { handleError, AppError } from './error-handler';

interface RequestConfig extends RequestInit {
  retry?: number;
  retryDelay?: number;
  cache?: RequestCache;
  tags?: string[];
}

interface CacheConfig {
  ttl: number;
  tags?: string[];
}

class ApiClient {
  private baseUrl: string;
  private defaultConfig: RequestConfig;
  private cache: Map<string, { data: any; expires: number; tags: string[] }>;

  constructor(baseUrl: string = '', defaultConfig: RequestConfig = {}) {
    this.baseUrl = baseUrl;
    this.defaultConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      retry: 3,
      retryDelay: 1000,
      ...defaultConfig,
    };
    this.cache = new Map();
  }

  private async fetchWithRetry(
    url: string,
    config: RequestConfig
  ): Promise<Response> {
    const { retry = 3, retryDelay = 1000, ...fetchConfig } = config;
    let lastError: Error;

    for (let i = 0; i < retry; i++) {
      try {
        const response = await fetch(url, fetchConfig);
        if (!response.ok) {
          throw new AppError(
            `HTTP error! status: ${response.status}`,
            response.status
          );
        }
        return response;
      } catch (error) {
        lastError = error as Error;
        if (i === retry - 1) break;
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }

    throw lastError!;
  }

  private getCacheKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}-${url}-${JSON.stringify(config.body)}`;
  }

  private setCache(
    key: string,
    data: any,
    { ttl, tags = [] }: CacheConfig
  ): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
      tags,
    });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (cached.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  public clearCache(tags?: string[]): void {
    if (!tags) {
      this.cache.clear();
      return;
    }

    for (const [key, value] of this.cache.entries()) {
      if (tags.some(tag => value.tags.includes(tag))) {
        this.cache.delete(key);
      }
    }
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const finalConfig = {
      ...this.defaultConfig,
      ...config,
    };

    const cacheKey = this.getCacheKey(url, finalConfig);

    if (finalConfig.method === 'GET' || !finalConfig.method) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    const endTimer = performanceMonitor.startTimer(`api_${endpoint}`);

    try {
      const response = await this.fetchWithRetry(url, finalConfig);
      const data = await response.json();

      endTimer();

      if (finalConfig.method === 'GET' || !finalConfig.method) {
        this.setCache(cacheKey, data, {
          ttl: 5 * 60 * 1000,
          tags: finalConfig.tags,
        });
      }

      return data;
    } catch (error) {
      endTimer();
      throw handleError(error);
    }
  }

  public get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public post<T>(
    endpoint: string,
    data: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public put<T>(
    endpoint: string,
    data: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL);

import useSWR, { SWRConfiguration } from 'swr';

export function useApi<T>(
  endpoint: string,
  config: RequestConfig = {},
  swrConfig: SWRConfiguration = {}
) {
  const { data, error, mutate } = useSWR<T>(
    endpoint,
    () => apiClient.get<T>(endpoint, config),
    {
      revalidateOnFocus: false,
      ...swrConfig,
    }
  );

  return {
    data,
    error,
    loading: !data && !error,
    mutate,
  };
}