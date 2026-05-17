import { SearchX } from 'lucide-react'

export default function EmptyState({ title = 'No results found', message = 'Try adjusting your search or filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center mb-4">
        <SearchX size={28} className="text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">{title}</h3>
      <p className="text-sm text-muted mt-1 text-center max-w-sm">{message}</p>
    </div>
  )
}
