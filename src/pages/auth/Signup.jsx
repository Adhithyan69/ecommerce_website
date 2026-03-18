import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock signup
    setTimeout(() => {
      login({ email, displayName: name });
      navigate('/user/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-white/20 dark:border-dark-border shadow-2xl rounded-3xl p-8 sm:p-10 animate-slide-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500">Join Anti-Gravity today for exclusive deals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-12" placeholder="John Doe" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" placeholder="name@example.com" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12" placeholder="••••••••" required />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
              {loading ? 'Creating Account...' : <>Get Started <ArrowRight size={18} /></>}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/auth/login" className="text-accent font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;