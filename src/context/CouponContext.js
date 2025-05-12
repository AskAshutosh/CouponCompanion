import React, { createContext, useContext, useState, useEffect } from 'react';
import * as CouponService from '../services/CouponService';

// Create context
const CouponContext = createContext();

// Custom hook to use the coupon context
export const useCouponContext = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  
  // Initialize coupons from storage
  useEffect(() => {
    const initialCoupons = CouponService.getAllCoupons();
    setCoupons(initialCoupons);
  }, []);
  
  // Get all coupons
  const getAllCoupons = () => {
    return coupons;
  };
  
  // Add a new coupon
  const addCoupon = (couponData) => {
    const newCoupon = CouponService.addCoupon(couponData);
    setCoupons([...coupons, newCoupon]);
    return newCoupon;
  };
  
  // Delete a coupon
  const deleteCoupon = (id) => {
    CouponService.deleteCoupon(id);
    setCoupons(coupons.filter(coupon => coupon.id !== id));
  };
  
  // Get unique categories
  const getCategories = () => {
    return CouponService.getCategories();
  };
  
  // Search coupons
  const searchCoupons = (searchTerm) => {
    return CouponService.searchCoupons(searchTerm);
  };
  
  // Context value
  const contextValue = {
    coupons,
    getAllCoupons,
    addCoupon,
    deleteCoupon,
    getCategories,
    searchCoupons,
  };
  
  return (
    <CouponContext.Provider value={contextValue}>
      {children}
    </CouponContext.Provider>
  );
};
