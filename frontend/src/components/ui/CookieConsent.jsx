import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('naukrisetu-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('naukrisetu-cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:max-w-sm z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <Cookie size={20} className="text-accent flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted dark:text-gray-400 leading-relaxed">
            We use cookies to improve your experience. By using NaukriSetu, you agree to our{' '}
            <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={accept} className="px-3 py-1.5 text-xs font-medium bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors">
              Accept
            </button>
            <button onClick={accept} className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-text-dark transition-colors">
              Dismiss
            </button>
          </div>
        </div>
        <button onClick={accept} className="text-gray-400 hover:text-gray-600" aria-label="Dismiss cookie consent">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
