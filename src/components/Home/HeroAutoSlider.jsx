import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Star, TrendingUp } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: '✨ New Collection 2026',
    title: 'Future of',
    highlight: 'Shopping',
    desc: 'Curated premium products delivered straight from top verified suppliers to your doorstep. No middlemen.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=90&w=2000',
    primaryLink: '/category/all',
    secondaryLink: '/category/trending',
    accent: 'from-accent to-purple-500',
    stat: { value: '50K+', label: 'Happy Customers' },
  },
  {
    id: 2,
    badge: '⚡ Up to 40% Off',
    title: 'Smart Home',
    highlight: 'Revolution',
    desc: 'Automate your life with next-gen smart devices. Voice control, energy saving, and fast global shipping.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=90&w=2000',
    primaryLink: '/category/electronics',
    secondaryLink: '/offers',
    accent: 'from-cyan-500 to-blue-600',
    stat: { value: '40%', label: 'Max Discount' },
  },
  {
    id: 3,
    badge: '🏆 Premium Office Gear',
    title: 'Elevate Your',
    highlight: 'Workspace',
    desc: 'Ergonomic designs meeting aesthetic perfection. Upgrade your WFH setup with our premium collection.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=90&w=2000',
    primaryLink: '/category/home',
    secondaryLink: '/category/all',
    accent: 'from-amber-400 to-orange-500',
    stat: { value: '500+', label: 'Products' },
  },
];

const ProgressBar = ({ duration, key }) => (
  <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
    <div
      key={key}
      className="h-full bg-white rounded-full origin-left"
      style={{ animation: `progress ${duration}ms linear forwards`, '--progress-width': '100%' }}
    />
  </div>
);

const HeroAutoSlider = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const DURATION = 5000;

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), DURATION);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 100);
  };

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
    });
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[92vh] min-h-[640px] max-h-[900px] overflow-hidden group"
    >
      {/* Background Images with subtle parallax */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          style={{
            transform: i === current ? `scale(1.05) translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)` : 'scale(1.1)',
            transition: 'opacity 1s ease, transform 0.1s ease-out',
          }}
        >
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Content */}
      <div className="container-custom relative z-10 h-full flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Text content */}
          <div className="text-white max-w-2xl">
            {/* Badge */}
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold text-white mb-6 animate-fade-in-down"
            >
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1
              key={`title-${current}`}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.05] mb-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              {slide.title}
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accent}`}>
                {slide.highlight}
              </span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${current}`}
              className="text-lg text-gray-200 mb-8 max-w-lg leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {slide.desc}
            </p>

            {/* CTA Buttons */}
            <div
              key={`cta-${current}`}
              className="flex flex-wrap gap-4 mb-10 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Link
                to={slide.primaryLink}
                className="inline-flex items-center gap-2 h-14 px-8 bg-white text-gray-900 font-bold rounded-2xl hover:scale-105 hover:shadow-glow-lg transition-all duration-200 text-base group/btn ripple"
              >
                Shop Now
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={slide.secondaryLink}
                className="inline-flex items-center gap-2 h-14 px-8 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-base"
              >
                View Deals
              </Link>
            </div>

            {/* Floating stat chip */}
            <div
              key={`stat-${current}`}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slide.accent} flex items-center justify-center text-white`}>
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{slide.stat.value}</div>
                <div className="text-xs text-white/60">{slide.stat.label}</div>
              </div>
            </div>
          </div>

          {/* RIGHT — Floating product card (desktop) */}
          <div className="hidden lg:flex justify-end items-center">
            <div
              key={`card-${current}`}
              className="relative animate-fade-in-up"
              style={{
                animationDelay: '200ms',
                transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Glow ring */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${slide.accent} rounded-3xl blur-xl opacity-30 animate-pulse-slow`} />
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl w-72">
                {/* Star ratings */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" className="text-yellow-400" />)}
                  <span className="text-white/60 text-xs ml-1">4.9 (2.4k)</span>
                </div>
                <img
                  src={SLIDES[current].image}
                  alt="Featured"
                  className="w-full h-44 object-cover rounded-xl mb-4 ring ring-white/10"
                />
                <p className="text-white font-bold text-sm line-clamp-2 mb-3">Featured Collection — {slide.highlight}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-black text-xl">₹24,999</div>
                    <div className="text-white/50 text-xs line-through">₹39,999</div>
                  </div>
                  <Link to={slide.primaryLink} className={`px-4 py-2 rounded-xl bg-gradient-to-r ${slide.accent} text-white font-bold text-sm hover:opacity-90 transition-opacity`}>
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom slide controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 container-custom">
        <div className="flex items-center gap-6">
          {/* Slide number */}
          <span className="text-white/50 text-sm font-mono tabular-nums">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>

          {/* Progress bars */}
          <div className="flex gap-2 flex-1 max-w-xs">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="flex-1 group/dot">
                <div className={`h-0.5 rounded-full overflow-hidden ${i === current ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>
                  {i === current && (
                    <div
                      key={current}
                      className="h-full bg-white rounded-full"
                      style={{ animation: `progress ${DURATION}ms linear forwards` }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo((current + 1) % SLIDES.length)}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-hover active:scale-90 transition-all shadow-glow"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAutoSlider;
