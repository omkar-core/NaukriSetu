import { ExternalLink, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

const URGENCY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#2563EB',
};

export default function NewsCard({ card, className = '' }) {
  const { addToast } = useToast();
  const borderColor = URGENCY_COLORS[card.urgencyLevel] || URGENCY_COLORS.low;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.headline,
          text: card.englishSummary || card.headline,
          url: card.sourceUrl,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(card.sourceUrl);
        addToast('Link copied to clipboard!', 'success');
      } catch {
        addToast('Could not copy link', 'error');
      }
    }
  };

  return (
    <article
      className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 relative ${className}`}
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {/* LIVE ribbon - top right corner */}
      <div className="absolute top-0 right-0 z-10">
        <div className="bg-green-500 text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {card.category || 'Government'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {card.sourceName || 'News Source'}
          </span>
        </div>

        <h3 className="font-poppins font-bold text-sm sm:text-base text-navy dark:text-text-dark line-clamp-3 leading-snug">
          {card.headline}
        </h3>

        {card.englishSummary && (
          <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 font-inter leading-relaxed line-clamp-3">
            {card.englishSummary}
          </p>
        )}

        {card.hindiSummary && (
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-500 leading-relaxed line-clamp-2" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            {card.hindiSummary}
          </p>
        )}

        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span>📅 {formatDate(card.publishedAt)}</span>
          <span>🏢 {card.organization || card.sourceName}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          {card.officialApplyLink ? (
            <a
              href={card.officialApplyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors active:scale-95"
            >
              <ExternalLink size={13} />
              Apply Now
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
              Visit Official Portal
            </span>
          )}
          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95"
          >
            <ExternalLink size={13} />
            Read Full News
          </a>
          <button
            onClick={handleShare}
            className="ml-auto p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            aria-label="Share this news article"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
