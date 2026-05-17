import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted mb-4">
      <Link to="/" className="hover:text-accent transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-muted" />
          {i === items.length - 1 ? (
            <span className="text-text-primary dark:text-dark-text font-medium">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-accent transition-colors">{item.label}</Link>
          )}
        </span>
      ))}
    </nav>
  )
}
