import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Check, Zap } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { authAPI } from '../../services/api';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Symbol', pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-error', 'bg-warning', 'bg-accent', 'bg-success'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2 animate-fade-in">
      <div className="flex gap-1.5 mb-2">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < score ? colors[score - 1] : 'bg-gray-200 dark:bg-dark-border'}`} />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {checks.map(({ label, pass }) => (
            <span key={label} className={`text-[10px] flex items-center gap-1 transition-colors ${pass ? 'text-success' : 'text-gray-400'}`}>
              <Check size={10} /> {label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${['text-error', 'text-warning', 'text-accent', 'text-success'][score - 1] || 'text-gray-400'}`}>
          {score > 0 ? labels[score - 1] : ''}
        </span>
      </div>
    </div>
  );
};

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('Please accept the Terms of Service to continue.'); return; }
    setError('');
    setLoading(true);
    try {
      const user = await authAPI.signup({ name, email, password });
      login(user);
      navigate('/user/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-60 dark:opacity-100 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md relative animate-zoom-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">Anti-Gravity</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join thousands of smart shoppers today</p>
        </div>

        <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-2xl border border-white/30 dark:border-dark-border/60 shadow-2xl rounded-3xl p-8">
          {error && (
            <div className="flex items-center gap-3 bg-error/10 border border-error/20 text-error rounded-xl p-4 mb-6 animate-fade-in text-sm">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field pl-11" placeholder="Rahul Sharma" required autoComplete="name" />
              </div>
            </div>

            <div>
              <label className="label-text">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" placeholder="you@example.com" required autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-11 pr-12" placeholder="Min. 8 characters" required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${agreed ? 'bg-accent border-accent' : 'border-gray-300 dark:border-dark-border group-hover:border-accent'}`}>
                {agreed && <Check size={12} className="text-white" />}
              </div>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-accent font-medium hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-accent font-medium hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base shadow-glow flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : (
                <><span>Create Account</span> <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-accent font-semibold hover:text-accent-hover transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;