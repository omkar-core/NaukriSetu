import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page Not Found');
  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl mb-6">🔍</p>
        <h1 className="font-poppins font-bold text-4xl text-navy dark:text-text-dark mb-3">404 — Not Found</h1>
        <p className="text-text-muted dark:text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It may have been moved, deleted, or the job listing may have expired.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary px-6 py-3">🏠 Go to Homepage</Link>
          <Link to="/jobs" className="btn-outline px-6 py-3">💼 Browse Latest Jobs</Link>
        </div>
      </div>
    </main>
  );
}
