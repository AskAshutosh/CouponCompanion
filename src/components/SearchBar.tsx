import { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
