import { useState, useEffect } from 'react';
import { getLatestExams } from '../services/examsService.js';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const TABS = ['All', 'UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defence'];

export default function GovtExams() {
  useDocumentTitle('Government Exams');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    getLatestExams().then(res => {
      setItems(res.items || []);
    }).catch(() => {
      setItems([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filtered = activeTab === 'All' ? items : items.filter(e => e.category === activeTab);

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Govt Exams</span>
        </nav>
        <h1 className="section-title mb-1">📋 Government Exam Notifications</h1>
        <p className="section-subtitle mb-6">UPSC, SSC, Banking, Railway, State PSC & Defence exam updates</p>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 border-b border-card-border dark:border-gray-700">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              role="tab" aria-selected={activeTab === tab}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-accent'}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-text-muted py-10">No exams in this category yet. Check back soon.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(exam => (
              <article key={exam.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="badge-blue">{exam.category}</span>
                    <span className={`badge ${exam.status === 'active' ? 'badge-new' : 'badge-soon'}`}>{exam.status}</span>
                  </div>
                  <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark">{exam.examName}</h2>
                  <p className="text-text-muted dark:text-gray-400 text-sm">{exam.conductingBody} • {exam.vacancies?.toLocaleString('en-IN')} vacancies</p>
                </div>
                <div className="flex flex-col sm:items-end gap-1.5">
                  <p className="text-xs text-text-muted dark:text-gray-400">Apply: <span className="font-medium text-navy dark:text-text-dark">{formatDate(exam.applicationEnd)}</span></p>
                  {exam.examDate && exam.examDate !== 'To be announced' && (
                    <p className="text-xs text-text-muted dark:text-gray-400">Exam: <span className="font-medium text-navy dark:text-text-dark">{formatDate(exam.examDate)}</span></p>
                  )}
                  <Link to={`/jobs?category=${exam.category}`} className="btn-primary text-xs py-1.5 px-3 mt-1">Details →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
