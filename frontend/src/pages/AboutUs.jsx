import { Link } from 'react-router-dom';
import { Shield, Target, RefreshCw, Globe, ExternalLink } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function AboutUs() {
  useDocumentTitle('About Us');
  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">About Us</span>
        </nav>

        {/* Hero */}
        <div className="text-center py-10 mb-8">
          <span className="font-poppins font-bold text-5xl text-accent">Naukri<span className="text-navy dark:text-text-dark">Setu</span></span>
          <p className="text-lg text-text-muted dark:text-gray-400 mt-3 max-w-xl mx-auto">Bridging the gap between India's job seekers and government opportunities. Accurate. Trusted. Free.</p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Target, title: 'Mission', desc: 'To provide every Indian job seeker with accurate, timely, and easy-to-access government job information.', color: 'text-accent' },
            { icon: Shield, title: 'Trust', desc: 'All data sourced exclusively from official government websites, official RSS feeds, and verified news sources.', color: 'text-success' },
            { icon: RefreshCw, title: 'Freshness', desc: 'Data refreshed every 30–60 minutes via an automated pipeline. "Last Updated" shown on every listing.', color: 'text-warning' },
          ].map(card => (
            <div key={card.title} className="card p-5 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl mx-auto mb-3">
                <card.icon size={22} className={card.color} />
              </div>
              <h2 className="font-poppins font-bold text-base text-navy dark:text-text-dark mb-2">{card.title}</h2>
              <p className="text-xs text-text-muted dark:text-gray-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Official Sources */}
        <div className="card p-6 mb-6">
          <h2 className="font-poppins font-semibold text-lg text-navy dark:text-text-dark mb-4 flex items-center gap-2">
            <Globe size={18} className="text-accent" /> Official Data Sources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Staff Selection Commission', url: 'https://ssc.gov.in' },
              { name: 'Union Public Service Commission', url: 'https://upsc.gov.in' },
              { name: 'Indian Railways', url: 'https://indianrailways.gov.in' },
              { name: 'DRDO Careers', url: 'https://drdo.gov.in' },
              { name: 'ISRO Recruitment', url: 'https://isro.gov.in' },
              { name: 'Apprenticeship India', url: 'https://apprenticeshipindia.gov.in' },
              { name: 'National Career Service Portal', url: 'https://ncs.gov.in' },
              { name: 'Employment News', url: 'https://employmentnews.gov.in' },
            ].map(src => (
              <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group">
                <span className="text-sm font-medium text-navy dark:text-text-dark group-hover:text-accent transition-colors">{src.name}</span>
                <ExternalLink size={12} className="text-text-muted group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
          <h3 className="font-poppins font-semibold text-base text-amber-800 dark:text-amber-300 mb-2">⚠️ Important Disclaimer</h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            NaukriSetu is an <strong>independent information aggregation portal</strong> and is not affiliated with, endorsed by, or representative of any Indian government body or the Government of India. All information is sourced from official government websites and is provided for <strong>informational purposes only</strong>. Please verify all application details from the official recruitment notification before applying.
          </p>
        </div>
      </div>
    </main>
  );
}
