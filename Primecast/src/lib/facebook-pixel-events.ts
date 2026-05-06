// Facebook Pixel Event Tracking Utilities

export interface ProductData {
  id: string;
  title: string;
  price: number;
  currency?: string;
}

/**
 * Helper to ensure fbq is available before tracking
 */
function waitForFbq(callback: () => void, maxAttempts: number = 10) {
  const attempt = (count: number) => {
    if ((window as any).fbq) {
      callback();
    } else if (count < maxAttempts) {
      setTimeout(() => attempt(count + 1), 200);
    }
  };
  attempt(0);
}

/**
 * Track when a user views a product
 */
export function trackViewContent(product: ProductData) {
  if (typeof window === 'undefined') return;
  
  waitForFbq(() => {
    (window as any).fbq('track', 'ViewContent', {
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: product.currency || 'USD',
    });
  });
}

/**
 * Track when a user initiates checkout
 */
export function trackInitiateCheckout(product: ProductData) {
  if (typeof window === 'undefined') return;
  
  waitForFbq(() => {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: product.currency || 'USD',
    });
  });
}

/**
 * Track when a user completes a purchase
 * This is the most important conversion event
 */
export function trackPurchase(product: ProductData) {
  if (typeof window === 'undefined') return;
  
  waitForFbq(() => {
    (window as any).fbq('track', 'Purchase', {
      currency: product.currency || 'USD',
      value: product.price,
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
    });
  });
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  waitForFbq(() => {
    (window as any).fbq('track', eventName, data);
  });
}
