import { MapPin, Clock, IndianRupee } from 'lucide-react'
import { formatDate } from '../../utils/formatDate.js'

export default function InternshipCard({ internship }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-card-border dark:border-dark-border p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400 font-heading font-bold text-sm">
          {internship.organization.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-text-primary dark:text-dark-text font-semibold text-base">{internship.title}</h3>
          <p className="text-muted text-xs mt-0.5">{internship.organization}</p>
        </div>
        {internship.tags?.includes('URGENT') && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger text-white flex-shrink-0">URGENT</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1"><MapPin size={12} />{internship.location}</span>
        <span className="flex items-center gap-1"><Clock size={12} />{internship.duration}</span>
        <span className="flex items-center gap-1"><IndianRupee size={12} />{internship.stipend}</span>
      </div>

      <p className="mt-3 text-sm text-muted line-clamp-2">{internship.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-card-border dark:border-dark-border pt-3">
        <span className="text-xs text-muted">Due: {formatDate(internship.lastDate)}</span>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  )
}
