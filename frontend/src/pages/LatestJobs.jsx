import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { searchJobs } from '../services/jobsService.js';
import { STATES, QUALIFICATIONS } from '../utils/constants.js';
import JobCard from '../components/ui/JobCard.jsx';
import SkeletonCard from '../components/ui/SkeletonCard.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../context/ToastContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const CATEGORIES_FILTER = ['All', 'Railway', 'Banking', 'Defence', 'Engineering PSU', 'Teaching', 'Police', 'SSC', 'UPSC', 'State PSC'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Last Date (Asc)', value: 'lastdate' },
  { label: 'Salary: High to Low', value: 'salary' },
  { label: 'Most Viewed', value: 'views' },
];
const QUERY_LIMIT = 12;

function ActiveChip({ label, onRemove }) {
  return (
    <span className="filter-chip-active">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}><X size={12} /></button>
    </span>
  );
}

function FilterPanel({ filters, setFilter, activeFilters, clearAll }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark mb-3">Category</h3>
        <div className="space-y-1.5">
          {CATEGORIES_FILTER.map(c => (
            <button key={c} onClick={() => setFilter('category', c === 'All' ? '' : c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === c || (c === 'All' && !filters.category) ? 'bg-primary-50 dark:bg-primary-900/20 text-accent font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-card-border dark:border-gray-700 pt-4">
        <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark mb-3">State</h3>
        <select value={filters.state} onChange={e => setFilter('state', e.target.value)}
          className="input text-sm py-2">
          <option value="">All States</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="border-t border-card-border dark:border-gray-700 pt-4">
        <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark mb-3">Qualification</h3>
        <select value={filters.qualification} onChange={e => setFilter('qualification', e.target.value)}
          className="input text-sm py-2">
          <option value="">Any Qualification</option>
          {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>
      {(activeFilters.length > 0) && (
        <button onClick={clearAll} className="btn-outline w-full text-sm py-2 text-danger border-danger/30 hover:bg-danger/5">
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function LatestJobs() {
  useDocumentTitle('Latest Government Jobs');
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('newest');
  const { addToast } = useToast();

  // Filters
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    state: searchParams.get('state') || '',
    qualification: searchParams.get('qualification') || '',
    q: searchParams.get('q') || '',
  });
  const debouncedQ = useDebounce(filters.q, 300);

  const buildParams = useCallback((p) => {
    const params = { sort, page: p, limit: QUERY_LIMIT };
    if (debouncedQ) params.q = debouncedQ;
    if (filters.category) params.category = filters.category;
    if (filters.state) params.state = filters.state;
    if (filters.qualification) params.qualification = filters.qualification;
    return params;
  }, [sort, debouncedQ, filters.category, filters.state, filters.qualification]);

  useEffect(() => {
    let active = true;
    searchJobs(debouncedQ, buildParams(1))
      .then(data => {
        if (!active) return;
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
        setPage(1);
      })
      .catch(() => {
        if (!active) return;
        setJobs([]);
        setTotal(0);
        addToast('Failed to load jobs. Please try again.', 'error');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [buildParams, debouncedQ, addToast]);

  const setFilter = (key, val) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, [key]: val }));
  };
  const clearFilter = (key) => setFilter(key, '');
  const clearAll = () => {
    setLoading(true);
    setFilters({ category: '', state: '', qualification: '', q: '' });
  };

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'q').map(([k, v]) => ({ key: k, label: `${k}: ${v}` }));

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await searchJobs(debouncedQ, buildParams(next));
      setJobs(prev => [...prev, ...(data.jobs || [])]);
      setPage(next);
    } catch { addToast('Could not load more jobs.', 'error'); }
    finally { setLoadingMore(false); }
  };

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* Page Header */}
      <div className="bg-white dark:bg-card-dark border-b border-card-border dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <span className="text-navy dark:text-text-dark font-medium">Latest Jobs</span>
          </nav>
          <h1 className="font-poppins font-bold text-2xl md:text-3xl text-navy dark:text-text-dark">Latest Government Jobs</h1>
          <p className="text-text-muted dark:text-gray-400 text-sm mt-1">{loading ? 'Loading...' : `${total.toLocaleString('en-IN')} job notifications found`}</p>

          {/* Search + Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              value={filters.q}
              onChange={e => setFilter('q', e.target.value)}
              placeholder="Search by job title, organisation..."
              className="input flex-1 text-sm py-2.5"
              maxLength={100}
              aria-label="Search jobs"
            />
            <select value={sort} onChange={e => setSort(e.target.value)} className="input w-full sm:w-56 text-sm py-2.5" aria-label="Sort jobs">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-text-muted dark:text-gray-400">Active filters:</span>
              {activeFilters.map(f => <ActiveChip key={f.key} label={f.label} onRemove={() => clearFilter(f.key)} />)}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-accent" /> Filters
              </h2>
              <FilterPanel filters={filters} setFilter={setFilter} activeFilters={activeFilters} clearAll={clearAll} />
            </div>
          </aside>

          {/* Job Listing */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button onClick={() => setShowFilters(!showFilters)} className="btn-outline text-sm gap-2">
                <Filter size={16} /> Filters {activeFilters.length > 0 && <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
              </button>
            </div>

            {/* Mobile Filter Drawer */}
            {showFilters && (
              <div className="lg:hidden mb-6 card p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-navy dark:text-text-dark">Filters</span>
                  <button onClick={() => setShowFilters(false)} className="btn-ghost p-1" aria-label="Close filter"><X size={16} /></button>
                </div>
                <FilterPanel filters={filters} setFilter={setFilter} activeFilters={activeFilters} clearAll={clearAll} />
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <SkeletonCard count={12} />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-poppins font-semibold text-xl text-navy dark:text-text-dark mb-2">No jobs found</h3>
                <p className="text-text-muted dark:text-gray-400 text-sm mb-4">Try removing some filters or searching with different keywords</p>
                <button onClick={clearAll} className="btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
                {jobs.length < total && (
                  <div className="text-center mt-8">
                    <button onClick={loadMore} disabled={loadingMore} className="btn-outline px-8 py-3">
                      {loadingMore ? 'Loading...' : `Load More (${(total - jobs.length).toLocaleString('en-IN')} remaining)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}