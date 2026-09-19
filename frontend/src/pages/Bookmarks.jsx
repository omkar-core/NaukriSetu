import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, Trash2, ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useBookmarks } from '../context/BookmarkContext.jsx';
import { formatDate, getDaysLeft } from '../utils/formatDate.js';

export default function Bookmarks() {
  useDocumentTitle('Saved Jobs');
  const { bookmarks, toggleBookmark } = useBookmarks();

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Back to home">
            <ArrowLeft size={18} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark">Saved Jobs</h1>
            <p className="text-sm text-text-muted dark:text-gray-400">
              {bookmarks.length} {bookmarks.length === 1 ? 'job' : 'jobs'} saved
            </p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <Bookmark size={28} className="text-gray-400" />
            </div>
            <h2 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark mb-2">No saved jobs yet</h2>
            <p className="text-sm text-text-muted dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Start exploring government jobs and save the ones that interest you. Your saved jobs will appear here.
            </p>
            <Link to="/jobs" className="btn-primary inline-flex text-sm px-6 py-2.5">
              <BriefcaseBusiness size={16} />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map(job => {
              const daysLeft = getDaysLeft(job.lastDate);
              return (
                <div
                  key={job.id}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-accent/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-navy dark:text-text-dark hover:text-accent transition-colors line-clamp-2">
                      {job.title}
                    </Link>
                    <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">{job.organization}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {job.category && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">{job.category}</span>
                      )}
                      {job.lastDate && (
                        <span className={`text-[10px] ${daysLeft !== null && daysLeft <= 7 ? 'text-danger' : 'text-gray-400'}`}>
                          {daysLeft !== null && daysLeft <= 0 ? 'Closed' : `Last: ${formatDate(job.lastDate)}`}
                        </span>
                      )}
                      {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                        <span className="text-[10px] font-semibold text-danger bg-danger/10 px-1.5 py-0.5 rounded-full">{daysLeft}d left</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="p-2 text-gray-400 hover:text-accent rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="View job details"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button
                      onClick={() => toggleBookmark(job)}
                      className="p-2 text-accent rounded-lg hover:bg-accent/10 transition-colors"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
