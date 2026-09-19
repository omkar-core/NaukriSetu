import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Bell, Settings, LogOut, ExternalLink, BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { signOut } from '../services/authService.js';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate, getDaysLeft } from '../utils/formatDate.js';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BriefcaseBusiness },
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
  { id: 'alerts', label: 'Job Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard() {
  useDocumentTitle('My Dashboard');
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    addToast('You have been signed out.', 'info');
    navigate('/', { replace: true });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = userData?.displayName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'User';
  const savedJobs = userData?.savedJobs || [];
  const preferences = userData?.preferences || { categories: [], state: '', qualification: '' };
  const createdAt = userData?.createdAt?.toDate ? formatDate(userData.createdAt.toDate()) : 'Recently';

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-poppins font-bold text-xl">
                {firstName[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="font-poppins font-bold text-xl text-navy dark:text-text-dark">
                  Hi, {firstName}!
                </h1>
                <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">
                  Member since {createdAt} &middot; {user.email}
                </p>
                {!user.emailVerified && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <span className="text-[10px] text-yellow-700 dark:text-yellow-400 font-medium">
                      Please verify your email to receive job alerts
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-500 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-200 transition-colors"
            >
              <LogOut size={14} />
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="font-poppins font-bold text-lg text-navy dark:text-text-dark">{savedJobs.length}</p>
              <p className="text-[10px] text-text-muted dark:text-gray-400">Saved Jobs</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="font-poppins font-bold text-lg text-navy dark:text-text-dark">{preferences.categories?.length || 0}</p>
              <p className="text-[10px] text-text-muted dark:text-gray-400">Categories</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="font-poppins font-bold text-lg text-navy dark:text-text-dark">{preferences.state || 'All India'}</p>
              <p className="text-[10px] text-text-muted dark:text-gray-400">Location</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar Tabs */}
          <div className="lg:w-48 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h2 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark">Dashboard Overview</h2>

                {/* Saved Jobs Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark">
                      Recently Saved Jobs
                    </h3>
                    <button onClick={() => setActiveTab('saved')} className="text-xs text-accent hover:underline">View All</button>
                  </div>
                  {savedJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">&#128278;</p>
                      <p className="text-sm text-text-muted dark:text-gray-400">No saved jobs yet.</p>
                      <Link to="/jobs" className="text-xs text-accent hover:underline mt-1 inline-block">Browse Jobs</Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedJobs.slice(0, 5).map(job => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-navy dark:text-text-dark truncate">{job.title}</p>
                            <p className="text-xs text-text-muted dark:text-gray-400">{job.organization}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            {getDaysLeft(job.lastDate) !== null && (
                              <span className={`text-[10px] font-medium ${getDaysLeft(job.lastDate) <= 7 ? 'text-danger' : 'text-warning'}`}>
                                {getDaysLeft(job.lastDate) > 0 ? `${getDaysLeft(job.lastDate)}d left` : 'Closed'}
                              </span>
                            )}
                            <Link to={`/jobs/${job.id}`} className="text-accent hover:underline" aria-label="View job details">
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preferences Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <h3 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark mb-3">Your Job Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Categories</p>
                      <div className="flex flex-wrap gap-1">
                        {preferences.categories?.length > 0 ? preferences.categories.map(c => (
                          <span key={c} className="px-2 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">{c}</span>
                        )) : <span className="text-xs text-gray-400">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">State</p>
                      <p className="text-xs text-navy dark:text-text-dark">{preferences.state || 'All India'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Qualification</p>
                      <p className="text-xs text-navy dark:text-text-dark">{preferences.qualification || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark mb-4">Saved Jobs</h2>
                {savedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">&#128278;</p>
                    <p className="text-sm text-text-muted dark:text-gray-400 mb-2">You have not saved any jobs yet.</p>
                    <Link to="/jobs" className="btn-primary text-sm px-5 py-2.5">Browse Jobs</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedJobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-navy dark:text-text-dark hover:text-accent truncate block">{job.title}</Link>
                          <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">{job.organization}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {job.category && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">{job.category}</span>}
                            {job.lastDate && <span className={`text-[10px] ${getDaysLeft(job.lastDate) <= 7 ? 'text-danger' : 'text-gray-400'}`}>Last: {formatDate(job.lastDate)}</span>}
                          </div>
                        </div>
                        <Link to={`/jobs/${job.id}`} className="ml-3 text-accent hover:underline flex-shrink-0" aria-label="View job">
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark mb-4">Job Alert Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-text-dark mb-2">Preferred Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {['Railway', 'Banking', 'Defence', 'Engineering PSU', 'Teaching', 'Police', 'UPSC', 'SSC', 'State PSC', 'Internship', 'Apprenticeship'].map(cat => (
                        <span key={cat} className={`px-3 py-1.5 text-xs rounded-full border ${preferences.categories?.includes(cat) ? 'bg-accent text-white border-accent' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'}`}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-text-dark mb-2">Preferred State</label>
                    <p className="text-sm text-text-muted dark:text-gray-400">{preferences.state || 'All India (no state filter)'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy dark:text-text-dark mb-2">Qualification</label>
                    <p className="text-sm text-text-muted dark:text-gray-400">{preferences.qualification || 'Not specified'}</p>
                  </div>
                  <p className="text-xs text-text-muted dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                    Alert preferences can be updated from the settings page soon.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <h2 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Name</label>
                      <p className="text-sm text-navy dark:text-text-dark">{userData?.displayName || user.displayName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Email</label>
                      <p className="text-sm text-navy dark:text-text-dark">{user.email}</p>
                      {!user.emailVerified && (
                        <p className="text-xs text-yellow-600 mt-1">Email not verified. Check your inbox for the verification link.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Member Since</label>
                      <p className="text-sm text-navy dark:text-text-dark">{createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
