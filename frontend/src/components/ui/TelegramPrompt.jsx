import { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';

const TELEGRAM_LINK = 'https://t.me/naukrisetu';

export default function TelegramPrompt() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('naukrisetu-telegram-dismissed');
    if (stored) {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('naukrisetu-telegram-dismissed', Date.now().toString());
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 right-4 left-4 sm:left-auto sm:w-72 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <Send size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy dark:text-text-dark">Join us on Telegram</p>
          <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">Get instant job alerts on your phone.</p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Now
          </a>
        </div>
        <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="Dismiss Telegram prompt">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
