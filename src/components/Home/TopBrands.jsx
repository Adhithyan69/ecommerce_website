import React from 'react';

const BRANDS = [
  'Samsung', 'Apple', 'Sony', 'Nike', 'Adidas', 'Logitech', 'Asus', 'Dell'
];

const TopBrands = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-bg border-y border-gray-100 dark:border-dark-border overflow-hidden">
      <div className="container-custom">
        <h2 className="text-2xl font-display font-bold text-center text-gray-900 dark:text-white mb-10">Trusted Premium Brands</h2>
        
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 md:gap-24">
            {BRANDS.map((brand, i) => (
              <span key={`first-${i}`} className="text-2xl md:text-4xl font-display font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest hover:text-accent dark:hover:text-accent transition-colors cursor-default">
                {brand}
              </span>
            ))}
            {/* Duplicate for infinite effect */}
            {BRANDS.map((brand, i) => (
              <span key={`second-${i}`} className="text-2xl md:text-4xl font-display font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest hover:text-accent dark:hover:text-accent transition-colors cursor-default">
                {brand}
              </span>
            ))}
            {BRANDS.map((brand, i) => (
              <span key={`third-${i}`} className="text-2xl md:text-4xl font-display font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest hover:text-accent dark:hover:text-accent transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
