import { useLocation, Link } from 'react-router-dom'
import { Briefcase, BookOpen, GraduationCap, Bell, User, Home } from 'lucide-react'

const tabs = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Jobs', path: '/jobs', icon: Briefcase },
  { label: 'Internships', path: '/internships', icon: BookOpen },
  { label: 'Exams', path: '/exams', icon: GraduationCap },
  { label: 'Account', path: '/about', icon: User },
]

export default function MobileNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-card-border dark:border-dark-border z-50 sm:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path))
          const Icon = tab.icon
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0 ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <Icon size={18} className={isActive ? 'fill-accent/20' : ''} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
