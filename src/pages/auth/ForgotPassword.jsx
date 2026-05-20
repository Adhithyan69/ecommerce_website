import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 dark:opacity-80 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="w-full max-w-md relative animate-zoom-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Forgot password?</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your email and we'll send a reset link</p>
        </div>

        <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-2xl border border-white/30 dark:border-dark-border/60 shadow-2xl rounded-3xl p-8">
          {sent ? (
            <div className="text-center py-4 animate-zoom-in">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-success" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">Email sent!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                We sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>. Check your inbox.
              </p>
              <p className="text-xs text-gray-400">Didn't receive it? Check spam or{' '}
                <button onClick={() => setSent(false)} className="text-accent hover:underline font-medium">try again</button>
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-error/10 border border-error/20 text-error rounded-xl p-4 mb-5 text-sm animate-fade-in">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label-text">Email address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-11" placeholder="you@example.com" required autoFocus />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full h-12 flex items-center justify-center gap-2 shadow-glow">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</span>
                  ) : (<>Send Reset Link <ArrowRight size={18} /></>)}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/auth/login" className="text-sm text-gray-500 hover:text-accent transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
