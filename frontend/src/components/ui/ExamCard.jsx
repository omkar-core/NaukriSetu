import { Calendar, FileText, Banknote } from 'lucide-react'
import { formatDate } from '../../utils/formatDate.js'

const typeColors = {
  UPSC: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  SSC: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  Banking: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  Railway: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  Teaching: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
  'State PSC': 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  Engineering: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  Medical: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  Law: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  Defence: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
}

export default function ExamCard({ exam }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-card-border dark:border-dark-border p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary dark:text-dark-text font-semibold text-base">{exam.title}</h3>
          <p className="text-muted text-xs mt-0.5">{exam.conductingBody}</p>
        </div>
        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${typeColors[exam.type] || 'bg-gray-50 text-gray-600'}`}>{exam.type}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1"><Calendar size={12} />Exam: {formatDate(exam.examDate)}</span>
        <span className="flex items-center gap-1"><FileText size={12} />Apply by: {formatDate(exam.lastDate)}</span>
        {exam.vacancies > 0 && <span className="flex items-center gap-1"><Banknote size={12} />{exam.vacancies.toLocaleString('en-IN')} Vacancies</span>}
      </div>

      <p className="mt-3 text-sm text-muted line-clamp-2">{exam.description}</p>

      <div className="mt-3 text-xs text-muted">
        Fee: {exam.applicationFee}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
          View Details
        </button>
        <button className="px-4 py-2 border border-card-border dark:border-dark-border text-text-primary dark:text-dark-text text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
          Notification
        </button>
      </div>
    </div>
  )
}
