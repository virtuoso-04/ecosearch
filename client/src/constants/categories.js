// HACKATHON MOD: Constants file for product categories and conditions
// - Centralized category and condition data for consistency across app
// - Used in create/edit forms and filtering

export const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
  { value: 'home_garden', label: 'Home & Garden' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'health_beauty', label: 'Health & Beauty' },
  { value: 'toys_games', label: 'Toys & Games' },
  { value: 'other', label: 'Other' }
];

export const CONDITIONS = [
  { 
    value: 'new', 
    label: 'New', 
    description: 'Never used, in original packaging',
    color: 'bg-green-100 text-green-800'
  },
  { 
    value: 'like_new', 
    label: 'Like New', 
    description: 'Used once or twice, excellent condition',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    value: 'good', 
    label: 'Good', 
    description: 'Some signs of use but functions perfectly',
    color: 'bg-yellow-100 text-yellow-800'
  },
  { 
    value: 'fair', 
    label: 'Fair', 
    description: 'Shows wear but still functional',
    color: 'bg-orange-100 text-orange-800'
  },
  { 
    value: 'poor', 
    label: 'Poor', 
    description: 'Heavy wear, may need repair',
    color: 'bg-red-100 text-red-800'
  }
];

export const MAX_IMAGES = 5;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const getConditionColor = (condition) => {
  const conditionObj = CONDITIONS.find(c => c.value === condition);
  return conditionObj ? conditionObj.color : 'bg-gray-100 text-gray-800';
};

export const getCategoryLabel = (categoryValue) => {
  const category = CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};
