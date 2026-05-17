import { useState, useEffect } from 'react';
import { getLatestInternships } from '../services/internshipsService.js';
import { Link } from 'react-router-dom';
import { ExternalLink, Info } from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Internships() {
  useDocumentTitle('Internships');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestInternships().then(res => {
      setItems(res.items || []);
    }).catch(() => {
      setItems([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Internships</span>
        </nav>
        <h1 className="section-title mb-1">🎓 Government Internships 2024</h1>
        <p className="section-subtitle mb-6">ISRO, DRDO, IITs, PSUs, and AICTE-recognised internship opportunities</p>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl mb-8">
          <Info size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <strong>Note:</strong> Government internships (ISRO, DRDO, PSUs) are officially recognised and often carry certificates from the Ministry of Skill Development. Private internships listed here are from trusted sources only. Always verify through official websites.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-text-muted py-10">No internships available right now. Check back later.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <article key={item.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`badge ${item.orgType === 'government' ? 'badge-new' : 'badge-blue'} mb-2`}>
                      {item.orgType === 'government' ? '🏛️ Government' : '🏢 PSU'}
                    </span>
                    <h2 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark leading-snug">{item.title}</h2>
                    <p className="text-text-muted dark:text-gray-400 text-xs mt-0.5">{item.organization}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { emoji: '💼', val: item.role },
                    { emoji: '💰', val: item.stipendDisplay },
                    { emoji: '⏱️', val: `Duration: ${item.duration}` },
                    { emoji: '🎓', val: item.eligibility },
                  ].map(row => (
                    <div key={row.val} className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
                      <span>{row.emoji}</span><span>{row.val}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-card-border dark:border-gray-700 mt-auto">
                  <span className="text-xs text-danger font-medium">📅 {formatDate(item.lastDate)}</span>
                  <a href={item.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-1.5 px-3">
                    Apply <ExternalLink size={11} />
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
