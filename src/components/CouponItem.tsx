import React, { useState } from 'react';
import { copyToClipboard } from '../services/ClipboardService';

const CouponItem = ({ coupon }) => {
  const [showToast, setShowToast] = useState(false);
  
  const handleCopyClick = () => {
    copyToClipboard(coupon.code);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Format expiry date
  const formatExpiryDate = (dateString) => {
    if (!dateString) return 'No expiry date';
    
    const expiryDate = new Date(dateString);
    const today = new Date();
    
    // Check if the date is valid
    if (isNaN(expiryDate.getTime())) return 'No expiry date';
    
    // Check if expired
    if (expiryDate < today) {
      return `Expired on ${expiryDate.toLocaleDateString()}`;
    }
    
    // Calculate days remaining
    const diffTime = Math.abs(expiryDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Expires today!';
    } else if (diffDays === 1) {
      return 'Expires tomorrow';
    } else {
      return `Expires in ${diffDays} days`;
    }
  };

  return (
    <div className="coupon-item">
      <div className="coupon-header">
        <span className="store-name">{coupon.storeName}</span>
        <span className="coupon-expiry">{formatExpiryDate(coupon.expiryDate)}</span>
      </div>
      
      <div className="coupon-code">
        <span>{coupon.code}</span>
        <button className="copy-btn" onClick={handleCopyClick}>
          <i className="fas fa-copy"></i>
        </button>
      </div>
      
      {coupon.description && (
        <div className="coupon-description">{coupon.description}</div>
      )}
      
      {showToast && (
        <div className="toast-notification">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default CouponItem;
