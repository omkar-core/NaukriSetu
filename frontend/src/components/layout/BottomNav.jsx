import { NavLink } from 'react-router-dom';
import { Home, BriefcaseBusiness, GraduationCap, Bell, User } from 'lucide-react';

const BOTTOM_TABS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/jobs', icon: BriefcaseBusiness, label: 'Jobs' },
  { to: '/internships', icon: GraduationCap, label: 'Internships' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/login', icon: User, label: 'Account' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-card-dark border-t border-card-border dark:border-gray-700 lg:hidden safe-area-bottom"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {BOTTOM_TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-accent bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-400 dark:text-gray-500 hover:text-accent'
              }`
            }
            aria-label={tab.label}
          >
            {({ isActive }) => (
              <>
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
