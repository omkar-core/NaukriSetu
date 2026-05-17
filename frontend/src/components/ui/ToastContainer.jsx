import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

const icons = {
  success: <CheckCircle2 size={18} className="text-success" />,
  error: <AlertCircle size={18} className="text-danger" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info: <Info size={18} className="text-accent" />,
};

const borders = {
  success: 'border-l-success',
  error: 'border-l-danger',
  warning: 'border-l-warning',
  info: 'border-l-accent',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center w-full max-w-sm px-4" role="status" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`w-full bg-white dark:bg-card-dark border-l-4 ${borders[toast.type] || borders.info} border border-card-border dark:border-gray-700 rounded-xl shadow-lg p-4 flex items-center gap-3 animate-slide-up`}
        >
          {icons[toast.type] || icons.info}
          <p className="flex-1 text-sm text-navy dark:text-text-dark font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
