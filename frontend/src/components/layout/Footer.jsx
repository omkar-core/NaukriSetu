import { Link } from 'react-router-dom';
import { Send, Globe, Video, Shield } from 'lucide-react';

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Latest Jobs', to: '/jobs' },
    { label: 'Internships', to: '/internships' },
    { label: 'Apprenticeship', to: '/apprenticeship' },
    { label: 'Live News', to: '/live-news' },
    { label: 'Govt Exams', to: '/exams' },
    { label: 'Admit Card', to: '/admit-card' },
    { label: 'Results', to: '/results' },
  ],
  'Information': [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Notifications', to: '/notifications' },
  ],
  'Legal': [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Official Sources', to: '/sources' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy dark:bg-gray-950 text-gray-300 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-poppins font-bold text-2xl text-accent">Naukri<span className="text-white">Setu</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              India's most trusted government job discovery platform. Accurate. Updated daily. Serving lakhs of job seekers.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a href="https://t.me/naukrisetu" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-lg hover:bg-accent transition-colors" aria-label="Telegram Channel">
                <Send size={16} />
              </a>
              <a href="https://twitter.com/naukrisetu" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-lg hover:bg-accent transition-colors" aria-label="Twitter/X">
                <Globe size={16} />
              </a>
              <a href="https://youtube.com/@naukrisetu" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-lg hover:bg-[#FF0000] transition-colors" aria-label="YouTube">
                <Video size={16} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-poppins font-semibold text-white text-sm mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex items-start gap-3 mb-4 p-4 bg-white/5 rounded-xl">
            <Shield size={18} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-warning font-semibold">Disclaimer:</strong> NaukriSetu is an independent information aggregation portal and is <strong>not affiliated with, endorsed by, or representative of any Indian government body</strong>. All information is sourced from official government websites and is provided for informational purposes only. Please verify all application details, dates, eligibility, and salary information from the <a href="#" className="text-accent hover:underline">official recruitment notification</a> before applying. NaukriSetu is not responsible for any errors, omissions, or changes in official notifications after publication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {year} NaukriSetu. All rights reserved. Built with ❤️ for India's job seekers.</p>
            <div className="flex items-center gap-1.5 text-success">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Data refreshed every 60 min from official sources</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
