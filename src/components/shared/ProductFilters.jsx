import React from 'react';
import { X, Star, Check } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty'];
const BRANDS = ['TechVision', 'Sony', 'Apple', 'Samsung', 'Nike', 'Adidas'];

const ProductFilters = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedRatings,
  setSelectedRatings,
  selectedBrands,
  setSelectedBrands,
  clearFilters,
}) => {
  
  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedRatings.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="space-y-8 no-scrollbar">
      
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Active Filters</h4>
            <button onClick={clearFilters} className="text-xs text-accent hover:underline font-medium">Clear All</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(c => (
              <span key={c} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-dark-bg text-xs px-2 py-1 rounded">{c} <button onClick={() => toggleArrayItem(c, selectedCategories, setSelectedCategories)}><X size={12}/></button></span>
            ))}
            {selectedBrands.map(b => (
              <span key={b} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-dark-bg text-xs px-2 py-1 rounded">{b} <button onClick={() => toggleArrayItem(b, selectedBrands, setSelectedBrands)}><X size={12}/></button></span>
            ))}
            {selectedRatings.map(r => (
              <span key={r} className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 text-xs px-2 py-1 rounded">{r} Stars <button onClick={() => toggleArrayItem(r, selectedRatings, setSelectedRatings)}><X size={12}/></button></span>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Category</h4>
        <div className="space-y-3">
          {CATEGORIES.map(category => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(category) ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card group-hover:border-accent'}`}>
                {selectedCategories.includes(category) && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-dark-border"></div>

      {/* Price Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h4>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="w-full pl-6 pr-2 py-1.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Min" />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="w-full pl-6 pr-2 py-1.5 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Max" />
          </div>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          className="w-full accent-accent h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>$0</span>
          <span>$1000+</span>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-dark-border"></div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Brands</h4>
        <div className="space-y-3">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-accent border-accent text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card group-hover:border-accent'}`}>
                {selectedBrands.includes(brand) && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-dark-border"></div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Rating</h4>
        <div className="space-y-3">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="rating_filter"
                className="w-4 h-4 text-accent focus:ring-accent"
                checked={selectedRatings.includes(rating)}
                onChange={() => setSelectedRatings([rating])} // Simplified to single select for stars
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                   <Star key={star} size={14} className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductFilters;
