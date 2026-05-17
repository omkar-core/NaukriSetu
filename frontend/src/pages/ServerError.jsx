import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function ServerError() {
  useDocumentTitle('Server Error');
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-danger-light dark:bg-danger/20 flex items-center justify-center mx-auto">
          <AlertTriangle size={36} className="text-danger" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary dark:text-dark-text mt-4">500</h1>
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text mt-1">Server Error</h2>
        <p className="text-sm text-muted mt-2">Something went wrong on our end. Please try again later.</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
            <Home size={15} /> Go Home
          </Link>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-5 py-2.5 border border-card-border dark:border-dark-border text-text-primary dark:text-dark-text text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>
    </div>
  )
}
