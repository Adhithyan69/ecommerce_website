import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, ChevronRight, ChevronDown, PlayCircle, Share2, AlertCircle } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const MOCK_PRODUCT = {
  id: 'master-1',
  title: 'Ultra-Wide Curved Gaming Monitor 34" WQHD',
  price: 649.99,
  originalPrice: 799.99,
  rating: 4.8,
  reviews: 428,
  stock: 6,
  brand: 'TechVision',
  description: 'Immerse yourself completely in every game with a 1000R curvature and 165Hz refresh rate. Features HDR400, 1ms response time, and AMD FreeSync Premium for tear-free gaming.',
  features: [
    '34-inch WQHD (3440 x 1440) 1500R curved VA panel',
    '165Hz refresh rate (DisplayPort)',
    '1ms (mprt) response time',
    'AMD FreeSync Premium',
    'HDR400 certification'
  ],
  images: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
  ],
  variants: {
    colors: ['Black', 'Silver'],
    sizes: ['34-inch', '27-inch']
  },
  faqs: [
    { q: 'Is this monitor compatible with VESA mounts?', a: 'Yes, it supports standard 100x100mm VESA mounting.' },
    { q: 'Does it have built-in speakers?', a: 'No, it features a 3.5mm audio out jack for external speakers or headphones.' },
    { q: 'What cables are included in the box?', a: 'It includes 1x DisplayPort cable, 1x HDMI cable, and the power adapter.' }
  ]
};

const ProductDetails = () => {
  const { productId } = useParams();
  const { addItem } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.variants.colors[0]);
  const [selectedSize, setSelectedSize] = useState(MOCK_PRODUCT.variants.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  const handleAddToCart = () => {
    addItem({
      id: MOCK_PRODUCT.id,
      title: MOCK_PRODUCT.title,
      price: MOCK_PRODUCT.price,
      image: MOCK_PRODUCT.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  // Mock estimated delivery
  const today = new Date();
  const deliveryMin = new Date(today);
  deliveryMin.setDate(today.getDate() + 3);
  const deliveryMax = new Date(today);
  deliveryMax.setDate(today.getDate() + 7);

  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="container-custom py-8 pb-24">

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link to="/category/electronics" className="hover:text-accent transition-colors">Electronics</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate shrink">{MOCK_PRODUCT.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border overflow-hidden group">
            <img
              src={MOCK_PRODUCT.images[selectedImage]}
              alt={MOCK_PRODUCT.title}
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
            />
            {/* Mock Video Badge overlay */}
            {selectedImage === 0 && (
              <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={64} className="text-white drop-shadow-lg" />
              </button>
            )}

            <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-rose-500 shadow-sm transition-colors">
              <Heart size={20} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {MOCK_PRODUCT.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors ${selectedImage === idx ? 'border-accent' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-2">{MOCK_PRODUCT.brand}</h2>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {MOCK_PRODUCT.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                <span className="font-bold text-yellow-700 dark:text-yellow-500 text-sm">{MOCK_PRODUCT.rating}</span>
              </div>
              <a href="#reviews" className="text-sm text-gray-500 hover:text-accent underline underline-offset-4">
                {MOCK_PRODUCT.reviews} verified reviews
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button className="text-sm text-gray-500 hover:text-accent flex items-center gap-1">
                <Share2 size={14} /> Share
              </button>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-display font-bold text-gray-900 dark:text-white">${MOCK_PRODUCT.price}</span>
              {MOCK_PRODUCT.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">${MOCK_PRODUCT.originalPrice}</span>
                  <span className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded">
                    Save ${Math.floor(MOCK_PRODUCT.originalPrice - MOCK_PRODUCT.price)}
                  </span>
                </>
              )}
            </div>

            {MOCK_PRODUCT.stock < 10 && (
              <div className="flex items-center gap-2 mb-6 p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-lg">
                <AlertCircle size={18} className="text-rose-500" />
                <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                  Hurry! Only <span className="font-bold text-rose-700 dark:text-rose-400">{MOCK_PRODUCT.stock} units</span> left in stock.
                </span>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-gray-100 dark:bg-dark-border mb-6"></div>

          {/* Variants */}
          <div className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {MOCK_PRODUCT.variants.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 px-4 rounded-lg font-medium text-sm transition-all border ${selectedColor === color ? 'border-accent bg-accent/5 text-accent' : 'border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-gray-400 flex items-center gap-2'}`}
                  >
                    <span className={`w-3 h-3 rounded-full shadow-sm`} style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : '#e5e7eb' }}></span>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Size: <span className="text-gray-500 font-normal">{selectedSize}</span></h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {MOCK_PRODUCT.variants.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-4 rounded-lg font-medium text-sm transition-all border ${selectedSize === size ? 'border-accent bg-accent/5 text-accent shadow-sm ring-1 ring-accent' : 'border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center w-32 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card h-14 overflow-hidden">
              <button
                className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-accent transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >-</button>
              <span className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 dark:text-white border-x border-gray-100 dark:border-dark-border">{quantity}</span>
              <button
                className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-accent transition-colors"
                onClick={() => setQuantity(Math.min(MOCK_PRODUCT.stock, quantity + 1))}
              >+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary h-14 text-base tracking-wide"
            >
              Add to Cart - ${(MOCK_PRODUCT.price * quantity).toFixed(2)}
            </button>
          </div>

          {/* Delivery Estimator */}
          <div className="bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl p-5 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <Truck className="text-accent mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Estimated Delivery</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(deliveryMin)} - {formatDate(deliveryMax)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="text-emerald-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Buyer Protection Guarantee</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full refund if you don't receive your order or if the item is not as described.
                </p>
              </div>
            </div>
          </div>

          {/* Details Accordion */}
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden bg-white dark:bg-dark-card">
              <button className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-bg font-semibold text-left">
                Product Description
              </button>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-dark-border">
                {MOCK_PRODUCT.description}
                <ul className="list-disc pl-5 mt-4 space-y-1">
                  {MOCK_PRODUCT.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden bg-white dark:bg-dark-card">
              <button className="w-full flex justify-between items-center p-4 font-semibold text-left" onClick={() => { }}>
                Shipping & Returns <ChevronDown size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FAQs */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {MOCK_PRODUCT.faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                {faq.q}
                <ChevronDown size={18} className={`transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-dark-border">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
