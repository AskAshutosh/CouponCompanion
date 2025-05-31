import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Coupon, CouponStatus } from '../types';

const STORAGE_KEY = 'coupon_keeper_coupons';

// Update coupon expiry status
const updateCouponExpiryStatus = (coupon: Coupon): Coupon => {
  if (!coupon.expiryDate) {
    return { ...coupon, isExpired: false, daysUntilExpiry: undefined };
  }

  const today = new Date();
  const expiryDate = new Date(coupon.expiryDate);
  
  if (isNaN(expiryDate.getTime())) {
    return { ...coupon, isExpired: false, daysUntilExpiry: undefined };
  }

  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return {
    ...coupon,
    isExpired: daysDiff < 0,
    daysUntilExpiry: daysDiff >= 0 ? daysDiff : undefined,
  };
};

// Get all coupons from storage
export const getAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const storedCoupons = await AsyncStorage.getItem(STORAGE_KEY);
    if (!storedCoupons) return [];
    
    const coupons: Coupon[] = JSON.parse(storedCoupons);
    return coupons.map(updateCouponExpiryStatus);
  } catch (error) {
    console.error('Error loading coupons:', error);
    return [];
  }
};

// Save coupons to storage
const saveCoupons = async (coupons: Coupon[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (error) {
    console.error('Error saving coupons:', error);
  }
};

// Add a new coupon
export const addCoupon = async (couponData: Partial<Coupon>): Promise<Coupon> => {
  const newCoupon: Coupon = {
    id: uuid.v4() as string,
    storeName: couponData.storeName || '',
    category: couponData.category || 'General',
    code: couponData.code || '',
    description: couponData.description,
    expiryDate: couponData.expiryDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isExpired: false,
    detectedFrom: couponData.detectedFrom,
  };

  const updatedCoupon = updateCouponExpiryStatus(newCoupon);
  const existingCoupons = await getAllCoupons();
  const updatedCoupons = [...existingCoupons, updatedCoupon];
  
  await saveCoupons(updatedCoupons);
  return updatedCoupon;
};

// Delete a coupon
export const deleteCoupon = async (id: string): Promise<void> => {
  const existingCoupons = await getAllCoupons();
  const filteredCoupons = existingCoupons.filter(coupon => coupon.id !== id);
  await saveCoupons(filteredCoupons);
};

// Get unique categories
export const getCategories = async (): Promise<string[]> => {
  const coupons = await getAllCoupons();
  const categories = coupons.map(coupon => coupon.category);
  return [...new Set(categories)].sort();
};

// Search coupons
export const searchCoupons = async (searchTerm: string): Promise<Coupon[]> => {
  const coupons = await getAllCoupons();
  if (!searchTerm.trim()) return coupons;
  
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  return coupons.filter(coupon =>
    coupon.storeName.toLowerCase().includes(lowercaseSearchTerm) ||
    coupon.code.toLowerCase().includes(lowercaseSearchTerm) ||
    coupon.category.toLowerCase().includes(lowercaseSearchTerm) ||
    (coupon.description && coupon.description.toLowerCase().includes(lowercaseSearchTerm))
  );
};

// Get expired coupons
export const getExpiredCoupons = async (): Promise<Coupon[]> => {
  const coupons = await getAllCoupons();
  return coupons.filter(coupon => coupon.isExpired);
};

// Get expiring soon coupons
export const getExpiringSoonCoupons = async (days: number = 7): Promise<Coupon[]> => {
  const coupons = await getAllCoupons();
  return coupons.filter(coupon => 
    !coupon.isExpired && 
    coupon.daysUntilExpiry !== undefined && 
    coupon.daysUntilExpiry <= days
  );
};

// Get coupon status
export const getCouponStatus = (coupon: Coupon): CouponStatus => {
  if (coupon.isExpired) return CouponStatus.EXPIRED;
  if (coupon.daysUntilExpiry !== undefined && coupon.daysUntilExpiry <= 7) {
    return CouponStatus.EXPIRING_SOON;
  }
  return CouponStatus.ACTIVE;
};