import { Bookmark, BookmarkCheck, ExternalLink, Calendar, MapPin, GraduationCap, IndianRupee, Share2 } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { Link } from 'react-router-dom';
import { formatDate, getDaysLeft } from '../../utils/formatDate.js';

export default function JobCard({ job, className = '' }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(job.id);
  const daysLeft = getDaysLeft(job.lastDate);

  const tags = job.tags || [];

  const tagClass = {
    'NEW': 'badge-new',
    'URGENT': 'badge-urgent',
    'LAST DATE SOON': 'badge-soon',
  };

  return (
    <article className={`card p-5 flex flex-col gap-3 relative group animate-fade-in ${className}`}>
      {/* Left accent border on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.id}`} className="block">
            <h3 className="font-poppins font-semibold text-navy dark:text-text-dark text-sm md:text-base leading-snug line-clamp-2 hover:text-accent dark:hover:text-primary-400 transition-colors">
              {job.title}
            </h3>
          </Link>
          <p className="text-text-muted dark:text-gray-400 text-xs mt-1 font-medium">{job.organization}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {tags.map(tag => (
            <span key={tag} className={tagClass[tag] || 'badge-blue'}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-gray-400">
          <IndianRupee size={12} className="text-success flex-shrink-0" />
          <span className="truncate">{job.salary?.display || 'Not Specified'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-gray-400">
          <GraduationCap size={12} className="text-accent flex-shrink-0" />
          <span className="truncate">{Array.isArray(job.qualification) ? job.qualification[0] : job.qualification}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-gray-400">
          <MapPin size={12} className="text-purple-500 flex-shrink-0" />
          <span className="truncate">{Array.isArray(job.state) ? job.state[0] : job.state}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar size={12} className={`flex-shrink-0 ${daysLeft !== null && daysLeft <= 7 ? 'text-danger' : 'text-warning'}`} />
          <span className={`truncate font-medium ${daysLeft !== null && daysLeft <= 7 ? 'text-danger' : 'text-text-muted dark:text-gray-400'}`}>
            {daysLeft !== null && daysLeft <= 0 ? 'Closed' : `Last: ${formatDate(job.lastDate)}`}
          </span>
          {daysLeft !== null && daysLeft > 0 && (
            <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              daysLeft <= 3 ? 'bg-danger/10 text-danger' :
              daysLeft <= 7 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
              'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {daysLeft}d left
            </span>
          )}
        </div>
      </div>

      {/* Vacancy */}
      {job.vacancyCount > 0 && (
        <p className="text-xs text-text-muted dark:text-gray-500">
          <span className="font-semibold text-navy dark:text-text-dark">{job.vacancyCount.toLocaleString('en-IN')}</span> vacancies
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-card-border dark:border-gray-700">
        <a
          href={job.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 text-xs py-2"
          aria-label={`Apply for ${job.title}`}
        >
          <ExternalLink size={13} />
          Apply Now
        </a>
        <button
          onClick={() => {
            const text = `${job.title} - ${job.organization}\nApply: ${window.location.origin}/jobs/${job.id}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
          }}
          aria-label="Share on WhatsApp"
          className="p-2.5 rounded-lg border border-card-border dark:border-gray-600 text-gray-400 hover:text-green-500 hover:border-green-300 transition-all"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={() => toggleBookmark(job)}
          aria-label={saved ? 'Remove bookmark' : 'Save job'}
          aria-pressed={saved}
          className={`p-2.5 rounded-lg border transition-all duration-200 ${
            saved
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'border-card-border dark:border-gray-600 text-gray-400 hover:text-accent hover:border-accent/30'
          }`}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
    </article>
  );
}
