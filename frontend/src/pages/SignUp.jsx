import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { createAccount, signInWithGoogle } from '../services/authService.js';
import { useToast } from '../context/ToastContext.jsx';

const INDIAN_STATES = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

const CATEGORIES = ['Railway', 'Banking', 'Defence', 'Engineering PSU', 'Teaching', 'Police', 'UPSC', 'SSC', 'State PSC', 'Internship', 'Apprenticeship'];

const QUALIFICATIONS = ['10th Pass', '12th Pass', 'ITI Certificate', 'Diploma', 'Bachelor Degree', 'Master Degree', 'PhD or Above'];

function PasswordStrengthBar({ password }) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%]/.test(password)) score++;

  const barWidth = `${(score / 4) * 100}%`;
  const colors = ['bg-gray-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-1.5">
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${colors[score]}`} style={{ width: barWidth }} />
      </div>
      {password.length > 0 && (
        <p className={`text-[11px] mt-0.5 font-medium ${score >= 3 ? 'text-green-600' : score >= 2 ? 'text-orange-500' : 'text-red-500'}`}>
          {labels[score]}
        </p>
      )}
    </div>
  );
}

export default function SignUp() {
  useDocumentTitle('Create Free Account');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    categories: [],
    state: '',
    qualification: '',
    agreeTerms: false,
    emailAlerts: true,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s-]+$/.test(value.trim())) return 'Please enter your real name using only letters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address like yourname@gmail.com';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
        if (!/[0-9]/.test(value)) return 'Password must include a number';
        if (!/[!@#$%]/.test(value)) return 'Password must include a special character (!@#$%)';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== form.password) return 'Passwords do not match. Please check and try again.';
        return '';
      case 'agreeTerms':
        return value ? '' : 'You must agree to the Terms of Service and Privacy Policy to create an account.';
      default:
        return '';
    }
  };

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const toggleCategory = (cat) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const isFormValid = () => {
    return (
      !validateField('fullName', form.fullName) &&
      !validateField('email', form.email) &&
      !validateField('password', form.password) &&
      !validateField('confirmPassword', form.confirmPassword) &&
      form.agreeTerms
    );
  };

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[!@#$%]/.test(form.password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || submitting) return;

    const fieldErrors = {};
    for (const field of ['fullName', 'email', 'password', 'confirmPassword', 'agreeTerms']) {
      const err = validateField(field, form[field]);
      if (err) fieldErrors[field] = err;
    }
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const result = await createAccount(form.email, form.password, form.fullName.trim(), {
      categories: form.categories,
      state: form.state,
      qualification: form.qualification,
      emailAlerts: form.emailAlerts,
    });

    if (result.success) {
      setSuccess(true);
      addToast(`Welcome to NaukriSetu, ${form.fullName.split(' ')[0]}!`, 'success');
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } else {
      if (result.error.includes('already registered')) {
        setErrors({ email: result.error });
      } else {
        addToast(result.error, 'error');
      }
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    const result = await signInWithGoogle();
    if (result.success) {
      addToast(`Welcome to NaukriSetu, ${result.user.displayName || 'User'}!`, 'success');
      navigate('/', { replace: true });
    } else {
      if (result.error !== 'Sign in was cancelled.') {
        addToast(result.error, 'error');
      }
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-in">&#10004;&#65039;</div>
          <h2 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark mb-2">Account Created!</h2>
          <p className="text-text-muted dark:text-gray-400">Redirecting you to your personalized dashboard...</p>
        </div>
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
          <h1 className="font-poppins font-bold text-3xl leading-tight">Your Government Job Journey Starts Here</h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Join lakhs of Indian job seekers getting daily government job alerts, internship updates, and exam notifications directly to their inbox.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128278;</span>
              <span className="text-sm text-white/90">Save unlimited jobs and sync across devices</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128276;</span>
              <span className="text-sm text-white/90">Get personalized alerts for jobs matching your profile</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">&#128200;</span>
              <span className="text-sm text-white/90">Track your applications in one place</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">2,847+</p>
              <p className="text-[10px] text-white/70">Active Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-[10px] text-white/70">Registered Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">Daily</p>
              <p className="text-[10px] text-white/70">Updates</p>
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

          <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark mb-6">Create Your Free Account</h1>

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

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus-within:border-accent'}`}>
                <span className="px-3 text-gray-400">&#128100;</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={50}
                  className="flex-1 py-3 pr-3 bg-transparent text-sm text-navy dark:text-text-dark placeholder-gray-400 focus:outline-none"
                  disabled={submitting}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
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
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 py-3 pr-3 bg-transparent text-sm text-navy dark:text-text-dark placeholder-gray-400 focus:outline-none"
                  disabled={submitting}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                Create Password <span className="text-danger">*</span>
              </label>
              <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus-within:border-accent'}`}>
                <span className="px-3 text-gray-400">&#128274;</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="Create a strong password"
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
              <PasswordStrengthBar password={form.password} />
              <div className="mt-2 space-y-1">
                {[
                  { key: 'length', label: 'Minimum 8 characters' },
                  { key: 'upper', label: 'At least one uppercase letter' },
                  { key: 'number', label: 'At least one number' },
                  { key: 'special', label: 'At least one special character (!@#$%)' },
                ].map(check => (
                  <div key={check.key} className="flex items-center gap-1.5 text-xs">
                    {passwordChecks[check.key] ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <Circle size={12} className="text-gray-300 dark:text-gray-600" />
                    )}
                    <span className={passwordChecks[check.key] ? 'text-green-600' : 'text-gray-400'}>{check.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus-within:border-accent'}`}>
                <span className="px-3 text-gray-400">&#128274;</span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  className="flex-1 py-3 bg-transparent text-sm text-navy dark:text-text-dark placeholder-gray-400 focus:outline-none"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-3 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Job Categories */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                &#128188; What type of jobs are you looking for? <span className="text-accent text-[10px]">Recommended</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      form.categories.includes(cat)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-accent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                &#128205; Your Home State <span className="text-accent text-[10px]">Recommended</span>
              </label>
              <select
                value={form.state}
                onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm text-navy dark:text-text-dark focus:outline-none focus:border-accent"
                disabled={submitting}
              >
                <option value="">Select your state</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">
                &#127891; Your Highest Qualification <span className="text-accent text-[10px]">Recommended</span>
              </label>
              <select
                value={form.qualification}
                onChange={e => setForm(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm text-navy dark:text-text-dark focus:outline-none focus:border-accent"
                disabled={submitting}
              >
                <option value="">Select qualification</option>
                {QUALIFICATIONS.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={e => handleChange('agreeTerms', e.target.checked)}
                  className="mt-0.5 accent-accent"
                  disabled={submitting}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  I have read and agree to the{' '}
                  <a href="/terms" target="_blank" className="text-accent hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" target="_blank" className="text-accent hover:underline">Privacy Policy</a>.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-xs text-red-500 mt-1">{errors.agreeTerms}</p>}
            </div>

            {/* Email Alerts */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailAlerts}
                onChange={e => setForm(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                className="mt-0.5 accent-accent"
                disabled={submitting}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Send me job alerts and recruitment notifications by email.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid() || submitting}
              className="w-full py-3.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating your account, please wait...
                </>
              ) : (
                'Create My Free Account'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
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
