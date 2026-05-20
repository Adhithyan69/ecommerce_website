import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Plus, Check } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [addedToCart, setAddedToCart] = useState(false);

  const inWishlist = isInWishlist(product.id);

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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        stock: product.stock,
        isNew: product.isNew,
        brand: product.brand,
      });
    }
  };

  return (
    <div className="group relative bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg shadow-accent/20">New</span>
        )}
        {product.originalPrice && (
          <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg shadow-rose-500/20">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-sm duration-300 ${
          inWishlist
            ? 'bg-rose-500 text-white opacity-100 scale-100'
            : 'bg-white/80 dark:bg-black/50 text-gray-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hover:text-rose-500 hover:bg-white dark:hover:bg-dark-bg'
        }`}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart size={15} fill={inWishlist ? 'white' : 'none'} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-50 dark:bg-dark-bg overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-xl ${
              addedToCart ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-accent text-white hover:bg-accent-hover shadow-accent/30'
            }`}
          >
            {addedToCart ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium uppercase tracking-wide">{product.brand || 'Anti-Gravity'}</div>
        <Link to={`/product/${product.id}`} className="font-semibold text-gray-900 dark:text-white mb-2.5 line-clamp-2 hover:text-accent transition-colors flex-1 leading-snug text-sm">
          {product.title}
        </Link>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300 dark:text-gray-600"} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-base text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
