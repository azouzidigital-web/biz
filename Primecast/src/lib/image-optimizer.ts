export async function optimizeImages(images: string[]) {
  if (typeof window === 'undefined') return;

  // Simple preloading without complex state management
  const preloadImage = (src: string): void => {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    } catch (error) {
      console.warn(`Failed to prefetch image: ${src}`, error);
    }
  };

  // Preload first few images with higher priority
  const criticalImages = images.slice(0, 4);
  criticalImages.forEach(src => {
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    } catch (error) {
      console.warn(`Failed to preload critical image: ${src}`, error);
    }
  });

  // Prefetch remaining images with lower priority
  const remainingImages = images.slice(4);
  remainingImages.forEach(preloadImage);
}
