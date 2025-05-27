import { performanceMonitor } from './performance';

interface ImageOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  priority?: boolean;
}

class AssetLoader {
  private imageCache: Map<string, string>;
  private loadingPromises: Map<string, Promise<void>>;
  private static instance: AssetLoader;

  private constructor() {
    this.imageCache = new Map();
    this.loadingPromises = new Map();
  }

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  private getImageKey(src: string, options: ImageOptions = {}): string {
    return `${src}-${JSON.stringify(options)}`;
  }

  public async preloadImage(
    src: string,
    options: ImageOptions = {}
  ): Promise<void> {
    const key = this.getImageKey(src, options);

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    if (this.imageCache.has(key)) {
      return Promise.resolve();
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      const endTimer = performanceMonitor.startTimer(`image_load_${key}`);
      const img = new Image();

      img.onload = () => {
        this.imageCache.set(key, src);
        this.loadingPromises.delete(key);
        endTimer();
        resolve();
      };

      img.onerror = (error) => {
        this.loadingPromises.delete(key);
        endTimer();
        reject(error);
      };

      const urlObj = new URL(src);
      if (options.width) urlObj.searchParams.set('w', options.width.toString());
      if (options.height) urlObj.searchParams.set('h', options.height.toString());
      if (options.quality) urlObj.searchParams.set('q', options.quality.toString());
      if (options.format) urlObj.searchParams.set('fm', options.format);

      img.src = urlObj.toString();
    });

    this.loadingPromises.set(key, loadPromise);
    return loadPromise;
  }

  public async preloadImages(
    sources: Array<{ src: string; options?: ImageOptions }>
  ): Promise<void> {
    const promises = sources.map(({ src, options }) =>
      this.preloadImage(src, options)
    );
    await Promise.all(promises);
  }

  public isImageCached(src: string, options: ImageOptions = {}): boolean {
    return this.imageCache.has(this.getImageKey(src, options));
  }

  public clearImageCache(): void {
    this.imageCache.clear();
  }

  public preloadFont(
    family: string,
    url: string,
    options: FontFaceDescriptors = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const font = new FontFace(family, `url(${url})`, options);
      
      font.load().then((loadedFace) => {
        (document as any).fonts.add(loadedFace);
        resolve();
      }).catch(reject);
    });
  }

  public addResourceHint(
    url: string,
    type: 'preconnect' | 'prefetch' | 'preload' | 'dns-prefetch'
  ): void {
    const link = document.createElement('link');
    link.rel = type;
    link.href = url;
    
    if (type === 'preload') {
      const extension = url.split('.').pop();
      switch (extension) {
        case 'css':
          link.as = 'style';
          break;
        case 'js':
          link.as = 'script';
          break;
        case 'woff2':
        case 'woff':
        case 'ttf':
          link.as = 'font';
          link.crossOrigin = 'anonymous';
          break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'avif':
          link.as = 'image';
          break;
      }
    }

    document.head.appendChild(link);
  }

  public getOptimizedImageSrc(src: string, options: ImageOptions = {}): string {
    const urlObj = new URL(src);
    
    if (options.width) urlObj.searchParams.set('w', options.width.toString());
    if (options.height) urlObj.searchParams.set('h', options.height.toString());
    if (options.quality) urlObj.searchParams.set('q', options.quality.toString());
    if (options.format) urlObj.searchParams.set('fm', options.format);

    return urlObj.toString();
  }

  public generateSrcSet(
    src: string,
    widths: number[],
    options: Omit<ImageOptions, 'width'> = {}
  ): string {
    return widths
      .map(width => {
        const optimizedSrc = this.getOptimizedImageSrc(src, { ...options, width });
        return `${optimizedSrc} ${width}w`;
      })
      .join(', ');
  }
}

export const assetLoader = AssetLoader.getInstance();

import { useState, useEffect } from 'react';

export function useOptimizedImage(
  src: string,
  options: ImageOptions = {}
): { loading: boolean; error: Error | null } {
  const [loading, setLoading] = useState(!assetLoader.isImageCached(src, options));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src || assetLoader.isImageCached(src, options)) return;

    setLoading(true);
    setError(null);

    assetLoader
      .preloadImage(src, options)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [src, JSON.stringify(options)]);

  return { loading, error };
}