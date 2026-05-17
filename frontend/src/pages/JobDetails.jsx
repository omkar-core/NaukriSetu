import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Download, Share2, Flag, Bookmark, BookmarkCheck, Calendar, Users, IndianRupee, GraduationCap, MapPin, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { getJobById } from '../services/jobsService.js';
import JobCard from '../components/ui/JobCard.jsx';
import { useBookmarks } from '../context/BookmarkContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function InfoRow({ icon: Icon, label, value, color = 'text-accent' }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-card-border dark:border-gray-700 last:border-0">
      <Icon size={16} className={`${color} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-muted dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-navy dark:text-text-dark font-medium mt-0.5">{value || 'Not Specified'}</p>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { addToast } = useToast();
  const saved = job ? isBookmarked(job.id) : false;
  useDocumentTitle(job?.title || 'Job Details');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getJobById(id)
      .then(data => setJob(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({ title: job.title, url: window.location.href });
    } catch {
      navigator.clipboard?.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'success');
    }
  };

  const handleReport = () => {
    addToast('Thank you! Error report submitted for admin review.', 'success');
  };

  if (loading) {
    return (
      <main className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6 space-y-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-32 w-full rounded" />
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="pt-20 text-center py-20">
        <p className="text-5xl mb-4">😔</p>
        <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark mb-2">Job Not Found</h1>
        <p className="text-text-muted mb-6">This listing may have expired or been removed.</p>
        <Link to="/jobs" className="btn-primary">Browse Latest Jobs</Link>
      </main>
    );
  }

  const relatedJobs = [];

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link>
          <ChevronRight size={12} />
          <Link to="/jobs" className="hover:text-accent">Jobs</Link>
          <ChevronRight size={12} />
          <span className="text-navy dark:text-text-dark font-medium truncate">{job.title}</span>
        </nav>

        {/* Job Header Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {(job.tags || []).map(tag => (
                  <span key={tag} className={tag === 'NEW' ? 'badge-new' : tag === 'URGENT' ? 'badge-urgent' : 'badge-soon'}>{tag}</span>
                ))}
                <span className="badge-blue">{job.category}</span>
              </div>
              <h1 className="font-poppins font-bold text-xl md:text-2xl text-navy dark:text-text-dark mb-2">{job.title}</h1>
              <p className="text-text-muted dark:text-gray-400 font-medium">{job.organization}</p>
              <p className="text-xs text-text-muted dark:text-gray-500 mt-1">Source: <a href={job.officialLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{job.source}</a></p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggleBookmark(job)}
                className={`p-2.5 rounded-lg border transition-all ${saved ? 'bg-accent/10 border-accent/30 text-accent' : 'border-card-border dark:border-gray-600 text-gray-400 hover:text-accent'}`}
                aria-label={saved ? 'Remove bookmark' : 'Save job'}>
                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
              <button onClick={handleShare} className="p-2.5 rounded-lg border border-card-border dark:border-gray-600 text-gray-400 hover:text-accent transition-colors" aria-label="Share job">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-card-border dark:border-gray-700">
            {[
              { icon: IndianRupee, label: 'Salary', value: job.salary?.display, color: 'text-success' },
              { icon: Users, label: 'Vacancies', value: job.vacancyCount ? job.vacancyCount.toLocaleString('en-IN') : 'Not Disclosed', color: 'text-accent' },
              { icon: GraduationCap, label: 'Qualification', value: Array.isArray(job.qualification) ? job.qualification.join(', ') : job.qualification, color: 'text-purple-500' },
              { icon: MapPin, label: 'Location', value: Array.isArray(job.state) ? job.state.join(', ') : job.state, color: 'text-warning' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-text-muted dark:text-gray-400">{stat.label}</p>
                  <p className="text-xs font-semibold text-navy dark:text-text-dark leading-snug">{stat.value || 'Not Specified'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <a href={job.officialLink} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 py-3">
              <ExternalLink size={16} /> Apply on Official Website
            </a>
            {job.pdfLink && (
              <a href={job.pdfLink} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 py-3">
                <Download size={16} /> Download Notification PDF
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-5">

            {/* AI Summary */}
            {job.summary && (
              <div className="card p-5">
                <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-3 flex items-center gap-2">
                  ✨ Quick Summary
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{job.summary}</p>
              </div>
            )}

            {/* Vacancy Breakdown */}
            <div className="card p-5">
              <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-4 flex items-center gap-2">
                <Users size={18} className="text-accent" /> Vacancy Details
              </h2>
              <div className="grid grid-cols-5 gap-2">
                {['UR/General', 'OBC', 'SC', 'ST', 'EWS'].map(cat => (
                  <div key={cat} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="font-poppins font-bold text-lg text-navy dark:text-text-dark">—</p>
                    <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">{cat}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted dark:text-gray-400 mt-3">* Refer to official notification for category-wise vacancy breakup</p>
            </div>

            {/* Important Dates */}
            <div className="card p-5">
              <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-accent" /> Important Dates
              </h2>
              <div className="divide-y divide-card-border dark:divide-gray-700">
                {[
                  { label: 'Notification Date', value: job.postingDate ? formatDate(job.postingDate) : 'Not Specified' },
                  { label: 'Application Last Date', value: job.lastDate ? formatDate(job.lastDate) : 'Not Announced' },
                  { label: 'Exam Date', value: 'Refer to official notification' },
                  { label: 'Result Date', value: job.resultDate ? formatDate(job.resultDate) : 'Not Announced' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-text-muted dark:text-gray-400">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.label.includes('Last') ? 'text-danger' : 'text-navy dark:text-text-dark'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Process */}
            <div className="card p-5">
              <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-4">📝 Selection Process</h2>
              <div className="flex items-center gap-0 overflow-x-auto no-scrollbar pb-2">
                {['Written Exam', 'Physical Test', 'Document Verification', 'Medical Test'].map((step, i) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 border-2 border-accent flex items-center justify-center text-accent font-bold text-xs">{i + 1}</div>
                      <p className="text-xs text-navy dark:text-text-dark font-medium mt-2 text-center max-w-[70px] leading-tight">{step}</p>
                    </div>
                    {i < 3 && <div className="w-8 h-0.5 bg-card-border dark:bg-gray-700 flex-shrink-0 -mt-5 mx-1" />}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5">
              <InfoRow icon={GraduationCap} label="Qualification" value={Array.isArray(job.qualification) ? job.qualification.join(', ') : job.qualification} />
              <InfoRow icon={Users} label="Age Limit" value="Refer to official notification" color="text-warning" />
              <InfoRow icon={IndianRupee} label="Salary / Pay Scale" value={job.salary?.display} color="text-success" />
              <InfoRow icon={MapPin} label="Job Location" value={Array.isArray(job.state) ? job.state.join(', ') : job.state} color="text-purple-500" />
              <InfoRow icon={Clock} label="Last Updated" value={formatDate(job.postingDate)} color="text-text-muted" />
            </div>

            {/* Report Error */}
            <div className="card p-4">
              <button onClick={handleReport} className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400 hover:text-danger transition-colors w-full">
                <Flag size={14} />
                <span>Report incorrect information</span>
              </button>
            </div>

            {/* Official Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Always verify details from the official website before applying. NaukriSetu is not responsible for any changes in official notifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="mt-10" aria-labelledby="related-jobs">
            <h2 id="related-jobs" className="section-title mb-5">Related Jobs in {job.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedJobs.map(j => <JobCard key={j.id} job={j} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
