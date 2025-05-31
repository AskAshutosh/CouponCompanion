import React from 'react';
import { useCouponContext } from '../context/CouponContext';
import { Coupon, CouponStatus } from '../types';
import { getCouponStatus } from '../services/CouponService';

interface ExpirationTrackerProps {
  onClose: () => void;
}

const ExpirationTracker: React.FC<ExpirationTrackerProps> = ({ onClose }) => {
  const { getExpiredCoupons, getExpiringSoonCoupons, deleteCoupon } = useCouponContext();
  
  const expiredCoupons = getExpiredCoupons();
  const expiringSoonCoupons = getExpiringSoonCoupons(7);

  const formatExpiryDate = (dateString?: string): string => {
    if (!dateString) return 'No expiry date';
    
    const expiryDate = new Date(dateString);
    const today = new Date();
    
    if (isNaN(expiryDate.getTime())) return 'Invalid date';
    
    if (expiryDate < today) {
      const daysPast = Math.floor((today.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Expired ${daysPast} days ago`;
    }
    
    return expiryDate.toLocaleDateString();
  };

  const getStatusColor = (coupon: Coupon): string => {
    const status = getCouponStatus(coupon);
    switch (status) {
      case CouponStatus.EXPIRED:
        return '#ff4444';
      case CouponStatus.EXPIRING_SOON:
        return '#ff8800';
      default:
        return '#4a90e2';
    }
  };

  return (
    <div className="add-form-overlay">
      <div className="expiration-tracker">
        <div className="tracker-header">
          <h2>Expiration Tracker</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="tracker-content">
          {expiringSoonCoupons.length > 0 && (
            <div className="expiry-section">
              <h3 className="section-title expiring-soon">
                <i className="fas fa-exclamation-triangle"></i>
                Expiring Soon ({expiringSoonCoupons.length})
              </h3>
              {expiringSoonCoupons.map((coupon) => (
                <div key={coupon.id} className="expiry-item">
                  <div className="coupon-info">
                    <div className="store-code">
                      <span className="store-name">{coupon.storeName}</span>
                      <span className="coupon-code" style={{ backgroundColor: '#fff3cd' }}>
                        {coupon.code}
                      </span>
                    </div>
                    <div className="expiry-details">
                      <span className="expiry-date" style={{ color: getStatusColor(coupon) }}>
                        {coupon.daysUntilExpiry === 0 ? 'Expires today!' : 
                         coupon.daysUntilExpiry === 1 ? 'Expires tomorrow' :
                         `Expires in ${coupon.daysUntilExpiry} days`}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="delete-coupon-btn"
                    onClick={() => deleteCoupon(coupon.id)}
                    title="Delete expired coupon"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {expiredCoupons.length > 0 && (
            <div className="expiry-section">
              <h3 className="section-title expired">
                <i className="fas fa-times-circle"></i>
                Expired ({expiredCoupons.length})
              </h3>
              {expiredCoupons.map((coupon) => (
                <div key={coupon.id} className="expiry-item expired">
                  <div className="coupon-info">
                    <div className="store-code">
                      <span className="store-name">{coupon.storeName}</span>
                      <span className="coupon-code" style={{ backgroundColor: '#f8d7da' }}>
                        {coupon.code}
                      </span>
                    </div>
                    <div className="expiry-details">
                      <span className="expiry-date" style={{ color: '#dc3545' }}>
                        {formatExpiryDate(coupon.expiryDate)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="delete-coupon-btn"
                    onClick={() => deleteCoupon(coupon.id)}
                    title="Delete expired coupon"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {expiredCoupons.length === 0 && expiringSoonCoupons.length === 0 && (
            <div className="no-expiry-issues">
              <i className="fas fa-check-circle"></i>
              <p>All your coupons are active!</p>
              <p>No expiration issues found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpirationTracker;