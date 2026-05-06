// Facebook Pixel Event Tracking Utilities

export interface ProductData {
  id: string;
  title: string;
  price: number;
  currency?: string;
}

/**
 * Track when a user views a product
 */
export function trackViewContent(product: ProductData) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      content_name: product.title,
      content_type: 'product',
      content_ids: [product.id],
      value: product.price,
      currency: product.currency || 'USD',
    });
  }
}

/**
 * Track when a user initiates checkout
 */
export function trackInitiateCheckout(product: ProductData) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_name: product.title,
      content_type: 'product',
      content_ids: [product.id],
      value: product.price,
      currency: product.currency || 'USD',
    });
  }
}

/**
 * Track when a user completes a purchase
 */
export function trackPurchase(product: ProductData) {
  if (typeof window === 'undefined') return;
  
  // Wait for fbq to be available (max 5 attempts, 500ms each)
  const checkAndTrack = (attempts: number = 0) => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        content_name: product.title,
        content_type: 'product',
        content_ids: [product.id],
        value: product.price,
        currency: product.currency || 'USD',
      });
    } else if (attempts < 5) {
      setTimeout(() => checkAndTrack(attempts + 1), 500);
    } else {
      console.warn('Facebook pixel not available for purchase tracking');
    }
  };
  
  checkAndTrack();
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data);
  }
}
