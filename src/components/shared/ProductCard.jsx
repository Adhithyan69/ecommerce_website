import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Plus } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      color: product.color || 'Default',
      size: 'Default',
    });
  };

  return (
    <div className="group relative bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-2 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg shadow-accent/20">
            New
          </span>
        )}
        {product.originalPrice && (
          <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg shadow-rose-500/20">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-rose-500 hover:bg-white dark:hover:bg-dark-bg transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
        <Heart size={16} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-50 dark:bg-dark-bg overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-6 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full shadow-xl shadow-accent/20 flex items-center justify-center gap-2 py-2.5 text-sm"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1">{product.brand || 'Anti-Gravity'}</div>
        <Link to={`/product/${product.id}`} className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-accent transition-colors flex-1">
          {product.title}
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300 dark:text-gray-600"} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <button onClick={handleAddToCart} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-border text-gray-900 dark:text-white flex items-center justify-center hover:bg-accent hover:text-white transition-colors lg:hidden">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;