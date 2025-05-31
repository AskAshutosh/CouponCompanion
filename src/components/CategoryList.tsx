import { useCouponContext } from '../context/CouponContext';

interface CategoryListProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect, selectedCategory }) => {
  const { getCategories } = useCouponContext();
  const categories = getCategories();

  return (
    <div className="category-list">
      <div 
        className={`category-item ${selectedCategory === null ? 'selected' : ''}`}
        onClick={() => onCategorySelect(null)}
      >
        All
      </div>
      
      {categories.map((category) => (
        <div
          key={category}
          className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
