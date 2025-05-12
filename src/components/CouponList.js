import React from 'react';
import CouponItem from './CouponItem';

const CouponList = ({ coupons, title }) => {
  return (
    <div className="coupon-list">
      <h2>{title}</h2>
      
      {coupons.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-ticket-alt"></i>
          <p>No coupons found</p>
          {title === 'All Coupons' && (
            <p>Add your first coupon by clicking the + button</p>
          )}
        </div>
      ) : (
        coupons.map((coupon) => (
          <CouponItem key={coupon.id} coupon={coupon} />
        ))
      )}
    </div>
  );
};

export default CouponList;
