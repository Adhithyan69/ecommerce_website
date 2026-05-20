import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, MonitorPlay, Sofa, Watch, Sparkles, Activity } from 'lucide-react';

const CATEGORIES = [
  { name: 'Smartphones', icon: <Smartphone size={28} />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', link: '/category/smartphones' },
  { name: 'Computing', icon: <MonitorPlay size={28} />, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', link: '/category/computers' },
  { name: 'Home Living', icon: <Sofa size={28} />, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400', link: '/category/home' },
  { name: 'Wearables', icon: <Watch size={28} />, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400', link: '/category/wearables' },
  { name: 'Beauty', icon: <Sparkles size={28} />, color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400', link: '/category/beauty' },
  { name: 'Sports', icon: <Activity size={28} />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400', link: '/category/sports' },
];

const CategoryGrid = () => {
  return (
    <section className="container-custom py-16 border-b border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg">
      <div className="text-center mb-10 block md:hidden">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Shop by Category</h2>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
        {CATEGORIES.map((cat, index) => (
          <Link key={index} to={cat.link} className="flex flex-col items-center group">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg ${cat.color}`}>
              {cat.icon}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
