import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import CouponList from './components/CouponList';
import SearchBar from './components/SearchBar';
import AddCouponForm from './components/AddCouponForm';
import FloatingOverlay from './components/FloatingOverlay';
import { useCouponContext } from './context/CouponContext';

// Add this to console log when app initializes
console.log('CouponKeeper application initializing...');

function App() {
  const { coupons, searchCoupons } = useCouponContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFloatingOverlay, setShowFloatingOverlay] = useState(false);
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setSelectedCategory(null);
  };

  // Toggle floating overlay
  const toggleFloatingOverlay = () => {
    setShowFloatingOverlay(!showFloatingOverlay);
  };

  // Update filtered coupons when search term or selected category changes
  useEffect(() => {
    if (searchTerm) {
      const results = searchCoupons(searchTerm);
      setFilteredCoupons(results);
    } else if (selectedCategory) {
      setFilteredCoupons(coupons.filter(coupon => coupon.category === selectedCategory));
    } else {
      setFilteredCoupons(coupons);
    }
  }, [searchTerm, selectedCategory, coupons, searchCoupons]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        
        <div className="content-container">
          <CategoryList 
            onCategorySelect={handleCategorySelect} 
            selectedCategory={selectedCategory}
          />
          
          <CouponList 
            coupons={filteredCoupons} 
            title={selectedCategory || (searchTerm ? `Search: ${searchTerm}` : 'All Coupons')}
          />
        </div>
        
        {showAddForm && (
          <AddCouponForm onClose={() => setShowAddForm(false)} />
        )}
        
        <div className="action-buttons">
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            <i className="fas fa-plus"></i>
          </button>
          <button className="float-button" onClick={toggleFloatingOverlay}>
            <i className={`fas fa-external-link-alt ${showFloatingOverlay ? 'active' : ''}`}></i>
          </button>
        </div>
      </main>
      
      {showFloatingOverlay && (
        <FloatingOverlay 
          onClose={() => setShowFloatingOverlay(false)}
        />
      )}
    </div>
  );
}

export default App;
