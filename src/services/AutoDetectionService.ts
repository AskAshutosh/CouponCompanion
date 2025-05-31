import { DetectedCouponData, DetectionSource, AutoDetectionSettings } from '../types';

// Auto-detection settings
let autoDetectionSettings: AutoDetectionSettings = {
  enabled: false,
  sensitivity: 'medium',
  blacklistedDomains: ['example.com'],
  trustedDomains: ['amazon.com', 'walmart.com', 'target.com', 'ebay.com']
};

// Common coupon code patterns
const COUPON_PATTERNS = [
  /\b[A-Z0-9]{4,20}\b/g, // Generic alphanumeric codes
  /\b(?:SAVE|GET|OFF|FREE|DEAL|PROMO)[A-Z0-9]{2,15}\b/gi, // Promotional prefixes
  /\b[A-Z]{2,8}[0-9]{2,8}\b/g, // Mixed letter-number patterns
  /\b(?:CODE|COUPON|PROMO):\s*([A-Z0-9]{3,20})\b/gi, // Explicit coupon mentions
];

// Store name patterns and mappings
const STORE_PATTERNS = new Map([
  ['amazon', /amazon\.com|amazon\.ca|amazon\.co\.uk/i],
  ['walmart', /walmart\.com|walmart\.ca/i],
  ['target', /target\.com/i],
  ['ebay', /ebay\.com|ebay\.ca/i],
  ['bestbuy', /bestbuy\.com|bestbuy\.ca/i],
  ['homedepot', /homedepot\.com|homedepot\.ca/i],
]);

// Extract store name from URL or page title
const extractStoreName = (url: string, pageTitle?: string): string => {
  for (const [storeName, pattern] of STORE_PATTERNS) {
    if (pattern.test(url) || (pageTitle && pattern.test(pageTitle))) {
      return storeName.charAt(0).toUpperCase() + storeName.slice(1);
    }
  }
  
  // Fallback: extract domain name
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const parts = domain.split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'Unknown Store';
  }
};

// Calculate confidence score for detected coupon
const calculateConfidence = (
  code: string, 
  context: string, 
  url: string
): number => {
  let confidence = 0.3; // Base confidence
  
  // Boost confidence for explicit coupon mentions
  if (/(?:coupon|promo|code|discount)/i.test(context)) {
    confidence += 0.3;
  }
  
  // Boost for trusted domains
  if (autoDetectionSettings.trustedDomains.some(domain => url.includes(domain))) {
    confidence += 0.2;
  }
  
  // Boost for common coupon patterns
  if (/^(?:SAVE|GET|OFF|FREE|DEAL)[A-Z0-9]+$/i.test(code)) {
    confidence += 0.2;
  }
  
  // Reduce for very short or very long codes
  if (code.length < 4 || code.length > 20) {
    confidence -= 0.2;
  }
  
  return Math.min(1.0, Math.max(0.0, confidence));
};

// Scan page content for coupon codes
export const scanPageForCoupons = (
  pageContent: string,
  url: string,
  pageTitle?: string
): DetectedCouponData[] => {
  if (!autoDetectionSettings.enabled) return [];
  
  // Check if domain is blacklisted
  if (autoDetectionSettings.blacklistedDomains.some(domain => url.includes(domain))) {
    return [];
  }
  
  const detectedCoupons: DetectedCouponData[] = [];
  const storeName = extractStoreName(url, pageTitle);
  
  // Find all potential coupon codes
  const allMatches = new Set<string>();
  
  COUPON_PATTERNS.forEach(pattern => {
    const matches = pageContent.match(pattern);
    if (matches) {
      matches.forEach(match => allMatches.add(match.trim()));
    }
  });
  
  // Process each potential coupon code
  allMatches.forEach(code => {
    // Skip very common words that might match patterns
    const commonWords = ['ABOUT', 'CONTACT', 'LOGIN', 'SIGNUP', 'SEARCH'];
    if (commonWords.includes(code.toUpperCase())) return;
    
    const confidence = calculateConfidence(code, pageContent, url);
    
    // Only include high-confidence detections based on sensitivity
    const minConfidence = {
      low: 0.3,
      medium: 0.5,
      high: 0.7
    }[autoDetectionSettings.sensitivity];
    
    if (confidence >= minConfidence) {
      const source: DetectionSource = {
        url,
        detectedAt: new Date().toISOString(),
        confidence
      };
      
      detectedCoupons.push({
        code,
        storeName,
        source,
        confidence
      });
    }
  });
  
  return detectedCoupons;
};

// Simulate browser extension functionality
export const simulatePageScan = (url: string): DetectedCouponData[] => {
  // Simulate different page content based on URL
  const mockPageContent = getMockPageContent(url);
  const pageTitle = getMockPageTitle(url);
  
  return scanPageForCoupons(mockPageContent, url, pageTitle);
};

// Mock page content for simulation
const getMockPageContent = (url: string): string => {
  if (url.includes('amazon')) {
    return `
      <div>Save 20% with code AMAZON20 at checkout</div>
      <span>Use promo code FREESHIP for free shipping</span>
      <p>Get 15% off your first order with NEWUSER15</p>
    `;
  } else if (url.includes('walmart')) {
    return `
      <div>Special offer: Use SAVE10 for 10% off</div>
      <span>Coupon code: WALMART25 - 25% off electronics</span>
    `;
  } else if (url.includes('target')) {
    return `
      <div>Exclusive deal with code TARGET15</div>
      <span>Free shipping with SHIPFREE</span>
    `;
  }
  
  return `
    <div>Check out our latest deals and offers</div>
    <span>Sign up for our newsletter for exclusive discounts</span>
  `;
};

const getMockPageTitle = (url: string): string => {
  if (url.includes('amazon')) return 'Amazon.com: Online Shopping';
  if (url.includes('walmart')) return 'Walmart.com: Save Money. Live Better.';
  if (url.includes('target')) return 'Target: Expect More. Pay Less.';
  return 'Online Store';
};

// Auto-detection settings management
export const getAutoDetectionSettings = (): AutoDetectionSettings => {
  return { ...autoDetectionSettings };
};

export const updateAutoDetectionSettings = (settings: Partial<AutoDetectionSettings>): void => {
  autoDetectionSettings = { ...autoDetectionSettings, ...settings };
};

export const enableAutoDetection = (enabled: boolean): void => {
  autoDetectionSettings.enabled = enabled;
};

export const isAutoDetectionEnabled = (): boolean => {
  return autoDetectionSettings.enabled;
};

// Start continuous monitoring (simulation)
let monitoringInterval: NodeJS.Timeout | null = null;

export const startAutoDetectionMonitoring = (
  onCouponsDetected: (coupons: DetectedCouponData[]) => void
): void => {
  if (monitoringInterval) {
    stopAutoDetectionMonitoring();
  }
  
  // Simulate periodic scanning of different websites
  const testUrls = [
    'https://amazon.com/deals',
    'https://walmart.com/special-offers',
    'https://target.com/promotions'
  ];
  
  let urlIndex = 0;
  
  monitoringInterval = setInterval(() => {
    if (autoDetectionSettings.enabled) {
      const currentUrl = testUrls[urlIndex % testUrls.length];
      const detectedCoupons = simulatePageScan(currentUrl);
      
      if (detectedCoupons.length > 0) {
        onCouponsDetected(detectedCoupons);
      }
      
      urlIndex++;
    }
  }, 10000); // Check every 10 seconds for demo purposes
};

export const stopAutoDetectionMonitoring = (): void => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
};