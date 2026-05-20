import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star, Package } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';

const WishlistCard = ({ item, onRemove, onMoveToCart }) => {
  const [moving, setMoving] = useState(false);

  const handleMoveToCart = () => {
    setMoving(true);
    setTimeout(() => {
      onMoveToCart(item);
      onRemove(item.id);
    }, 400);
  };

  return (
    <div className={`group bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col ${moving ? 'opacity-0 scale-90' : ''}`}>
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 dark:bg-dark-bg overflow-hidden">
        <Link to={`/product/${item.id}`}>
          <img src={item.image} alt={item.title} className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110" />
        </Link>
        {item.originalPrice && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-md">
            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
          </span>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm text-gray-400 hover:text-error hover:bg-red-50 dark:hover:bg-dark-bg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.brand || 'Anti-Gravity'}</p>
        <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors line-clamp-2 mb-2 flex-1 leading-snug">
          {item.title}
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} fill={i < Math.floor(item.rating || 0) ? 'currentColor' : 'none'} className={i < Math.floor(item.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
          ))}
          <span className="text-xs text-gray-400 ml-0.5">({item.reviews || 0})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-900 dark:text-white">₹{item.price?.toLocaleString('en-IN')}</span>
            {item.originalPrice && <span className="text-xs text-gray-400 line-through ml-2">₹{item.originalPrice?.toLocaleString('en-IN')}</span>}
          </div>
          {item.stock > 0 ? (
            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">In Stock</span>
          ) : (
            <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">Out of Stock</span>
          )}
        </div>

        <button
          onClick={handleMoveToCart}
          disabled={!item.stock}
          className="btn-primary w-full h-10 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {moving ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const safeItems = items || [];

  const handleMoveToCart = (item) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
      color: 'Default',
      size: 'Default',
    });
  };

  const handleClearAll = () => {
    safeItems.forEach(item => removeFromWishlist(item.id));
  };

  if (safeItems.length === 0) {
    return (
      <div className="container-custom py-20 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in-up">
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center animate-bounce-subtle">
            <Heart size={48} className="text-rose-400" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 max-w-xs">
          Save items you love by clicking the ❤️ heart on any product card.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/category/all" className="btn-primary px-8">Explore Products</Link>
          <Link to="/cart" className="btn-secondary px-8 flex items-center gap-2"><ShoppingCart size={16} /> Go to Cart</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Heart size={28} className="text-rose-500" fill="currentColor" />
            My Wishlist
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{safeItems.length} saved {safeItems.length === 1 ? 'item' : 'items'}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => safeItems.forEach(item => handleMoveToCart(item) || removeFromWishlist(item.id))}
            className="btn-primary text-sm flex items-center gap-2 h-10 hidden sm:flex"
          >
            <ShoppingCart size={15} /> Move All to Cart
          </button>
          <button onClick={handleClearAll} className="btn-secondary text-sm h-10 text-error border-error/30 hover:bg-error/5">
            Clear All
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {safeItems.map(item => (
          <WishlistCard
            key={item.id}
            item={item}
            onRemove={removeFromWishlist}
            onMoveToCart={handleMoveToCart}
          />
        ))}
      </div>

      {/* Continue shopping */}
      <div className="mt-10 text-center">
        <Link to="/category/all" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all group">
          Continue Shopping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
