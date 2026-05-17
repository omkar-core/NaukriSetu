import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import api from '../services/api.js';
import NewsCard from '../components/ui/NewsCard.jsx';
import SkeletonCard from '../components/ui/SkeletonCard.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { formatDate, formatTime } from '../utils/formatDate.js';

const CATEGORY_FILTERS = ['All', 'Army and Defence', 'Railway', 'Banking', 'SSC and UPSC', 'Engineering PSU', 'Internship', 'Apprenticeship', 'State PSC', 'Teaching'];

export default function LiveNews() {
  useDocumentTitle('Live Recruitment News');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async (category = 'All', isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await api.get(`/news/live${params}`);
      setCards(res.data.cards || []);
      setLastUpdated(new Date());
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Unable to load live news right now. Please try again in a few minutes.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory, fetchNews]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  const handleRefresh = () => {
    fetchNews(activeCategory, true);
  };

  const recentHeadlines = cards.slice(0, 10).map(c => c.headline);

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <span className="text-navy dark:text-text-dark">Live Recruitment News</span>
        </nav>

        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-navy dark:text-text-dark flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse" />
              Live Recruitment News
            </h1>
            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
              Real government job news updated every hour from official and verified sources
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-outline text-sm px-4 py-2 hidden sm:flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {lastUpdated && (
          <p className="text-xs text-text-muted dark:text-gray-500 mb-4">
            Last updated: {formatTime(lastUpdated)} &middot; {formatDate(lastUpdated)}
          </p>
        )}

        {/* Live Ticker */}
        {recentHeadlines.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="flex items-center">
              <span className="flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
              <div className="overflow-hidden flex-1 py-2">
                <div className="whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
                  {recentHeadlines.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-2 mx-4 text-xs text-gray-600 dark:text-gray-400">
                      {h}
                      {i < recentHeadlines.length - 1 && <span className="text-gray-300 dark:text-gray-600">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
              aria-label={`Filter by ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard count={6} />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchNews(activeCategory)} />
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📰</p>
            <h3 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark mb-1">No News Articles Yet</h3>
            <p className="text-sm text-text-muted dark:text-gray-400 mb-4 max-w-md mx-auto">
              News articles are being fetched and processed from official sources. This section updates automatically every hour. Check back soon or click refresh to try now.
            </p>
            <button onClick={handleRefresh} className="btn-primary text-sm px-6 py-2.5">
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(card => (
              <NewsCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Refresh Button - mobile */}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-60 sm:hidden"
        aria-label="Refresh news"
      >
        <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
      </button>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
