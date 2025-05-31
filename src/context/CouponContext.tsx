import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Coupon, CouponContextType, DetectedCouponData } from '../types';
import * as CouponService from '../services/CouponService';
import * as AutoDetectionService from '../services/AutoDetectionService';

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
    const initialCoupons = CouponService.getAllCoupons();
    setCoupons(initialCoupons);
  }, []);

  // Initialize auto-detection monitoring
  useEffect(() => {
    const handleDetectedCoupons = (detectedCoupons: DetectedCouponData[]) => {
      // Auto-add detected coupons with high confidence
      detectedCoupons.forEach(detected => {
        if (detected.confidence > 0.7) {
          // Check if coupon already exists
          const exists = coupons.some(coupon => 
            coupon.code === detected.code && 
            coupon.storeName.toLowerCase() === detected.storeName.toLowerCase()
          );
          
          if (!exists) {
            const couponData: Partial<Coupon> = {
              storeName: detected.storeName,
              category: 'Auto-Detected',
              code: detected.code,
              description: detected.description,
              expiryDate: detected.expiryDate,
              detectedFrom: detected.source
            };
            
            addCoupon(couponData);
          }
        }
      });
    };

    if (isAutoDetectionEnabled) {
      AutoDetectionService.startAutoDetectionMonitoring(handleDetectedCoupons);
    } else {
      AutoDetectionService.stopAutoDetectionMonitoring();
    }

    return () => {
      AutoDetectionService.stopAutoDetectionMonitoring();
    };
  }, [isAutoDetectionEnabled, coupons]);
  
  // Get all coupons
  const getAllCoupons = (): Coupon[] => {
    return coupons;
  };
  
  // Add a new coupon
  const addCoupon = (couponData: Partial<Coupon>): Coupon => {
    const newCoupon = CouponService.addCoupon(couponData);
    setCoupons(prevCoupons => [...prevCoupons, newCoupon]);
    return newCoupon;
  };
  
  // Delete a coupon
  const deleteCoupon = (id: string): void => {
    CouponService.deleteCoupon(id);
    setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon.id !== id));
  };
  
  // Get unique categories
  const getCategories = (): string[] => {
    return CouponService.getCategories();
  };
  
  // Search coupons
  const searchCoupons = (searchTerm: string): Coupon[] => {
    return CouponService.searchCoupons(searchTerm);
  };

  // Get expired coupons
  const getExpiredCoupons = (): Coupon[] => {
    return CouponService.getExpiredCoupons();
  };

  // Get expiring soon coupons
  const getExpiringSoonCoupons = (days?: number): Coupon[] => {
    return CouponService.getExpiringSoonCoupons(days);
  };

  // Enable/disable auto-detection
  const enableAutoDetection = (enabled: boolean): void => {
    setIsAutoDetectionEnabled(enabled);
    AutoDetectionService.enableAutoDetection(enabled);
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
