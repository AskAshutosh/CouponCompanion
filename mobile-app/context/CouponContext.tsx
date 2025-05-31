import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Coupon, CouponContextType, DetectedCouponData } from '../types';
import * as CouponService from '../services/CouponService';

// Create context
const CouponContext = createContext<CouponContextType | null>(null);

// Custom hook to use the coupon context
export const useCouponContext = (): CouponContextType => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};

interface CouponProviderProps {
  children: ReactNode;
}

export const CouponProvider: React.FC<CouponProviderProps> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAutoDetectionEnabled, setIsAutoDetectionEnabled] = useState(false);
  
  // Initialize coupons from storage
  useEffect(() => {
    const loadCoupons = async () => {
      const initialCoupons = await CouponService.getAllCoupons();
      setCoupons(initialCoupons);
    };
    
    loadCoupons();
  }, []);

  // Get all coupons
  const getAllCoupons = (): Coupon[] => {
    return coupons;
  };
  
  // Add a new coupon
  const addCoupon = async (couponData: Partial<Coupon>): Promise<Coupon> => {
    const newCoupon = await CouponService.addCoupon(couponData);
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
    return newCoupon;
  };
  
  // Delete a coupon
  const deleteCoupon = async (id: string): Promise<void> => {
    await CouponService.deleteCoupon(id);
    setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon.id !== id));
  };
  
  // Get unique categories
  const getCategories = (): string[] => {
    const categories = coupons.map(coupon => coupon.category);
    return Array.from(new Set(categories)).sort();
  };
  
  // Search coupons
  const searchCoupons = (searchTerm: string): Coupon[] => {
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
  const getExpiredCoupons = (): Coupon[] => {
    return coupons.filter(coupon => coupon.isExpired);
  };

  // Get expiring soon coupons
  const getExpiringSoonCoupons = (days?: number): Coupon[] => {
    const daysLimit = days || 7;
    return coupons.filter(coupon => 
      !coupon.isExpired && 
      coupon.daysUntilExpiry !== undefined && 
      coupon.daysUntilExpiry <= daysLimit
    );
  };

  // Enable/disable auto-detection
  const enableAutoDetection = (enabled: boolean): void => {
    setIsAutoDetectionEnabled(enabled);
  };
  
  // Context value
  const contextValue: CouponContextType = {
    coupons,
    getAllCoupons,
    addCoupon,
    deleteCoupon,
    getCategories,
    searchCoupons,
    getExpiredCoupons,
    getExpiringSoonCoupons,
    enableAutoDetection,
    isAutoDetectionEnabled,
  };
  
  return (
    <CouponContext.Provider value={contextValue}>
      {children}
    </CouponContext.Provider>
  );
};