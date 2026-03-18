import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Heart, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    // Stub auto-apply logic
    if (couponCode.toLowerCase() === 'save20') {
      setAppliedDiscount(total * 0.20);
    } else {
      setAppliedDiscount(10); // generic $10 off stub
      setCouponCode('AUTO10');
    }
  };

  const shippingCost = items.length > 0 && total < 50 ? 9.99 : 0;
  const tax = total * 0.08; // 8% mock tax
  const finalTotal = total + shippingCost + tax - appliedDiscount;

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 dark:bg-dark-card rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet. Discover great products and start shopping.</p>
        <Link to="/category/all" className="btn-primary px-8">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 pb-24">
      <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Items ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
              <button onClick={clearCart} className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">Clear Cart</button>
            </div>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 sm:gap-6 group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors line-clamp-2">
                        {item.title}
                      </Link>
                      <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                      {item.color !== 'Default' && <span>Color: {item.color}</span>}
                      {item.size !== 'Default' && <span>Size: {item.size}</span>}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg h-9 overflow-hidden">
                        <button 
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        >-</button>
                        <span className="w-8 h-full flex items-center justify-center font-medium text-sm text-gray-900 dark:text-white border-x border-gray-100 dark:border-dark-border">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        >+</button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-rose-500 transition-colors tooltip flex items-center gap-1 text-sm bg-gray-50 dark:bg-dark-bg px-2 py-1.5 rounded-md">
                          <Heart size={16} /> <span className="hidden sm:inline">Save for later</span>
                        </button>
                        <button 
                          className="text-gray-400 hover:text-rose-500 transition-colors tooltip flex items-center gap-1 text-sm bg-gray-50 dark:bg-dark-bg px-2 py-1.5 rounded-md"
                          onClick={() => removeItem(item.id, item.size, item.color)}
                        >
                          <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm sticky top-28">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            {/* Promo Code Input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Tag size={16} className="text-accent" /> Promo Code
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code" 
                  className="input-field py-2 text-sm uppercase"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="btn-secondary px-4 py-2 text-sm whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
              <button 
                onClick={() => handleApplyCoupon()}
                className="text-xs text-accent mt-2 hover:underline font-medium"
              >
                Auto-apply best coupon
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span>-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-border pt-4 mb-6">
              <div className="flex justify-between items-end mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">${finalTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 text-right">Including taxes & shipping</p>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary h-12 text-base flex items-center justify-center gap-2 shadow-lg mb-4"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/10 py-2 rounded-lg">
              <ShieldCheck size={16} /> Secure Checkout Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
