'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            console.log('LCP:', entry.startTime);
            break;
          case 'first-input':
            console.log('FID:', (entry as PerformanceEventTiming).processingStart - entry.startTime);
            break;
          case 'layout-shift':
            const layoutEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutEntry.hadRecentInput) {
              console.log('CLS:', layoutEntry.value);
            }
            break;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch {
      // Some browsers may not support all entry types
      console.warn('Performance monitoring not fully supported');
    }

    // Measure First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      console.log('FCP:', fcp.startTime);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

// Web Vitals measuring hook
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamic import for better bundle splitting
    import('web-vitals').then((webVitals) => {
      webVitals.onCLS(console.log);
      webVitals.onINP(console.log);
      webVitals.onFCP(console.log);
      webVitals.onLCP(console.log);
      webVitals.onTTFB(console.log);
    }).catch(() => {
      // Fallback if web-vitals is not available
      console.log('Web Vitals library not available');
    });
  }, []);
}
