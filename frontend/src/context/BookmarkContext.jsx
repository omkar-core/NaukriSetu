import { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('naukrisetu_bookmarks') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('naukrisetu_bookmarks', JSON.stringify(bookmarks)); } catch {}
  }, [bookmarks]);

  const toggleBookmark = (job) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === job.id);
      if (exists) return prev.filter(b => b.id !== job.id);
      if (prev.length >= 5) {
        // soft prompt — just allow for now, limit handled in UI
      }
      return [job, ...prev];
    });
  };

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);
  const bookmarkCount = bookmarks.length;

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, bookmarkCount }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be inside BookmarkProvider');
  return ctx;
};
