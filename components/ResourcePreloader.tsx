'use client';

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  images?: string[];
  fonts?: Array<{
    href: string;
    crossOrigin?: string;
  }>;
}

export function ResourcePreloader({ images = [], fonts = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    const preloadedImages: HTMLLinkElement[] = [];
    const preloadedFonts: HTMLLinkElement[] = [];

    // Preload images
    images.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      preloadedImages.push(link);
    });

    // Preload fonts
    fonts.forEach(({ href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = href;
      link.type = 'font/woff2';
      if (crossOrigin) {
        link.crossOrigin = crossOrigin;
      }
      document.head.appendChild(link);
      preloadedFonts.push(link);
    });

    // Cleanup function
    return () => {
      [...preloadedImages, ...preloadedFonts].forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [images, fonts]);

  return null;
}