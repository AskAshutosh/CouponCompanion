import React, { useState, useRef, useEffect } from 'react';
import { useCouponContext } from '../context/CouponContext';
import { copyToClipboard } from '../services/ClipboardService';
import { Coupon } from '../types';

interface FloatingOverlayProps {
  onClose: () => void;
}

const FloatingOverlay: React.FC<FloatingOverlayProps> = ({ onClose }) => {
  const { coupons } = useCouponContext();
  const [position, setPosition] = useState({ x: window.innerWidth - 230, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [currentStore, setCurrentStore] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - (overlayRef.current?.offsetWidth || 220);
      const maxY = window.innerHeight - (overlayRef.current?.offsetHeight || 300);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  // Simulate detecting current store (in a real app, this would get the current app/website)
  useEffect(() => {
    // Demo: randomly pick a store from the available coupons
    const storeNames = [...new Set(coupons.map(coupon => coupon.storeName))];
    if (storeNames.length > 0) {
      setCurrentStore(storeNames[Math.floor(Math.random() * storeNames.length)]);
    }
  }, [coupons]);
  
  // Filter coupons for the current store
  useEffect(() => {
    if (currentStore) {
      setFilteredCoupons(coupons.filter(coupon => 
        coupon.storeName.toLowerCase() === currentStore.toLowerCase()
      ));
    } else {
      setFilteredCoupons([]);
    }
  }, [currentStore, coupons]);
  
  const handleCopyClick = (code: string) => {
    copyToClipboard(code);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  
  return (
    <>
      <div 
        ref={overlayRef}
        className="floating-overlay"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
      >
        <div 
          className="overlay-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <span className="title">
            {currentStore ? `${currentStore} Coupons` : 'Available Coupons'}
          </span>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="overlay-content">
          {filteredCoupons.length === 0 ? (
            <div className="no-coupons">
              {currentStore ? `No coupons for ${currentStore}` : 'No coupons available'}
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="overlay-coupon-item">
                <div className="overlay-store-name">{coupon.description || 'Discount'}</div>
                <div className="overlay-coupon-code">
                  <span>{coupon.code}</span>
                  <button className="copy-btn" onClick={() => handleCopyClick(coupon.code)}>
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {showToast && (
        <div className="toast-notification">
          Copied to clipboard!
        </div>
      )}
    </>
  );
};

export default FloatingOverlay;
