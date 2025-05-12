// In-memory storage for coupons
let coupons = [
  {
    id: '1',
    storeName: 'Amazon',
    category: 'Shopping',
    code: 'SAVE20',
    description: '20% off on all items',
    expiryDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  },
  {
    id: '2',
    storeName: 'Walmart',
    category: 'Shopping',
    code: 'FREESHIP',
    description: 'Free shipping on orders over $50',
    expiryDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  },
  {
    id: '3',
    storeName: 'Uber Eats',
    category: 'Food',
    code: 'EATS15',
    description: '$15 off your first order',
    expiryDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  },
];

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Get all coupons
export const getAllCoupons = () => {
  return [...coupons];
};

// Add a new coupon
export const addCoupon = (coupon) => {
  const newCoupon = {
    id: generateId(),
    ...coupon,
  };
  
  coupons = [...coupons, newCoupon];
  return newCoupon;
};

// Delete a coupon
export const deleteCoupon = (id) => {
  coupons = coupons.filter((coupon) => coupon.id !== id);
};

// Get unique categories
export const getCategories = () => {
  return [...new Set(coupons.map((coupon) => coupon.category))];
};

// Search coupons
export const searchCoupons = (searchTerm) => {
  return coupons.filter((coupon) => {
    const term = searchTerm.toLowerCase();
    return (
      coupon.storeName.toLowerCase().includes(term) ||
      coupon.code.toLowerCase().includes(term) ||
      coupon.category.toLowerCase().includes(term) ||
      (coupon.description && coupon.description.toLowerCase().includes(term))
    );
  });
};
