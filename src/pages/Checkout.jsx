import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

// Reusing MOCK_ADDRESSES from Dashboard
const MOCK_ADDRESSES = [
  { id: 1, label: 'Home', name: 'John Doe', street: '123 Fake Street', city: 'San Francisco', state: 'CA', zip: '94105', isDefault: true },
  { id: 2, label: 'Work', name: 'John Doe', street: '456 Tech Ave Suite 100', city: 'San Francisco', state: 'CA', zip: '94107', isDefault: false },
];

const Checkout = () => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'afterpay'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const shippingCost = items.length > 0 && total < 50 ? 9.99 : 0;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API call to payment gateway
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      // We don't clear cart immediately here so the animation finishes smoothly,
      // but in a real app we'd clear it and redirect to an order success page.
    }, 2000);
  };

  const finishCheckout = () => {
    clearCart();
    navigate('/user/dashboard');
  };

  if (items.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="container-custom py-24 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">Order #AG-{(Math.random()*1000000).toFixed(0)}</p>
        <p className="text-gray-500 mb-10 max-w-md">
          Thank you for your purchase. We have sent an order confirmation with details to {user?.email || 'your email'}.
        </p>
        <div className="flex gap-4">
          <button onClick={finishCheckout} className="btn-primary px-8">View Order Tracker</button>
          <button onClick={() => { clearCart(); navigate('/'); }} className="btn-secondary px-8">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen py-8 pb-24">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Checkout Flow: Addresses & Payment */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* 1. Contact Info */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm">1</span> 
                  Contact Information
                </h2>
                {user ? (
                   <span className="text-sm font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16}/> Logged In</span>
                ) : (
                   <span className="text-sm text-gray-500">Guest Checkout</span>
                )}
              </div>
              <div className="pl-11">
                <input type="email" readOnly={!!user} defaultValue={user?.email || ''} placeholder="Email for order confirmation" className="input-field max-w-md" />
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm">2</span> 
                Shipping Address
              </h2>
              <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ADDRESSES.map((addr) => (
                  <label 
                    key={addr.id} 
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <input 
                      type="radio" 
                      name="address" 
                      className="absolute top-5 right-5 w-5 h-5 accent-accent"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{addr.label}</h3>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-gray-300 font-medium">{addr.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                  </label>
                ))}
              </div>
              <div className="pl-11 mt-4">
                 <button className="text-sm font-medium text-accent hover:underline">+ Add New Address</button>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm">3</span> 
                Payment Method
              </h2>
              
              <div className="pl-11 space-y-4">
                {/* Credit Card Option */}
                <div className={`border-2 rounded-xl overflow-hidden transition-all ${paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-dark-border'}`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-5 h-5 accent-accent mr-4"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={24} className="text-gray-400 mr-3" />
                    <span className="font-semibold text-gray-900 dark:text-white flex-1">Credit / Debit Card</span>
                    <div className="flex gap-1 hidden sm:flex">
                      <div className="w-8 h-5 bg-blue-600 rounded"></div>
                      <div className="w-8 h-5 bg-rose-500 rounded"></div>
                      <div className="w-8 h-5 bg-orange-400 rounded"></div>
                    </div>
                  </label>
                  
                  {/* Card Form Stub */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 pt-0 border-t border-gray-100 dark:border-dark-border mt-2 animate-slide-down">
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="label-text">Card Number</label>
                          <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="input-field pl-10 font-mono" />
                            <CreditCard size={18} className="absolute left-3 top-3 text-gray-400" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label-text">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="input-field font-mono" />
                          </div>
                          <div>
                            <label className="label-text">CVC</label>
                            <div className="relative">
                              <input type="text" placeholder="123" className="input-field pr-10 font-mono" />
                              <Lock size={16} className="absolute right-3 top-3.5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal Option */}
                <div className={`border-2 rounded-xl overflow-hidden transition-all ${paymentMethod === 'paypal' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-dark-border'}`}>
                  <label className="flex items-center p-4 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-5 h-5 accent-accent mr-4"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                    <span className="font-semibold text-gray-900 dark:text-white text-xl italic text-blue-800 dark:text-blue-400">PayPal</span>
                  </label>
                  {paymentMethod === 'paypal' && (
                    <div className="p-4 pt-0 text-gray-500 text-sm">
                      You will be redirected to PayPal to securely complete your purchase.
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Sidebar: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-lg sticky top-28">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              {/* Mini Cart Items List */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto no-scrollbar pb-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">{item.title}</h4>
                      <div className="mt-1 flex justify-between items-center w-full">
                        <p className="text-xs text-gray-500">{item.color} | {item.size}</p>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-dark-border pt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-black/10 dark:border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">Total</span>
                  <span className="text-3xl font-display font-bold text-accent">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2 shadow-xl shadow-accent/20 transition-all hover:-translate-y-1"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto animate-spin"></div>
                ) : (
                  <>Place Order <ShieldCheck size={20} /></>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                By placing your order, you agree to Anti-Gravity's <a href="#" className="underline hover:text-gray-800">Privacy Notice</a> and <a href="#" className="underline hover:text-gray-800">Conditions of Use</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
