import { useState, useEffect } from 'react';
import { getLatestAdmitCards } from '../services/admitCardsService.js';
import { Link } from 'react-router-dom';
import { ExternalLink, Search } from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function AdmitCard() {
  useDocumentTitle('Admit Cards');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    getLatestAdmitCards().then(res => {
      setItems(res.items || []);
    }).catch(() => {
      setItems([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filtered = items.filter(a => a.examName.toLowerCase().includes(q.toLowerCase()));

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Admit Cards</span>
        </nav>
        <h1 className="section-title mb-1">🎫 Admit Cards 2024</h1>
        <p className="section-subtitle mb-6">Download admit cards / hall tickets for all government exams</p>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search exam name..." className="input pl-10 text-sm" aria-label="Search admit cards" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-text-muted py-10">No admit cards found. Try a different search.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(ac => (
              <article key={ac.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-1">{ac.examName}</h2>
                  <p className="text-text-muted dark:text-gray-400 text-sm">{ac.conductingBody}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-success">Released: {formatDate(ac.releaseDate)}</p>
                    <p className="text-xs text-text-muted dark:text-gray-400">Exam: {formatDate(ac.examDate)}</p>
                  </div>
                  {ac.instructions && <p className="text-xs text-warning mt-1.5">⚠️ {ac.instructions}</p>}
                </div>
                <a href={ac.downloadLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 flex-shrink-0">
                  Download <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
