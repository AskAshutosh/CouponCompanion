import { Coupon, CouponStatus } from '../types';

// In-memory storage for coupons
let coupons: Coupon[] = [
  {
    id: '1',
    storeName: 'Amazon',
    category: 'Shopping',
    code: 'SAVE20',
    description: '20% off on all items',
    expiryDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isExpired: false,
    daysUntilExpiry: 7
  },
  {
    id: '2',
    storeName: 'Walmart',
    category: 'Shopping',
    code: 'FREESHIP',
    description: 'Free shipping on orders over $50',
    expiryDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isExpired: false,
    daysUntilExpiry: 14
  },
  {
    id: '3',
    storeName: 'Uber Eats',
    category: 'Food',
    code: 'EATS15',
    description: '$15 off your first order',
    expiryDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isExpired: false,
    daysUntilExpiry: 3
  },
];

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Calculate expiry information
const calculateExpiryInfo = (expiryDate?: string): { isExpired: boolean; daysUntilExpiry?: number } => {
  if (!expiryDate) return { isExpired: false };
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isExpired: diffDays < 0,
    daysUntilExpiry: Math.max(0, diffDays)
  };
};

// Update coupon expiry status
const updateCouponExpiryStatus = (coupon: Coupon): Coupon => {
  const expiryInfo = calculateExpiryInfo(coupon.expiryDate);
  return { ...coupon, ...expiryInfo };
};

// Get all coupons with updated expiry status
export const getAllCoupons = (): Coupon[] => {
  coupons = coupons.map(updateCouponExpiryStatus);
  return [...coupons];
};

// Add a new coupon
export const addCoupon = (couponData: Partial<Coupon>): Coupon => {
  const now = new Date().toISOString();
  const expiryInfo = calculateExpiryInfo(couponData.expiryDate);
  
  const newCoupon: Coupon = {
    id: generateId(),
    storeName: couponData.storeName || '',
    category: couponData.category || '',
    code: couponData.code || '',
    description: couponData.description,
    expiryDate: couponData.expiryDate,
    createdAt: now,
    updatedAt: now,
    detectedFrom: couponData.detectedFrom,
    ...expiryInfo
  };
  
  coupons = [...coupons, newCoupon];
  return newCoupon;
};

// Delete a coupon
export const deleteCoupon = (id: string): void => {
  coupons = coupons.filter((coupon) => coupon.id !== id);
};

// Get unique categories
export const getCategories = (): string[] => {
  return [...new Set(coupons.map((coupon) => coupon.category))];
};

// Search coupons
export const searchCoupons = (searchTerm: string): Coupon[] => {
  const updated = getAllCoupons();
  return updated.filter((coupon) => {
    const term = searchTerm.toLowerCase();
    return (
      coupon.storeName.toLowerCase().includes(term) ||
      coupon.code.toLowerCase().includes(term) ||
      coupon.category.toLowerCase().includes(term) ||
      (coupon.description && coupon.description.toLowerCase().includes(term))
    );
  });
};

// Get expired coupons
export const getExpiredCoupons = (): Coupon[] => {
  const updated = getAllCoupons();
  return updated.filter(coupon => coupon.isExpired);
};

// Get coupons expiring soon
export const getExpiringSoonCoupons = (days: number = 7): Coupon[] => {
  const updated = getAllCoupons();
  return updated.filter(coupon => 
    !coupon.isExpired && 
    coupon.daysUntilExpiry !== undefined && 
    coupon.daysUntilExpiry <= days
  );
};

// Get coupon status
export const getCouponStatus = (coupon: Coupon): CouponStatus => {
  if (coupon.isExpired) return CouponStatus.EXPIRED;
  if (coupon.daysUntilExpiry !== undefined && coupon.daysUntilExpiry <= 3) {
    return CouponStatus.EXPIRING_SOON;
  }
  return CouponStatus.ACTIVE;
};
