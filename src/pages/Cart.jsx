import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Heart, ArrowRight, ShieldCheck, Tag, ShoppingBag, Plus, Minus, Package, Truck, Star, Check } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';

const COUPONS = {
  'SAVE20': { type: 'percent', value: 20, label: '20% off' },
  'FIRST50': { type: 'flat', value: 50, label: '₹50 off' },
  'AG100': { type: 'flat', value: 100, label: '₹100 off' },
};

const CartItem = ({ item, onUpdate, onRemove, onSaveLater }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id, item.size, item.color), 300);
  };

  return (
    <div className={`flex gap-4 sm:gap-5 py-5 border-b border-gray-100 dark:border-dark-border last:border-0 transition-all duration-300 ${removing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Image */}
      <Link to={`/product/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
        <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-2" />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors line-clamp-2 text-sm leading-snug">
            {item.title}
          </Link>
          <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap text-sm">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex gap-3 mt-1 text-xs text-gray-400">
          {item.color !== 'Default' && <span>Color: <span className="text-gray-600 dark:text-gray-300">{item.color}</span></span>}
          {item.size !== 'Default' && <span>Size: <span className="text-gray-600 dark:text-gray-300">{item.size}</span></span>}
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty Stepper */}
          <div className="flex items-center gap-1 border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden bg-gray-50 dark:bg-dark-bg">
            <button onClick={() => onUpdate(item.id, item.size, item.color, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-dark-card transition-colors text-gray-600 dark:text-gray-300 active:scale-90">
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
            <button onClick={() => onUpdate(item.id, item.size, item.color, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-dark-card transition-colors text-gray-600 dark:text-gray-300 active:scale-90">
              <Plus size={14} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => onSaveLater(item)} className="text-xs text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10">
              <Heart size={13} /> <span className="hidden sm:inline">Wishlist</span>
            </button>
            <button onClick={handleRemove} className="text-xs text-gray-400 hover:text-error flex items-center gap-1 transition-colors px-2 py-1.5 rounded-lg hover:bg-error/5">
              <Trash2 size={13} /> <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const discount = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return total * (appliedCoupon.value / 100);
    return appliedCoupon.value;
  })();

  const shipping = total > 499 ? 0 : 49;
  const tax = total * 0.05; // 5% GST
  const finalTotal = total + shipping + tax - discount;
  const itemCount = (items || []).reduce((a, b) => a + b.quantity, 0);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(COUPONS[code]);
      setCouponError('');
      setCouponSuccess(`Coupon applied: ${COUPONS[code].label}`);
    } else {
      setCouponError('Invalid coupon code. Try SAVE20, FIRST50, or AG100');
      setCouponSuccess('');
    }
  };

  const handleSaveLater = (item) => {
    addToWishlist(item);
    removeItem(item.id, item.size, item.color);
  };

  if ((items || []).length === 0) {
    return (
      <div className="container-custom py-20 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in-up">
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-accent/10 rounded-full flex items-center justify-center animate-bounce-subtle">
            <ShoppingBag size={48} className="text-accent" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">0</div>
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 max-w-xs">Discover amazing products and add them to your cart to get started.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/category/all" className="btn-primary px-8">Shop Now</Link>
          <Link to="/wishlist" className="btn-secondary px-8">View Wishlist</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button onClick={clearCart} className="text-sm text-error hover:text-red-700 font-medium transition-colors hidden sm:block">
          Clear all
        </button>
      </div>

      {/* Free Shipping Banner */}
      {shipping > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2 mb-6 animate-fade-in">
          <Truck size={16} className="shrink-0" />
          Add <span className="font-bold">₹{(499 - total).toFixed(0)} more</span> to get FREE delivery!
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Cart Items */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-card p-6">
            {(items || []).map(item => (
              <CartItem
                key={`${item.id}-${item.size}-${item.color}`}
                item={item}
                onUpdate={updateQuantity}
                onRemove={removeItem}
                onSaveLater={handleSaveLater}
              />
            ))}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: <ShieldCheck size={16} />, text: 'Secure Payment' },
              { icon: <Truck size={16} />, text: 'Fast Delivery' },
              { icon: <Package size={16} />, text: 'Easy Returns' },
            ].map(({ icon, text }) => (
              <div key={text} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl p-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="text-accent">{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-card p-6 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <label className="label-text flex items-center gap-2"><Tag size={14} className="text-accent" /> Promo Code</label>
              <div className="flex gap-2">
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} placeholder="Enter code" className="input-field py-2.5 text-sm uppercase tracking-wider flex-1" />
                <button onClick={handleApplyCoupon} className="btn-secondary px-4 text-sm whitespace-nowrap">Apply</button>
              </div>
              {couponError && <p className="text-error text-xs mt-1.5 flex items-center gap-1"><span>✗</span> {couponError}</p>}
              {couponSuccess && <p className="text-success text-xs mt-1.5 flex items-center gap-1"><Check size={12} /> {couponSuccess}</p>}
              <div className="flex gap-2 mt-2 flex-wrap">
                {Object.entries(COUPONS).map(([code, val]) => (
                  <button key={code} onClick={() => { setCouponCode(code); }} className="text-[10px] px-2 py-1 bg-accent/10 text-accent rounded-md hover:bg-accent hover:text-white transition-all font-medium">
                    {code} · {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-3 text-sm mb-5">
              {[
                { label: `Subtotal (${itemCount} items)`, value: `₹${total.toLocaleString('en-IN')}` },
                { label: 'Shipping', value: shipping === 0 ? <span className="text-success font-semibold">FREE</span> : `₹${shipping}` },
                { label: 'GST (5%)', value: `₹${tax.toFixed(0)}` },
                discount > 0 && { label: `Discount (${appliedCoupon?.label})`, value: <span className="text-success">-₹{discount.toFixed(0)}</span> },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-dark-border pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  <div className="text-xs text-gray-400">incl. all taxes</div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="w-full btn-primary h-12 text-base flex items-center justify-center gap-2 shadow-glow animate-pulse-glow mb-3">
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/10 py-2.5 rounded-xl">
              <ShieldCheck size={14} /> 100% Secure · Encrypted Checkout
            </div>

            {/* Ratings */}
            <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="text-yellow-400" />)}
              <span className="ml-1">Rated 4.8 by 50,000+ shoppers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
