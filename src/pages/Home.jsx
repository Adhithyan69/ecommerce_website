import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Heart, ShoppingCart, Shield, RefreshCw } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';
import useCartStore from '../store/useCartStore';
import HeroAutoSlider from '../components/Home/HeroAutoSlider';
import CategoryGrid from '../components/Home/CategoryGrid';
import TopBrands from '../components/Home/TopBrands';

// Stub Data for Homepage
const MOCK_PRODUCTS = [
  {
    id: 'p1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 348.00,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: 1245,
    stock: 5,
    isNew: true,
  },
  {
    id: 'p2',
    title: 'Minimalist Artisan Ceramic Coffee Mug set of 4',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 89,
    stock: 24,
    isNew: false,
  },
  {
    id: 'p3',
    title: 'Ergonomic Mesh Office Chair with Lumbar Support',
    price: 189.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    reviews: 312,
    stock: 8,
    isNew: false,
  },
  {
    id: 'p4',
    title: 'Smart LED Light Strip 32.8ft with App Control',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    rating: 4.3,
    reviews: 4056,
    stock: 120,
    isNew: true,
  }
];

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3 text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
        <span className="block text-2xl font-bold font-display text-white">{timeLeft.days || '0'}</span>
        <span className="text-[10px] text-white/70 uppercase tracking-widest">Days</span>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
        <span className="block text-2xl font-bold font-display text-white">{timeLeft.hours || '0'}</span>
        <span className="text-[10px] text-white/70 uppercase tracking-widest">Hrs</span>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
        <span className="block text-2xl font-bold font-display text-white">{timeLeft.minutes || '0'}</span>
        <span className="text-[10px] text-white/70 uppercase tracking-widest">Mins</span>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 min-w-[60px]">
        <span className="block text-2xl font-bold font-display text-white">{timeLeft.seconds || '0'}</span>
        <span className="text-[10px] text-white/70 uppercase tracking-widest">Secs</span>
      </div>
    </div>
  );
};

const Home = () => {
  // Flash sale target (48 hours from now)
  const flashSaleTarget = new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString();

  return (
    <div className="pb-24">
      {/* Announcement Bar */}
      <div className="bg-accent text-white text-sm py-2 px-4 text-center font-medium">
        Free global shipping on orders over $50. Shop the Spring Sale now!
      </div>

      <HeroAutoSlider />
      <CategoryGrid />

      {/* Trust Badges */}
      <section className="border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card py-10">
        <div className="container-custom py-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <ShoppingCart size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Free Shipping</h4>
                <p className="text-sm text-gray-500">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h4>
                <p className="text-sm text-gray-500">100% encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Easy Returns</h4>
                <p className="text-sm text-gray-500">30 days policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">24/7 Support</h4>
                <p className="text-sm text-gray-500">Dedicated team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deal of the Day (Countdown) */}
      <section className="container-custom py-20">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-accent overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M45.7,-76.4C58.9,-69.3,69,-55,75.9,-40.4C82.8,-25.9,86.5,-11.1,84.9,3.2C83.3,17.4,76.4,31,67,42C57.6,53,45.8,61.4,32.6,68.2C19.3,75,4.7,80.1,-9.3,78.9C-23.4,77.7,-37,70.1,-50.2,61.5C-63.4,52.8,-76.3,43,-82.9,29.8C-89.6,16.5,-90.1,0,-86.6,-15.1C-83.1,-30.2,-75.6,-43.8,-64,-53C-52.4,-62.2,-36.8,-67,-22.4,-70.5C-8.1,-74.1,5,-76.4,20,-77C34.9,-77.6,45.7,-76.4,45.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 md:p-16 gap-10">
            <div className="max-w-xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-sm font-bold uppercase tracking-wider mb-6">Flash Sale</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Massive discounts on Smart Home Tech</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Upgrade your living space with our premium selection of automated devices. Up to 60% off for a limited time.
              </p>
              <CountdownTimer targetDate={flashSaleTarget} />
              <div className="mt-10">
                <Link to="/offers" className="btn bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold">
                  Claim Deals Now
                </Link>
              </div>
            </div>
            
            <div className="w-full max-w-sm hidden md:block">
              {/* Feature Product Inside Banner */}
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={MOCK_PRODUCTS[3].image} alt="Deal" className="w-full h-auto rounded-xl shadow-lg mb-4 mix-blend-multiply bg-white" />
                <h3 className="text-white font-bold text-lg mb-2 truncate">{MOCK_PRODUCTS[3].title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-white text-2xl font-bold">${MOCK_PRODUCTS[3].price}</span>
                  <span className="text-white/60 line-through text-sm">$49.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended For You */}
      <section className="container-custom py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Handpicked For You</p>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Recommended Products</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Personalized picks based on your browsing history.</p>
          </div>
          <Link to="/category/all" className="hidden sm:flex items-center gap-2 text-sm text-accent font-semibold hover:gap-3 transition-all group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container-custom py-14">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Browse</p>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { to: '/category/fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800', label: 'Fashion Apparel', sub: 'New season drops' },
            { to: '/category/electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800', label: 'Tech & Gadgets', sub: 'Latest innovations' },
            { to: '/category/home', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=800', label: 'Home Living', sub: 'Modern essentials' },
          ].map(({ to, img, label, sub }) => (
            <Link key={to} to={to} className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-100/50 dark:border-dark-border">
              <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{label}</h3>
                    <p className="text-sm text-gray-300">{sub}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
