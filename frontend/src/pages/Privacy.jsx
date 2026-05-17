import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Privacy() {
  useDocumentTitle('Privacy Policy');

  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect minimal information necessary to provide our services: (a) Account data: name, email address, and preferences when you create an account; (b) Usage data: pages visited, bookmarks saved, and search queries to improve our platform; (c) Device data: browser type and operating system for analytics. We do not collect sensitive personal information such as caste, religion, or financial data.'
    },
    {
      title: 'How We Use Your Information',
      content: 'Your information is used solely to: (a) Provide and personalise job alerts and recommendations; (b) Improve our platform based on usage patterns; (c) Send email notifications only if you explicitly opted in during registration. We never sell, rent, or share your personal data with third parties for their marketing purposes.'
    },
    {
      title: 'Cookies',
      content: 'We use essential cookies to maintain your session, remember your preferences (theme, bookmarks), and improve site performance. No third-party tracking cookies are used. You can disable cookies in your browser settings, though some features may not function properly.'
    },
    {
      title: 'Data Retention',
      content: 'Account data is retained until you delete your account. Usage analytics are anonymised after 12 months. You may request complete deletion of your data by contacting us at privacy@naukrisetu.com.'
    },
    {
      title: 'Third-Party Services',
      content: 'We use Firebase (Google) for authentication and data storage. Firebase processes data in accordance with Google\'s Privacy Policy. We do not integrate third-party advertising networks.'
    },
    {
      title: 'Your Rights',
      content: 'You have the right to: access your data upon request; correct inaccurate data; delete your account and associated data; withdraw consent for email alerts at any time; and lodge a complaint with your local data protection authority.'
    },
    {
      title: 'Security',
      content: 'We implement industry-standard security measures including HTTPS encryption, secure authentication via Firebase, and regular security audits. However, no online service is 100% secure. We encourage you to use strong passwords and enable two-factor authentication on your Google account.'
    },
    {
      title: 'Updates',
      content: 'This policy may be updated periodically. Material changes will be notified via email to registered users. Continued use after changes constitutes acceptance.'
    },
    {
      title: 'Contact',
      content: 'For privacy-related inquiries, email privacy@naukrisetu.com or visit our Contact page.'
    },
  ];

  const lastUpdated = '15 March 2026';

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-navy dark:text-text-dark font-medium">Privacy Policy</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Shield size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark">Privacy Policy</h1>
            <p className="text-xs text-text-muted dark:text-gray-400">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            At NaukriSetu, your privacy is a priority. This policy describes how we collect, use, and protect your information when you use our platform.
          </p>
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.content}</p>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-text-muted dark:text-gray-400">
              For any questions, contact{' '}
              <a href="mailto:privacy@naukrisetu.com" className="text-accent hover:underline">privacy@naukrisetu.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
