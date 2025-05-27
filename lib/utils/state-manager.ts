import { performanceMonitor } from './performance';

interface StorageConfig {
  prefix?: string;
  ttl?: number;
  secure?: boolean;
}

interface CachedItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class StateManager {
  private memoryCache: Map<string, any>;
  private prefix: string;
  private defaultTTL: number;
  private secure: boolean;
  private static instance: StateManager;

  private constructor(config: StorageConfig = {}) {
    this.memoryCache = new Map();
    this.prefix = config.prefix || 'app_';
    this.defaultTTL = config.ttl || 3600000;
    this.secure = config.secure || false;
  }

  public static getInstance(config?: StorageConfig): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager(config);
    }
    return StateManager.instance;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private encrypt(data: string): string {
    if (!this.secure) return data;
    const key = process.env.NEXT_PUBLIC_STORAGE_KEY || 'default-key';
    return data
      .split('')
      .map((char) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(0)))
      .join('');
  }

  private decrypt(data: string): string {
    if (!this.secure) return data;
    return this.encrypt(data);
  }

  public setItem<T>(
    key: string,
    value: T,
    ttl: number = this.defaultTTL
  ): void {
    const fullKey = this.getFullKey(key);
    const item: CachedItem<T> = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    this.memoryCache.set(fullKey, item);

    try {
      const serialized = JSON.stringify(item);
      const encrypted = this.encrypt(serialized);
      localStorage.setItem(fullKey, encrypted);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    performanceMonitor.recordMetric(`state_set_${key}`, performance.now());
  }

  public getItem<T>(key: string): T | null {
    const fullKey = this.getFullKey(key);
    const start = performance.now();

    const memoryItem = this.memoryCache.get(fullKey) as CachedItem<T> | undefined;
    if (memoryItem) {
      if (Date.now() - memoryItem.timestamp < memoryItem.ttl) {
        performanceMonitor.recordMetric(
          `state_get_${key}_memory`,
          performance.now() - start
        );
        return memoryItem.value;
      }
      this.memoryCache.delete(fullKey);
    }

    try {
      const encrypted = localStorage.getItem(fullKey);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      const item: CachedItem<T> = JSON.parse(decrypted);

      if (Date.now() - item.timestamp < item.ttl) {
        this.memoryCache.set(fullKey, item);
        performanceMonitor.recordMetric(
          `state_get_${key}_storage`,
          performance.now() - start
        );
        return item.value;
      }

      this.removeItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    return null;
  }

  public removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    this.memoryCache.delete(fullKey);
    try {
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  public clear(): void {
    this.memoryCache.clear();
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  private sessionState: Map<string, any> = new Map();

  public setSessionItem<T>(key: string, value: T): void {
    this.sessionState.set(this.getFullKey(key), value);
  }

  public getSessionItem<T>(key: string): T | undefined {
    return this.sessionState.get(this.getFullKey(key));
  }

  public removeSessionItem(key: string): void {
    this.sessionState.delete(this.getFullKey(key));
  }

  public clearSession(): void {
    this.sessionState.clear();
  }

  private subscribers: Map<string, Set<(value: any) => void>> = new Map();

  public subscribe(key: string, callback: (value: any) => void): () => void {
    const fullKey = this.getFullKey(key);
    if (!this.subscribers.has(fullKey)) {
      this.subscribers.set(fullKey, new Set());
    }
    this.subscribers.get(fullKey)!.add(callback);

    return () => {
      this.subscribers.get(fullKey)?.delete(callback);
      if (this.subscribers.get(fullKey)?.size === 0) {
        this.subscribers.delete(fullKey);
      }
    };
  }

  private notifySubscribers(key: string, value: any): void {
    const fullKey = this.getFullKey(key);
    this.subscribers.get(fullKey)?.forEach((callback) => callback(value));
  }

  public async batch(operations: Array<() => Promise<void>>): Promise<void> {
    const start = performance.now();
    try {
      await Promise.all(operations);
      performanceMonitor.recordMetric(
        'state_batch_operation',
        performance.now() - start
      );
    } catch (error) {
      console.error('Error in batch operation:', error);
      throw error;
    }
  }
}

export const stateManager = StateManager.getInstance({
  prefix: 'braintrust_',
  secure: process.env.NODE_ENV === 'production',
});

import { useState, useEffect } from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue: T,
  ttl?: number
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const persisted = stateManager.getItem<T>(key);
    return persisted !== null ? persisted : initialValue;
  });

  useEffect(() => {
    const unsubscribe = stateManager.subscribe(key, (value) => {
      setState(value);
    });
    return unsubscribe;
  }, [key]);

  const setValue = (value: T) => {
    setState(value);
    stateManager.setItem(key, value, ttl);
  };

  return [state, setValue];
}