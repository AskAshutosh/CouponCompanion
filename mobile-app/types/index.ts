export interface Coupon {
  id: string;
  storeName: string;
  category: string;
  code: string;
  description?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  daysUntilExpiry?: number;
  detectedFrom?: DetectionSource;
}

export interface DetectionSource {
  url?: string;
  appName?: string;
  detectedAt: string;
  confidence: number;
}

export interface CouponFormData {
  storeName: string;
  category: string;
  code: string;
  description: string;
  expiryDate: string;
  newCategory: string;
}

export interface CouponContextType {
  coupons: Coupon[];
  getAllCoupons: () => Coupon[];
  addCoupon: (couponData: Partial<Coupon>) => Coupon;
  deleteCoupon: (id: string) => void;
  getCategories: () => string[];
  searchCoupons: (searchTerm: string) => Coupon[];
  getExpiredCoupons: () => Coupon[];
  getExpiringSoonCoupons: (days?: number) => Coupon[];
  enableAutoDetection: (enabled: boolean) => void;
  isAutoDetectionEnabled: boolean;
}

export interface AutoDetectionSettings {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  blacklistedDomains: string[];
  trustedDomains: string[];
}

export enum CouponStatus {
  ACTIVE = 'active',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired'
}

export interface DetectedCouponData {
  code: string;
  storeName: string;
  description?: string;
  expiryDate?: string;
  source: DetectionSource;
  confidence: number;
}

export type RootStackParamList = {
  Home: undefined;
  AddCoupon: undefined;
  CouponDetails: { coupon: Coupon };
  Settings: undefined;
  ExpirationTracker: undefined;
};

export type BottomTabParamList = {
  Coupons: undefined;
  Categories: undefined;
  Expired: undefined;
  Settings: undefined;
};