import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

// Stub Data
const MOCK_REVIEWS = [
  {
    id: 'r1',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150',
    rating: 5,
    date: 'March 10, 2026',
    title: 'Incredible monitor for productivity!',
    content: 'The 1000R curve takes a day to get used to, but once you do, flat monitors look weird. Im running it with my MacBook Pro and the picture quality is outstanding. No dead pixels on arrival either. Worth every penny.',
    helpful: 124,
    verified: true,
  },
  {
    id: 'r2',
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150',
    rating: 4,
    date: 'February 28, 2026',
    title: 'Great but terrible stand',
    content: 'Panel is top tier for gaming. Response times are accurately stated. Knocking off one star because the included stand wobbles way too much. Put it on a VESA mount immediately and you will love it.',
    helpful: 89,
    verified: true,
  },
  {
    id: 'r3',
    user: 'Michael Chen',
    avatar: null,
    rating: 5,
    date: 'February 15, 2026',
    title: 'Absolute beast',
    content: 'Upgraded from a 1080p 60hz panel and I am blown away. Colors are punchy right out of the box without calibration.',
    helpful: 12,
    verified: false,
  }
];

const StarRating = ({ rating, size = 16, interactive = false, onRating = null }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : "submit"}
          onClick={() => interactive && onRating && onRating(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default pointer-events-none'}`}
        >
          <Star
            size={size}
            className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewSystem = ({ productId }) => {
  const { isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [isWriting, setIsWriting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', content: '' });

  const handleHelpful = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating === 0) return alert("Please select a star rating");
    
    const submitted = {
      id: `r${Date.now()}`,
      user: 'Current User', 
      avatar: null,
      rating: newReview.rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: newReview.title,
      content: newReview.content,
      helpful: 0,
      verified: true // Assuming they bought it in a real app
    };
    
    setReviews([submitted, ...reviews]);
    setIsWriting(false);
    setNewReview({ rating: 0, title: '', content: '' });
  };

  // Calculate Aggregates
  const totalReviews = reviews.length;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (totalReviews || 1)).toFixed(1);
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { counts[r.rating]++ });

  return (
    <div id="reviews" className="mt-24 pt-12 border-t border-gray-200 dark:border-dark-border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">{avgRating}</span>
              <span className="text-gray-500 font-medium ml-1">out of 5</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500">{totalReviews} global ratings</span>
          </div>
        </div>
        
        {!isWriting && (
          <button 
            onClick={() => setIsWriting(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <MessageSquare size={18} /> Write a Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Rating Bars */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(star => {
              const percentage = Math.round((counts[star] / totalReviews) * 100) || 0;
              return (
                <div key={star} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12 shrink-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{star}</span>
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-500 w-10 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Content */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          
          {/* Write form */}
          {isWriting && (
            <div className="bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 md:p-8 mb-10 animate-fade-in shadow-sm relative">
              <button onClick={() => setIsWriting(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <Plus className="rotate-45" size={24} />
              </button>
              
              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign in to review</h3>
                  <p className="text-gray-500 mb-6">You need to be logged in to share your thoughts.</p>
                  <button onClick={() => window.location.href='/auth/login'} className="btn btn-primary">Sign In / Register</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Share your experience</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Rating *</label>
                    <StarRating 
                      rating={newReview.rating} 
                      size={28} 
                      interactive={true} 
                      onRating={r => setNewReview({...newReview, rating: r})} 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add a headline *</label>
                    <input 
                      type="text" 
                      required 
                      className="input" 
                      placeholder="What's most important to know?"
                      value={newReview.title}
                      onChange={e => setNewReview({...newReview, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add a written review *</label>
                    <textarea 
                      required 
                      rows="5" 
                      className="input resize-none" 
                      placeholder="What did you like or dislike? What did you use this product for?"
                      value={newReview.content}
                      onChange={e => setNewReview({...newReview, content: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-full sm:w-auto px-8">Submit Review</button>
                </form>
              )}
            </div>
          )}

          {/* List */}
          <div className="space-y-10">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 dark:border-dark-border pb-10 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 font-bold">{review.user.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.user}</h4>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle size={12} /> Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <StarRating rating={review.rating} />
                  <h5 className="font-bold text-gray-900 dark:text-white">{review.title}</h5>
                </div>
                
                <p className="text-xs text-gray-500 mb-4">Reviewed on {review.date}</p>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {review.content}
                </p>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent font-medium transition-colors border border-gray-200 dark:border-dark-border px-4 py-1.5 rounded-full hover:border-accent/50 hover:bg-accent/5"
                  >
                    <ThumbsUp size={14} /> Helpful ({review.helpful})
                  </button>
                  <button className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">Report</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewSystem;
