import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for coupons..."
        value={searchTerm}
        onChange={handleChange}
      />
      <i className="fas fa-search search-icon"></i>
    </div>
  );
};

export default SearchBar;
