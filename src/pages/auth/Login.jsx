import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/user/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock login delay
    setTimeout(() => {
      if (email && password) {
        login({ email, displayName: email.split('@')[0] });
        navigate(from, { replace: true });
      } else {
        setError('Invalid credentials');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-white/20 dark:border-dark-border shadow-2xl rounded-3xl p-8 sm:p-10 animate-slide-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" placeholder="name@example.com" required />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? <Link to="/auth/signup" className="text-accent font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;