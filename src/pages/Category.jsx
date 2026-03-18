import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, Grid3X3, List as ListIcon, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';

// Reusing MOCK_PRODUCTS from Home for demo, expanding slightly
const generateMockProducts = (category, count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${category}-${i}`,
    title: `Premium Dropshipped ${category} Item #${i + 1}`,
    price: Math.floor(Math.random() * 200) + 20,
    originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 100 : null,
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 10000}?auto=format&fit=crop&q=80&w=400`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 1000) + 10,
    stock: Math.floor(Math.random() * 50),
    isNew: Math.random() > 0.8,
    color: Math.random() > 0.5 ? 'Black' : 'White',
  }));
};

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' }
];

const Category = () => {
  const { categoryId } = useParams();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Filters State
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Generate some products based on route
  const products = useMemo(() => generateMockProducts(categoryId, 24), [categoryId]);

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedColors([]);
    setShowInStockOnly(false);
  };

  return (
    <div className="container-custom py-8 pb-24">
      {/* Header and Breadcrumbs */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="capitalize text-gray-900 dark:text-white font-medium">{categoryId}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white capitalize mb-2">{categoryId}</h1>
            <p className="text-gray-500">{products.length} products available</p>
          </div>
          
          {/* Controls Bar */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden btn-secondary flex items-center gap-2"
            >
              <Filter size={18} /> Filters
            </button>
            
            <div className="relative group hidden md:block">
              <button className="btn-secondary h-10 px-4 flex items-center gap-2 rounded-lg">
                Sort by: {SORT_OPTIONS.find(o => o.value === sortBy)?.label} <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {SORT_OPTIONS.map(opt => (
                  <button 
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-bg first:rounded-t-lg last:rounded-b-lg ${sortBy === opt.value ? 'font-medium text-accent' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Grid3X3 size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Overlay */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsFilterOpen(false)} />
        )}

        {/* Sidebar Filters */}
        <aside className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-dark-card shadow-2xl z-50 transform transition-transform duration-300 md:relative md:w-64 md:translate-x-0 md:bg-transparent md:dark:bg-transparent md:shadow-none md:z-0 flex flex-col h-full md:h-auto overflow-hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          <div className="p-5 border-b border-gray-100 dark:border-dark-border md:hidden flex items-center justify-between shrink-0">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><SlidersHorizontal size={18}/> Filters</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
          </div>

          <div className="p-5 md:p-0 flex-1 overflow-y-auto space-y-8 no-scrollbar">
            {/* Active Filters Summary (If any) */}
            {(selectedColors.length > 0 || showInStockOnly) && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Active Filters</h4>
                  <button onClick={clearFilters} className="text-xs text-accent hover:underline font-medium">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {showInStockOnly && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-dark-bg text-xs px-2 py-1 rounded">In Stock <button onClick={() => setShowInStockOnly(false)}><X size={12}/></button></span>
                  )}
                  {selectedColors.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-dark-bg text-xs px-2 py-1 rounded">{c} <button onClick={() => toggleColor(c)}><X size={12}/></button></span>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h4>
              <div className="flex items-center gap-3 mb-4">
                <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="input-field py-1.5 text-sm" placeholder="Min" />
                <span className="text-gray-400">-</span>
                <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="input-field py-1.5 text-sm" placeholder="Max" />
              </div>
              <input type="range" min="0" max="1000" className="w-full accent-accent" />
            </div>

            <div className="h-px bg-gray-200 dark:bg-dark-border"></div>

            {/* Colors Filter */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Colors</h4>
              <div className="space-y-3">
                {['Black', 'White', 'Blue', 'Red', 'Green'].map(color => (
                  <label key={color} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent cursor-pointer"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                    />
                    <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      <span className={`w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700 bg-${color.toLowerCase()}-500`} style={{backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : ''}}></span>
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-dark-border"></div>

            {/* Availability Filter */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Availability</h4>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent cursor-pointer"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">In Stock only</span>
              </label>
            </div>
            
          </div>

          <div className="p-5 border-t border-gray-100 dark:border-dark-border md:hidden shrink-0">
             <button onClick={() => setIsFilterOpen(false)} className="btn-primary w-full py-2.5">Show Products</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "grid grid-cols-1 gap-6"
          }>
            {products.map((product) => (
              <div key={product.id} className={viewMode === 'list' ? 'h-48' : ''}>
                {/* For List view, ProductCard would ideally have a prop or we'd map a ListCard here, using ProductCard for now */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination Stub */}
          <div className="mt-12 flex justify-center">
            <button className="btn-outline px-8 py-3 w-full sm:w-auto font-medium">Load More Products</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Category;
