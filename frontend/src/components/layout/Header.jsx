import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Bell, Menu, X, Bookmark, LogIn, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBookmarks } from '../../context/BookmarkContext.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Latest Jobs' },
  { to: '/internships', label: 'Internships' },
  { to: '/apprenticeship', label: 'Apprenticeship' },
  { to: '/live-news', label: 'Live News' },
  { to: '/exams', label: 'Govt Exams' },
  { to: '/results', label: 'Results' },
  { to: '/admit-card', label: 'Admit Card' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { bookmarkCount } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <>
      {/* Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'header-glass shadow-glass' : 'bg-white dark:bg-bg-dark border-b border-card-border dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group" aria-label="NaukriSetu Home">
              <span className="font-poppins font-bold text-xl text-accent group-hover:text-primary-700 transition-colors">
                Naukri<span className="text-navy dark:text-text-dark">Setu</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.slice(0, 8).map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `nav-link text-xs font-medium ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Desktop Search */}
              <div className="hidden md:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      ref={searchRef}
                      value={searchVal}
                      onChange={e => setSearchVal(e.target.value)}
                      placeholder="Search jobs, orgs, states..."
                      className="w-48 lg:w-64 px-3 py-1.5 text-sm border border-card-border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-navy dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                      maxLength={100}
                    />
                    <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close search">
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setSearchOpen(true)} className="btn-ghost p-2" aria-label="Open search">
                    <Search size={18} />
                  </button>
                )}
              </div>

              {/* Mobile Search */}
              <button className="md:hidden btn-ghost p-2" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
                <Search size={18} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} />}
              </button>

              {/* Bookmarks */}
              <Link to="/bookmarks" className="btn-ghost p-2 relative hidden sm:flex" aria-label={`${bookmarkCount} saved jobs`}>
                <Bookmark size={18} />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {bookmarkCount > 9 ? '9+' : bookmarkCount}
                  </span>
                )}
              </Link>

              {/* Notifications Bell */}
              <Link to="/notifications" className="btn-ghost p-2 relative hidden sm:flex" aria-label="Notifications">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </Link>

              {/* Login / Avatar */}
              {user ? (
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 hover:bg-accent/10 border border-accent/10 hover:border-accent/20 transition-colors"
                  aria-label="Go to dashboard"
                >
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-accent hidden md:inline">
                    {user.displayName?.split(' ')[0] || 'Dashboard'}
                  </span>
                </Link>
              ) : (
                <Link to="/signup" className="hidden sm:flex btn-primary text-xs py-2 px-3">
                  <LogIn size={14} />
                  Sign Up
                </Link>
              )}

              {/* Hamburger */}
              <button
                className="lg:hidden btn-ghost p-2"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch}>
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search government jobs, organisations..."
                  className="input text-sm"
                  maxLength={100}
                />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-card-dark shadow-xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-5 border-b border-card-border dark:border-gray-700">
              <span className="font-poppins font-bold text-xl text-accent">Naukri<span className="text-navy dark:text-text-dark">Setu</span></span>
              <button onClick={() => setDrawerOpen(false)} className="btn-ghost p-2" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-accent' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-card-border dark:border-gray-700 space-y-2">
              {user ? (
                <Link to="/dashboard" onClick={() => setDrawerOpen(false)} className="btn-primary w-full">
                  <User size={16} /> My Dashboard
                </Link>
              ) : (
                <Link to="/signup" onClick={() => setDrawerOpen(false)} className="btn-primary w-full">
                  <LogIn size={16} /> Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
