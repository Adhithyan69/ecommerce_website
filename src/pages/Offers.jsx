import React, { useState } from 'react';
import { Tag, Copy, CheckCircle2, Gift, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const OFFERS = [
  { id: 1, type: 'Flash Sale', title: 'Summer Tech Blowout', desc: 'Up to 60% off select gaming accessories and smart home devices.', code: null, expires: 'Ends in 48 hours', bg: 'bg-gradient-to-br from-purple-600 to-blue-600' },
  { id: 2, type: 'Coupon', title: '20% Off Your Entire Order', desc: 'Use this promo code at checkout on any order over $100.', code: 'SAVE20', expires: 'Valid until May 30', bg: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
  { id: 3, type: 'BOGO', title: 'Buy 1 Get 1 Free', desc: 'On all minimalist ceramic mugs and selected home decor.', code: null, expires: 'While supplies last', bg: 'bg-gradient-to-br from-rose-500 to-orange-500' },
  { id: 4, type: 'Free Shipping', title: 'Free Express Shipping', desc: 'Automatically applied at checkout for all orders over $50.', code: null, expires: 'Always active', bg: 'bg-gradient-to-br from-gray-800 to-gray-900' }
];

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container-custom py-12 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 mb-6">
          <Gift size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">Exclusive Offers</h1>
        <p className="text-lg text-gray-500">Discover handpicked deals, flash sales, and special promotional coupons just for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {OFFERS.map((offer) => (
          <div key={offer.id} className={`${offer.bg} rounded-3xl overflow-hidden shadow-xl relative text-white group hover:scale-[1.02] transition-transform duration-300`}>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="currentColor"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>

            <div className="relative p-8 md:p-10 h-full flex flex-col items-start">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-1.5">
                {offer.type === 'Flash Sale' && <Sparkles size={14} />}
                {offer.type}
              </span>
              
              <h2 className="text-3xl font-display font-bold mb-3">{offer.title}</h2>
              <p className="text-white/80 leading-relaxed mb-8 max-w-sm">{offer.desc}</p>
              
              <div className="mt-auto w-full flex items-end justify-between gap-4">
                <div>
                  {offer.code ? (
                    <div className="mb-2">
                       <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-semibold">Promo Code</p>
                       <button 
                         onClick={() => copyToClipboard(offer.code)}
                         className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl transition-colors select-all border border-white/20"
                       >
                         <span className="font-mono font-bold text-lg tracking-widest">{offer.code}</span>
                         {copiedCode === offer.code ? <CheckCircle2 size={18} className="text-emerald-300" /> : <Copy size={18} className="opacity-80" />}
                       </button>
                    </div>
                  ) : (
                    <Link to="/category/all" className="inline-block bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                      Shop Now
                    </Link>
                  )}
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 text-sm text-white/70 bg-black/20 px-3 py-1.5 rounded-full font-medium">
                    <Clock size={14} /> <span>{offer.expires}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
