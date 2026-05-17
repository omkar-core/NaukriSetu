import { useState, useEffect } from 'react';
import { getLatestResults } from '../services/resultsService.js';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Results() {
  useDocumentTitle('Results');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestResults().then(res => {
      setItems(res.items || []);
    }).catch(() => {
      setItems([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Results</span>
        </nav>
        <h1 className="section-title mb-1">📊 Exam Results 2024</h1>
        <p className="section-subtitle mb-6">Check latest declared results and upcoming result dates</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-text-muted py-10">No results available right now. Check back later.</p>
        ) : (
          <div className="space-y-4">
            {items.map(r => (
              <article key={r.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge ${r.status === 'declared' ? 'badge-new' : r.status === 'expected' ? 'badge-soon' : 'badge-urgent'}`}>
                      {r.status === 'declared' ? '✅ Declared' : r.status === 'expected' ? '⏳ Expected' : '⚠️ Delayed'}
                    </span>
                  </div>
                  <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark">{r.examName}</h2>
                  <p className="text-text-muted dark:text-gray-400 text-sm">{r.conductingBody} • Result: {formatDate(r.resultDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.cutoffLink && (
                    <a href={r.cutoffLink} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-2">Cutoff</a>
                  )}
                  <a href={r.resultLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2">
                    View Result <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
