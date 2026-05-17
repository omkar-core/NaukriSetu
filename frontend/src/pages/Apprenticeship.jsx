import { useState, useEffect } from 'react';
import { getLatestApprenticeships } from '../services/apprenticeshipsService.js';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Apprenticeship() {
  useDocumentTitle('Apprenticeships');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const groups = ['Railway', 'PSU', 'Skill India', 'Government Factory'];

  useEffect(() => {
    getLatestApprenticeships().then(res => {
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
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Apprenticeship</span>
        </nav>
        <h1 className="section-title mb-1">🔧 Apprenticeship Programmes 2024</h1>
        <p className="section-subtitle mb-4">Railway, PSU, Government Factory & Skill India opportunities for ITI/Diploma holders</p>

        {/* NAPS Info */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-700">
          <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">What is an Apprenticeship?</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            An apprenticeship is a structured on-the-job training programme under the <strong>Apprentices Act 1961</strong>. Under the <strong>National Apprenticeship Promotion Scheme (NAPS)</strong>, the Government of India shares 25% of the stipend (up to ₹1,500/month) with the employer to encourage hiring of apprentices.
          </p>
          <a href="https://apprenticeshipindia.gov.in" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-4">
            Visit Apprenticeship India Portal <ExternalLink size={12} />
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-text-muted py-10">No apprenticeships available right now. Check back later.</p>
        ) : (
          groups.map(group => {
            const groupItems = items.filter(a => a.type === group || (group === 'PSU' && a.type === 'PSU') || (group === 'Skill India' && a.type === 'Skill India'));
            if (!groupItems.length) return null;
            return (
              <section key={group} className="mb-10" aria-labelledby={`${group}-heading`}>
                <h2 id={`${group}-heading`} className="font-poppins font-bold text-lg text-navy dark:text-text-dark mb-4">
                  {group === 'Railway' ? '🚂' : group === 'PSU' ? '🏭' : group === 'Skill India' ? '🎯' : '🔩'} {group} Apprenticeship
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupItems.map(app => (
                    <article key={app.id} className="card p-5 flex flex-col gap-3">
                      <div>
                        <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark">{app.title}</h3>
                        <p className="text-text-muted dark:text-gray-400 text-xs mt-0.5">{app.organization}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-text-muted dark:text-gray-400">🔧 {app.trade}</p>
                        <p className="text-xs text-text-muted dark:text-gray-400">👥 {app.vacancies.toLocaleString('en-IN')} vacancies</p>
                        <p className="text-xs text-success font-medium">💰 {app.stipend}</p>
                        <p className="text-xs text-text-muted dark:text-gray-400">📋 {app.qualification}</p>
                      </div>
                      <a href={app.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 mt-auto">
                        Apply Now <ExternalLink size={12} />
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
