import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-10 h-10 flex items-center justify-center bg-accent text-white rounded-full shadow-lg hover:bg-accent-dark transition-all hover:scale-105 active:scale-95"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
