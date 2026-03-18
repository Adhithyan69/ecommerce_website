import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Mic, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RECENT_SEARCHES = ['Wireless Headphones', 'Gaming Monitor', 'Mechanical Keyboard', 'Smart Home Hub'];
const TRENDING_SEARCHES = ['Ergonomic Chair', 'LED Strip Lights', '4K Projector', 'Bluetooth Speaker'];

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // tiny delay to allow animation before focus
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      // In a real app we'd redirect to a search results page with ?q=query
      navigate(`/category/all`); 
    }
  };

  const handleSuggestionClick = (term) => {
    setQuery(term);
    onClose();
    navigate(`/category/all`);
  };

  const toggleVoiceSearch = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Stub for speech recognition
      setTimeout(() => {
        setQuery('Headphones');
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32 px-4 shadow-2xl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden animate-slide-down border border-gray-200 dark:border-dark-border">
        
        {/* Search Input Area */}
        <form onSubmit={handleSearch} className="flex items-center relative border-b border-gray-100 dark:border-dark-border p-4">
          <Search size={24} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-xl font-medium text-gray-900 dark:text-white px-4 py-2 focus:ring-0 placeholder-gray-400 w-full"
            placeholder="Search products, brands, and categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery('')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            )}
            <button 
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-rose-100 text-rose-500 animate-pulse' 
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg hover:text-accent'
              }`}
            >
              <Mic size={20} />
            </button>
          </div>
        </form>

        {/* Dynamic Content Area */}
        <div className="p-6">
          {query ? (
            // Predictive Search Results / Typo Tolerance Stub
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Suggestions for <span className="text-accent italic">"{query}"</span>
              </h3>
              <ul className="space-y-2">
                <li className="group">
                  <button onClick={() => handleSuggestionClick(query + ' pro')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors text-left text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-3"><Search size={16} className="text-gray-400" /> {query} <strong className="font-semibold">Pro</strong></span>
                    <ArrowRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li className="group">
                  <button onClick={() => handleSuggestionClick(query + ' setup')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors text-left text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-3"><Search size={16} className="text-gray-400" /> {query} <strong className="font-semibold">Setup</strong></span>
                    <ArrowRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Products</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 dark:border-dark-border cursor-pointer hover:border-accent transition-colors group">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-100 dark:border-dark-border"></div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-accent truncate">{query} Item Model X</h4>
                      <p className="text-xs text-gray-500">$129.99</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Default View: Recent & Trending
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold justify-between text-gray-900 dark:text-white flex items-center mb-4">
                  <span className="flex items-center gap-2"><Clock size={16} className="text-gray-400"/> Recent Searches</span>
                  <button className="text-xs text-accent hover:underline font-medium">Clear</button>
                </h3>
                <ul className="space-y-1">
                  {RECENT_SEARCHES.map(term => (
                    <li key={term}>
                      <button 
                        onClick={() => handleSuggestionClick(term)}
                        className="w-full text-left p-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-between group"
                      >
                        {term}
                        <X size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-rose-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-accent"/> Trending Now
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map(term => (
                    <button 
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-bg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-dark-bg p-4 flex items-center justify-center border-t border-gray-100 dark:border-dark-border">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-md mx-1 font-mono">ESC</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
