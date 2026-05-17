import { useState, useEffect } from 'react';
import { getLatestNotifications } from '../services/notificationsService.js';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const TYPE_COLORS = {
  'New Recruitment': 'badge-new',
  'Deadline Reminder': 'badge-urgent',
  'Admit Card': 'badge-blue',
  'Result': 'badge-soon',
  'System': 'badge-blue',
};

export default function Notifications() {
  useDocumentTitle('Notifications');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestNotifications().then(res => {
      setNotifications(res.items || []);
    }).catch(() => {
      setNotifications([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-2" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Notifications</span>
            </nav>
            <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark flex items-center gap-2">
              <Bell size={22} className="text-accent" /> Notifications
              {unread > 0 && <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} new</span>}
            </h1>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-xs flex items-center gap-1.5 text-accent">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-text-muted py-10">No notifications yet. Check back later.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <Link
                key={n.id}
                to={n.link}
                onClick={() => markRead(n.id)}
                className={`block card px-5 py-4 transition-all hover:border-primary-200 dark:hover:border-primary-600 ${!n.isRead ? 'border-l-4 border-l-accent' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={TYPE_COLORS[n.type] || 'badge-blue'}>{n.type}</span>
                      <span className="text-xs text-text-muted dark:text-gray-400">{formatDateTime(n.date)}</span>
                    </div>
                    <p className={`text-sm font-medium ${!n.isRead ? 'text-navy dark:text-text-dark' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                    <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5 line-clamp-2">{n.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
