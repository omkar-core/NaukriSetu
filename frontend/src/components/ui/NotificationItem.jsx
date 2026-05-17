import { Link } from 'react-router-dom'
import { Bell, Briefcase, Calendar, FileText, Award, RefreshCw } from 'lucide-react'
import { formatDate } from '../../utils/formatDate.js'

const typeIcons = {
  job: Briefcase,
  exam: Calendar,
  'admit-card': FileText,
  result: Award,
  internship: RefreshCw,
  update: Bell,
}

export default function NotificationItem({ notification }) {
  const Icon = typeIcons[notification.type] || Bell
  const timeAgo = getTimeAgo(new Date(notification.date))

  return (
    <Link
      to={notification.link}
      className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${notification.read ? '' : 'bg-accent-light/50 dark:bg-accent/10'} hover:bg-gray-50 dark:hover:bg-dark-border`}
    >
      <div className={`p-2 rounded-lg ${notification.read ? 'bg-gray-100 dark:bg-dark-border' : 'bg-accent-light dark:bg-accent/20'}`}>
        <Icon size={16} className={notification.read ? 'text-muted' : 'text-accent'} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm ${notification.read ? 'text-muted' : 'text-text-primary dark:text-dark-text font-semibold'}`}>{notification.title}</h4>
        <p className="text-xs text-muted mt-0.5 line-clamp-1">{notification.message}</p>
        <span className="text-[11px] text-muted mt-1 block">{timeAgo}</span>
      </div>
      {!notification.read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />}
    </Link>
  )
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}
