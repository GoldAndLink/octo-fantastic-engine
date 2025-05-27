type MetricName = string;
type MetricValue = number;
type MetricLabels = Record<string, string>;

class PerformanceMonitor {
  private metrics: Map<string, { value: number; timestamp: number; labels?: MetricLabels }>;
  private static instance: PerformanceMonitor;

  private constructor() {
    this.metrics = new Map();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public recordMetric(name: MetricName, value: MetricValue, labels?: MetricLabels): void {
    this.metrics.set(name, {
      value,
      timestamp: Date.now(),
      labels,
    });

    if (process.env.NODE_ENV === 'production') {
      this.reportMetric(name, value, labels);
    }
  }

  public startTimer(name: MetricName): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  public async measureAsyncOperation<T>(
    name: MetricName,
    operation: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration);
      throw error;
    }
  }

  private reportMetric(name: MetricName, value: MetricValue, labels?: MetricLabels): void {
    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      window.performance.mark(name);
    }

    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('event', 'performance_metric', {
    //     metric_name: name,
    //     metric_value: value,
    //     ...labels,
    //   });
    // }
  }

  public getMetric(name: MetricName): { value: number; timestamp: number; labels?: MetricLabels } | undefined {
    return this.metrics.get(name);
  }

  public clearMetrics(): void {
    this.metrics.clear();
  }
}



export const performanceMonitor = PerformanceMonitor.getInstance();

export const usePerformanceMonitor = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      console.log(`Component ${componentName} rendered in ${duration}ms`);
      performanceMonitor.recordMetric(`render_${componentName}`, duration);
    };
  }
  return () => {};
};