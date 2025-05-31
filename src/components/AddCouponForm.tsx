import React, { useState } from 'react';
import { useCouponContext } from '../context/CouponContext';

interface AddCouponFormProps {
  onClose: () => void;
}

const AddCouponForm: React.FC<AddCouponFormProps> = ({ onClose }) => {
  const { addCoupon, getCategories } = useCouponContext();
  const existingCategories = getCategories();
  
  const [formData, setFormData] = useState({
    storeName: '',
    category: existingCategories.length > 0 ? existingCategories[0] : '',
    code: '',
    description: '',
    expiryDate: '',
    newCategory: '',
  });
  
  const [useNewCategory, setUseNewCategory] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.storeName.trim()) {
      alert('Please enter a store name');
      return;
    }
    
    if (!formData.code.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    
    const categoryToUse = useNewCategory 
      ? formData.newCategory.trim() 
      : formData.category;
      
    if (!categoryToUse) {
      alert('Please select or create a category');
      return;
    }
    
    // Add the coupon
    addCoupon({
      storeName: formData.storeName.trim(),
      category: categoryToUse,
      code: formData.code.trim(),
      description: formData.description.trim(),
      expiryDate: formData.expiryDate || undefined,
    });
    
    onClose();
  };
  
  return (
    <div className="add-form-overlay">
      <div className="add-form">
        <h2>Add New Coupon</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="e.g. Amazon, Walmart"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="code">Coupon Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SAVE20"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            {existingCategories.length > 0 && !useNewCategory ? (
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {existingCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id="newCategory"
                name="newCategory"
                value={formData.newCategory}
                onChange={handleChange}
                placeholder="e.g. Clothing, Electronics"
                required={useNewCategory}
              />
            )}
            
            {existingCategories.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="checkbox"
                  id="useNewCategory"
                  checked={useNewCategory}
                  onChange={() => setUseNewCategory(!useNewCategory)}
                />
                <label htmlFor="useNewCategory" style={{ display: 'inline', marginLeft: '5px' }}>
                  Create new category
                </label>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. 20% off on all items"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date (optional)</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponForm;
