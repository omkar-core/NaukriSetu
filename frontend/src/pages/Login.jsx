import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { signInWithEmail, signInWithGoogle, sendPasswordReset } from '../services/authService.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Please enter a valid email address.';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    const result = await signInWithEmail(email.trim(), password, rememberMe);
    if (result.success) {
      addToast(`Welcome back!`, 'success');
      navigate(redirectTo, { replace: true });
    } else {
      if (result.error.includes('Google')) {
        setErrors({ email: result.error });
      } else {
        setErrors({ password: result.error });
      }
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    const result = await signInWithGoogle();
    if (result.success) {
      addToast('Welcome back!', 'success');
      navigate(redirectTo, { replace: true });
    } else {
      if (result.error !== 'Sign in was cancelled.') {
        addToast(result.error, 'error');
      }
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSubmitting(true);
    const result = await sendPasswordReset(resetEmail.trim());
    if (result.success) {
      setResetSent(true);
    } else {
      addToast(result.error || 'Failed to send reset email.', 'error');
    }
    setResetSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark pt-16 flex">
      {/* Left Panel - desktop only */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-primary-800 via-accent to-primary-900 text-white p-12 flex-col justify-between">
        <div>
          <Link to="/" className="font-poppins font-bold text-2xl text-white">
            Naukri<span className="text-yellow-300">Setu</span>
          </Link>
        </div>
        <div className="space-y-6">
          <h1 className="font-poppins font-bold text-3xl leading-tight">Welcome Back. Your Next Government Job Is Waiting.</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128278;</span>
              <span className="text-sm text-white/90">Access your saved jobs from any device</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128276;</span>
              <span className="text-sm text-white/90">Get personalized alerts for your preferred jobs</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128200;</span>
              <span className="text-sm text-white/90">Track your applications in one place</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-start justify-center py-12 px-4 sm:px-8">
        <div className="w-full max-w-lg">
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="font-poppins font-bold text-2xl text-accent">
              Naukri<span className="text-navy dark:text-text-dark">Setu</span>
            </Link>
          </div>

          <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark mb-6">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200 disabled:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus-within:border-accent'}`}>
                <span className="px-3 text-gray-400">&#9993;</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                  placeholder="Enter your registered email"
                  className="flex-1 py-3 pr-3 bg-transparent text-sm text-navy dark:text-text-dark placeholder-gray-400 focus:outline-none"
                  disabled={submitting}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-navy dark:text-text-dark">
                  Password <span className="text-danger">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-xs text-accent hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus-within:border-accent'}`}>
                <span className="px-3 text-gray-400">&#128274;</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                  placeholder="Enter your password"
                  className="flex-1 py-3 bg-transparent text-sm text-navy dark:text-text-dark placeholder-gray-400 focus:outline-none"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password Inline */}
            {showForgotPassword && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
                {resetSent ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder.
                  </p>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-3">
                    <p className="text-xs text-gray-500">Enter your email address and we will send you a password reset link.</p>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-navy dark:text-text-dark focus:outline-none focus:border-accent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={resetSubmitting || !resetEmail.trim()}
                      className="w-full py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {resetSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="accent-accent"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">Keep me signed in on this device</span>
            </label>

            {/* Sign In */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing you in, please wait...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500">
              New to NaukriSetu?{' '}
              <Link to="/signup" className="text-accent font-medium hover:underline">Create Free Account</Link>
            </p>

            {/* Guest browse */}
            <p className="text-center">
              <Link to="/" className="text-xs text-gray-400 hover:text-accent">
                Continue browsing without an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
