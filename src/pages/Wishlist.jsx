import React, { useState } from 'react';
import { Heart, Share2, Copy, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/shared/ProductCard';

const MOCK_WISHLIST = [
  { id: 'w1', title: 'Ergonomic Mesh Office Chair', price: 299.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400', rating: '4.7', reviews: 128, stock: 15, isNew: false },
  { id: 'w2', title: 'Noise Cancelling Earbuds', price: 149.99, originalPrice: 199.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400', rating: '4.9', reviews: 842, stock: 5, isNew: true }
];

const Wishlist = () => {
  const [items, setItems] = useState(MOCK_WISHLIST);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText('https://antigravity.shop/wishlist/share/U8X92M');
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleRemove = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-24 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} />
        </div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Tap the heart icon on any product to save it here for later.</p>
        <Link to="/category/all" className="btn-primary px-8">Discover Favorites</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 pb-24">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-100 dark:border-dark-border">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
            <Heart size={32} className="text-rose-500 fill-rose-500" /> My Wishlist
          </h1>
          <p className="text-gray-500">{items.length} items saved</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare}
            className="btn-outline h-10 px-5 flex items-center gap-2"
          >
            {linkCopied ? <><CheckCircle2 size={18} className="text-emerald-500"/> Copied!</> : <><Share2 size={18} /> Share List</>}
          </button>
          <button className="btn-primary h-10 px-5 flex items-center gap-2">
            <ShoppingCart size={18} /> Add All to Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(product => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <button 
              onClick={() => handleRemove(product.id)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white dark:bg-dark-card rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-md opacity-0 group-hover:opacity-100 transition-all"
              title="Remove from wishlist"
            >
              <Heart size={16} className="fill-current" />
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Wishlist;
