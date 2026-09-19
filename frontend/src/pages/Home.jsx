import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ChevronRight, Mail, ExternalLink, Zap } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce.js';
import { getLatestJobs, getMetadata } from '../services/jobsService.js';
import { getLiveNews } from '../services/newsService.js';
import { CATEGORIES, QUICK_FILTERS } from '../utils/constants.js';
import { getLatestInternships } from '../services/internshipsService.js';
import { getLatestApprenticeships } from '../services/apprenticeshipsService.js';
import { getLatestExams } from '../services/examsService.js';
import { getLatestAdmitCards } from '../services/admitCardsService.js';
import { getLatestResults } from '../services/resultsService.js';
import JobCard from '../components/ui/JobCard.jsx';
import NewsCard from '../components/ui/NewsCard.jsx';
import SkeletonCard from '../components/ui/SkeletonCard.jsx';
import CategoryCard from '../components/ui/CategoryCard.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import { formatDateShort } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function StatBadge({ value, label, icon }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/30">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-poppins font-bold text-white text-lg leading-none">{value}</p>
        <p className="text-white/80 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function InternshipCard({ item }) {
  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-primary-200 dark:hover:border-primary-600 group">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark group-hover:text-accent transition-colors line-clamp-2">{item.title}</h3>
          <p className="text-text-muted dark:text-gray-400 text-xs mt-0.5">{item.organization}</p>
        </div>
        {item.tags?.[0] && <span className="badge-new flex-shrink-0">{item.tags[0]}</span>}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
          <span>💰</span><span>{item.stipendDisplay || 'Stipend not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
          <span>⏱️</span><span>{item.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
          <span>🎓</span><span>{item.eligibility}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-card-border dark:border-gray-700">
        <span className="text-xs text-danger font-medium">📅 Last: {formatDateShort(item.lastDate)}</span>
        <a href={item.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-1.5 px-3">
          Apply <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  useDocumentTitle('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [meta, setMeta] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [newsCards, setNewsCards] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [apprenticeships, setApprenticeships] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [secLoading, setSecLoading] = useState({
    internships: true,
    apprenticeships: true,
    exams: true,
    results: true,
    admitCards: true,
  });
  const debouncedSearch = useDebounce(searchVal, 300);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    getMetadata().then(setMeta).catch(() => {});
    getLatestJobs(1, 12).then(data => {
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    }).catch(() => addToast('Unable to load latest jobs. Showing cached results.', 'error'))
      .finally(() => setLoading(false));

    getLiveNews('All').then(data => {
      setNewsCards(data.cards || []);
    }).catch(() => {}).finally(() => setNewsLoading(false));
  }, [addToast]);

  useEffect(() => {
    const fetchSections = async () => {
      const [iRes, aRes, eRes, rRes, acRes] = await Promise.all([
        getLatestInternships(),
        getLatestApprenticeships(),
        getLatestExams(),
        getLatestResults(),
        getLatestAdmitCards(),
      ]);
      setInternships(iRes.items || []);
      setApprenticeships(aRes.items || []);
      setExams(eRes.items || []);
      setResults(rRes.items || []);
      setAdmitCards(acRes.items || []);
      setSecLoading({
        internships: false,
        apprenticeships: false,
        exams: false,
        results: false,
        admitCards: false,
      });
    };
    fetchSections();
  }, []);

  useEffect(() => {
    if (!debouncedSearch) return;
    navigate(`/jobs?q=${encodeURIComponent(debouncedSearch)}`);
  }, [debouncedSearch, navigate]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await getLatestJobs(next, 12);
      setJobs(prev => [...prev, ...(data.jobs || [])]);
      setPage(next);
    } catch {
      addToast('Unable to load more jobs.', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    try {
      await api.post('/subscribe', { email });
      addToast('🎉 Subscribed! You will receive job alerts soon.', 'success');
      setEmail('');
    } catch {
      addToast('❌ Could not subscribe right now. Please try again later.', 'error');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen">

      {/* ═══════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-primary-800 via-accent to-primary-900 text-white overflow-hidden pt-28 pb-16">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6 border border-white/30">
              <Zap size={14} className="text-yellow-300" />
               Updated {meta?.lastUpdated ? new Date(meta.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'regularly'} from official sources
            </div>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-balance mb-6">
              Find Government Jobs, Internships & Apprenticeships{' '}
              <span className="text-yellow-300">Across India</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl mx-auto">
              Accurate. Updated Daily. Trusted by lakhs of job seekers. All from official government sources.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link to="/jobs" className="btn bg-white text-accent hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95">
                🔎 Latest Jobs
              </Link>
              <Link to="/internships" className="btn bg-white/20 hover:bg-white/30 border border-white/40 font-semibold px-6 py-3 rounded-xl text-sm backdrop-blur-sm transition-all duration-200">
                🎓 Explore Internships
              </Link>
              <Link to="/apprenticeship" className="btn bg-white/20 hover:bg-white/30 border border-white/40 font-semibold px-6 py-3 rounded-xl text-sm backdrop-blur-sm transition-all duration-200">
                🔧 Apprenticeships
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <StatBadge value={(meta?.totalJobs || 0).toLocaleString('en-IN')} label="Active Job Listings" icon="💼" />
              <StatBadge value={(meta?.totalInternships || 0).toLocaleString('en-IN')} label="Internships" icon="🎓" />
              <StatBadge value={(meta?.totalApprenticeships || 0).toLocaleString('en-IN')} label="Apprenticeships" icon="🔧" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SEARCH BAR
      ═══════════════════════════════════ */}
      <section className="bg-white dark:bg-dark-card border-b border-card-border dark:border-gray-700 sticky top-16 z-30 shadow-sm" aria-label="Job search">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search by job title, organisation, state, qualification..."
                className="input pl-11 py-3.5 text-sm"
                maxLength={100}
                aria-label="Search government jobs"
              />
            </div>
            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {QUICK_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => { setActiveFilter(f); navigate(f === 'All' ? '/jobs' : `/jobs?category=${f}`); }}
                  className={activeFilter === f ? 'filter-chip-active whitespace-nowrap' : 'filter-chip-inactive whitespace-nowrap'}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* ═══════════════════════════════════
            CATEGORY CARDS
        ═══════════════════════════════════ */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="categories-heading" className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Explore jobs across all government departments</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <CategoryCard key={cat.id} cat={{ ...cat, count: meta?.categoryCounts?.[cat.id] || 0 }} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════
            LATEST JOBS
        ═══════════════════════════════════ */}
        <section aria-labelledby="latest-jobs-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="latest-jobs-heading" className="section-title">Latest Government Job Notifications</h2>
              <p className="section-subtitle">
                {loading ? 'Loading...' : `${total.toLocaleString('en-IN')} jobs found • Updated today`}
              </p>
            </div>
            <Link to="/jobs" className="btn-outline text-sm hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? <SkeletonCard count={12} /> : jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>

          {!loading && jobs.length < total && (
            <div className="text-center mt-8">
              <button onClick={loadMore} disabled={loadingMore} className="btn-outline px-8 py-3">
                {loadingMore ? 'Loading...' : `Load More Jobs (${(total - jobs.length).toLocaleString('en-IN')} remaining)`}
              </button>
            </div>
          )}

          <div className="mt-4 sm:hidden text-center">
            <Link to="/jobs" className="btn-outline text-sm">View All Jobs <ArrowRight size={16} /></Link>
          </div>
        </section>

        {/* ═══════════════════════════════════
            INTERNSHIPS
        ═══════════════════════════════════ */}
        <section aria-labelledby="internships-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="internships-heading" className="section-title">🎓 Latest Internships</h2>
              <p className="section-subtitle">ISRO, DRDO, IITs, PSUs & AICTE recognised opportunities</p>
            </div>
            <Link to="/internships" className="btn-outline text-sm hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {secLoading.internships ? (
              <SkeletonCard count={6} />
            ) : internships.length > 0 ? (
              internships.slice(0, 6).map(item => <InternshipCard key={item.id} item={item} />)
            ) : (
              <p className="text-sm text-text-muted dark:text-gray-400 col-span-3 text-center py-8">
                No internships available right now.
              </p>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════
            APPRENTICESHIPS (Horizontal Scroll)
        ═══════════════════════════════════ */}
        <section aria-labelledby="apprenticeship-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="apprenticeship-heading" className="section-title">🔧 Apprenticeship Openings</h2>
              <p className="section-subtitle">Railway, PSU, Govt Factory & Skill India programmes</p>
            </div>
            <Link to="/apprenticeship" className="btn-outline text-sm hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {secLoading.apprenticeships ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5 flex-shrink-0 w-72">
                  <div className="space-y-3">
                    <div className="skeleton h-5 w-16 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-3 w-3/4 rounded" />
                    <div className="skeleton h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : apprenticeships.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {apprenticeships.map(app => (
                <div key={app.id} className="card p-5 flex-shrink-0 w-72">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge-blue`}>{app.type}</span>
                    <span className="text-xs text-text-muted dark:text-gray-400">{app.vacancies.toLocaleString('en-IN')} seats</span>
                  </div>
                  <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark mb-1">{app.title}</h3>
                  <p className="text-xs text-text-muted dark:text-gray-400 mb-3">{app.organization}</p>
                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs"><span className="text-warning">🔧</span> {app.trade}</p>
                    <p className="text-xs"><span className="text-success">💰</span> {app.stipend}</p>
                    <p className="text-xs"><span className="text-accent">📋</span> {app.qualification} required</p>
                  </div>
                  <a href={app.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 w-full">
                    Apply Now <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted dark:text-gray-400 text-center py-8">
              No apprenticeship openings available right now.
            </p>
          )}
        </section>

        {/* ═══════════════════════════════════
            EXAM UPDATES + RESULTS/ADMIT CARDS
        ═══════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Exam Updates */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-xl">📋 Exam Notifications</h2>
              <Link to="/exams" className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="card overflow-hidden">
              {secLoading.exams ? (
                <div className="p-5 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                  ))}
                </div>
              ) : exams.length > 0 ? (
                exams.slice(0, 5).map((exam, i) => (
                  <div key={exam.id} className={`px-5 py-4 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${i !== 0 ? 'border-t border-card-border dark:border-gray-700' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-navy dark:text-text-dark truncate">{exam.examName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted dark:text-gray-400">{exam.conductingBody}</span>
                        {exam.vacancies && <span className="text-xs text-success font-medium">{exam.vacancies.toLocaleString('en-IN')} seats</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-danger font-medium">Apply by: {formatDateShort(exam.applicationEnd)}</p>
                      <Link to={`/exams`} className="text-xs text-accent hover:underline mt-0.5 inline-block">Details →</Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted dark:text-gray-400 text-center py-8">
                  No exam notifications available right now.
                </p>
              )}
            </div>
          </div>

          {/* Results + Admit Cards Side Panels */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-poppins font-bold text-lg text-navy dark:text-text-dark">📊 Recent Results</h2>
                <Link to="/results" className="text-accent text-xs font-medium hover:underline">All →</Link>
              </div>
              <div className="card overflow-hidden">
                {secLoading.results ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-3 w-1/3 rounded" />
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  results.map((r, i) => (
                    <div key={r.id} className={`px-4 py-3 ${i !== 0 ? 'border-t border-card-border dark:border-gray-700' : ''}`}>
                      <p className="text-sm font-medium text-navy dark:text-text-dark truncate">{r.examName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs font-medium ${r.status === 'declared' ? 'text-success' : 'text-warning'}`}>
                          {r.status === 'declared' ? '✅ Declared' : '⏳ Expected'}
                        </span>
                        <a href={r.resultLink} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">View</a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted dark:text-gray-400 text-center py-8">
                    No results available right now.
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-poppins font-bold text-lg text-navy dark:text-text-dark">🎫 Admit Cards</h2>
                <Link to="/admit-card" className="text-accent text-xs font-medium hover:underline">All →</Link>
              </div>
              <div className="card overflow-hidden">
                {secLoading.admitCards ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-3 w-1/3 rounded" />
                      </div>
                    ))}
                  </div>
                ) : admitCards.length > 0 ? (
                  admitCards.map((ac, i) => (
                    <div key={ac.id} className={`px-4 py-3 ${i !== 0 ? 'border-t border-card-border dark:border-gray-700' : ''}`}>
                      <p className="text-sm font-medium text-navy dark:text-text-dark truncate">{ac.examName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-text-muted dark:text-gray-400">Exam: {formatDateShort(ac.examDate)}</span>
                        <a href={ac.downloadLink} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Download</a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted dark:text-gray-400 text-center py-8">
                    No admit cards available right now.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════
            LIVE NEWS CARDS
        ═══════════════════════════════════ */}
        <section aria-labelledby="live-news-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="live-news-heading" className="section-title">📰 Live Recruitment News</h2>
              <p className="section-subtitle">Real government job news from verified sources</p>
            </div>
            <Link to="/live-news" className="btn-outline text-sm hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsLoading ? (
              <SkeletonCard count={3} />
            ) : newsCards.length > 0 ? (
              newsCards.slice(0, 6).map(card => (
                <NewsCard key={card.id} card={card} />
              ))
            ) : (
              <p className="text-sm text-text-muted dark:text-gray-400 col-span-3 text-center py-8">
                No news articles yet. News is fetched every hour from official sources.
              </p>
            )}
          </div>
          <div className="mt-4 sm:hidden text-center">
            <Link to="/live-news" className="btn-outline text-sm">View All News <ArrowRight size={16} /></Link>
          </div>
        </section>

        {/* ═══════════════════════════════════
            NEWSLETTER SUBSCRIPTION
        ═══════════════════════════════════ */}
        <section className="bg-gradient-to-r from-primary-800 to-accent rounded-2xl p-8 text-white text-center" aria-labelledby="subscribe-heading">
          <div className="max-w-xl mx-auto">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} />
            </div>
            <h2 id="subscribe-heading" className="font-poppins font-bold text-2xl mb-2">Get Free Job Alerts</h2>
            <p className="text-white/80 text-sm mb-6">Enter your email to receive daily government job notifications. No spam. No personal data sold. Unsubscribe anytime.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                aria-label="Email address for job alerts"
              />
              <button type="submit" disabled={subLoading} className="btn bg-white text-accent hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 active:scale-95">
                {subLoading ? 'Subscribing...' : '🔔 Subscribe Free'}
              </button>
            </form>
            <p className="text-white/60 text-xs mt-3">
              📧 We only send government job alerts. Your email will never be sold or shared.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
