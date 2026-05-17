import { MapPin, Clock, IndianRupee } from 'lucide-react'
import { formatDate } from '../../utils/formatDate.js'

export default function ApprenticeshipCard({ apprenticeship }) {
  return (
    <div className="min-w-[300px] bg-white dark:bg-dark-card rounded-xl border border-card-border dark:border-dark-border p-5 hover:shadow-lg transition-all duration-200 flex-shrink-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 font-heading font-bold text-sm">
          {apprenticeship.organization.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="text-text-primary dark:text-dark-text font-semibold text-sm">{apprenticeship.title}</h3>
          <p className="text-muted text-xs mt-0.5">{apprenticeship.organization}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1"><MapPin size={12} />{apprenticeship.location}</span>
        <span className="flex items-center gap-1"><Clock size={12} />{apprenticeship.duration}</span>
        <span className="flex items-center gap-1"><IndianRupee size={12} />{apprenticeship.stipend}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-card-border dark:border-dark-border pt-3">
        <span className="text-xs text-muted">Due: {formatDate(apprenticeship.lastDate)}</span>
        <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
          Apply
        </button>
      </div>
    </div>
  )
}
