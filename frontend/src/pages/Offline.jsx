import { WifiOff, RefreshCw } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Offline() {
  useDocumentTitle('You Are Offline');
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center mx-auto">
          <WifiOff size={36} className="text-muted" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text mt-4">You're Offline</h2>
        <p className="text-sm text-muted mt-2">Please check your internet connection and try again.</p>
        <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors mt-6">
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    </div>
  )
}
