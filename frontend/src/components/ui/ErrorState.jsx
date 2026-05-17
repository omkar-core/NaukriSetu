import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-danger-light dark:bg-danger/20 flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">Error</h3>
      <p className="text-sm text-muted mt-1 text-center max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  )
}
