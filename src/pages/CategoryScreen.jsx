import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/Product/ProductCard';
import { ChevronDown, Filter, X, ArrowLeft } from 'lucide-react';

// Mock data - replace with your actual data fetching
const allProducts = [
  { id: 1, name: 'Classic Tee', price: 25, category: 'T-Shirts', color: 'Black', size: 'M', imageUrl: 'https://via.placeholder.com/300x300.png?text=Classic+Tee' },
  { id: 2, name: 'Denim Jeans', price: 75, category: 'Jeans', color: 'Blue', size: 'L', imageUrl: 'https://via.placeholder.com/300x300.png?text=Denim+Jeans' },
  { id: 3, name: 'Summer Dress', price: 120, category: 'Dresses', color: 'Red', size: 'S', imageUrl: 'https://via.placeholder.com/300x300.png?text=Summer+Dress' },
  { id: 4, name: 'V-Neck Sweater', price: 60, category: 'Sweaters', color: 'Gray', size: 'M', imageUrl: 'https://via.placeholder.com/300x300.png?text=V-Neck+Sweater' },
  { id: 5, name: 'White Sneakers', price: 90, category: 'Shoes', color: 'White', size: '10', imageUrl: 'https://via.placeholder.com/300x300.png?text=White+Sneakers' },
  { id: 6, name: 'Graphic T-Shirt', price: 30, category: 'T-Shirts', color: 'White', size: 'L', imageUrl: 'https://via.placeholder.com/300x300.png?text=Graphic+T-Shirt' },
  { id: 7, name: 'Chino Shorts', price: 45, category: 'Shorts', color: 'Beige', size: '32', imageUrl: 'https://via.placeholder.com/300x300.png?text=Chino+Shorts' },
  { id: 8, name: 'Red Hoodie', price: 80, category: 'Hoodies', color: 'Red', size: 'XL', imageUrl: 'https://via.placeholder.com/300x300.png?text=Red+Hoodie' },
];

const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="py-4 border-b border-gray-200">
      <h3
        className="font-semibold mb-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </h3>
      {isOpen && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

const ColorFilter = ({ selectedColors, onColorChange }) => {
  const colors = ['Black', 'White', 'Blue', 'Red', 'Gray', 'Beige'];
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color) ? 'border-blue-500' : 'border-transparent'}`}
          style={{ backgroundColor: color.toLowerCase() }}
          title={color}
        />
      ))}
    </div>
  );
};

const SizeFilter = ({ selectedSizes, onSizeChange }) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={`px-3 py-1 border rounded-md ${selectedSizes.includes(size) ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

const CategoryScreen = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Effect to handle clicks outside the filter drawer on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);


  const handleColorChange = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const categoryMatch = categoryName ? product.category.toLowerCase() === categoryName.toLowerCase() : true;
      const priceMatch = product.price <= priceRange;
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(product.size);
      return categoryMatch && priceMatch && colorMatch && sizeMatch;
    });
  }, [categoryName, priceRange, selectedColors, selectedSizes]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Backdrop for mobile filter */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside 
          ref={filterRef}
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:relative md:w-1/4 lg:w-1/5 md:transform-none md:shadow-none md:bg-transparent md:h-auto ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="md:hidden">
                <X size={24} />
              </button>
            </div>
            
            {/* Price Filter */}
            <FilterSection title="Price">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${priceRange}</span>
              </div>
            </FilterSection>

            {/* Color Filter */}
            <FilterSection title="Color">
              <ColorFilter 
                selectedColors={selectedColors}
                onColorChange={handleColorChange}
              />
            </FilterSection>

            {/* Size Filter */}
            <FilterSection title="Size">
              <SizeFilter 
                selectedSizes={selectedSizes}
                onSizeChange={handleSizeChange}
              />
            </FilterSection>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold">{categoryName || 'All Products'}</h1>
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="md:hidden flex items-center gap-2 border rounded-md px-3 py-1">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product}/>
              ))}
            </div>
          ) : (
            <p>No products found matching your criteria.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryScreen;