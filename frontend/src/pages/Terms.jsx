import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Terms() {
  useDocumentTitle('Terms of Service');

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing or using NaukriSetu, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time without prior notice.'
    },
    {
      title: 'Service Description',
      content: 'NaukriSetu is an information aggregation platform that collects, curates, and displays government job notifications from publicly available official sources. We do not guarantee the accuracy, completeness, or timeliness of any information displayed. All users are strongly advised to verify details from the official recruitment notification before applying.'
    },
    {
      title: 'User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. Accounts found to be using false information may be suspended. You may delete your account at any time from the dashboard settings.'
    },
    {
      title: 'Acceptable Use',
      content: 'You agree not to: (a) Use automated tools (bots, scrapers) to access our platform without permission; (b) Misrepresent your identity or affiliation; (c) Attempt to disrupt or compromise our services; (d) Use the platform for any unlawful purpose; (e) Republish our curated content without attribution.'
    },
    {
      title: 'Intellectual Property',
      content: 'The NaukriSetu name, logo, and platform design are our intellectual property. Government notification content sourced from official websites remains in the public domain. Our curated summaries, category labels, and AI-generated bilingual translations are our original work and may not be reproduced without credit.'
    },
    {
      title: 'Disclaimer of Warranties',
      content: 'NaukriSetu is provided "as is" without any warranty, express or implied. We do not guarantee that job listings are still accepting applications, that exam dates have not changed, or that eligibility criteria are correctly interpreted. Always refer to the official notification PDF published by the respective government body.'
    },
    {
      title: 'Limitation of Liability',
      content: 'NaukriSetu and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to missed application deadlines, incorrect salary expectations, or reliance on incomplete information.'
    },
    {
      title: 'Third-Party Links',
      content: 'Our platform contains links to official government websites and third-party services. We are not responsible for the content, privacy practices, or availability of these external sites. Users access third-party links at their own risk.'
    },
    {
      title: 'Termination',
      content: 'We reserve the right to suspend or terminate accounts that violate these terms, without prior notice. Users may terminate their account at any time by contacting us.'
    },
    {
      title: 'Governing Law',
      content: 'These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.'
    },
    {
      title: 'Contact',
      content: 'For questions about these terms, email legal@naukrisetu.com.'
    },
  ];

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-navy dark:text-text-dark font-medium">Terms of Service</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileText size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark">Terms of Service</h1>
            <p className="text-xs text-text-muted dark:text-gray-400">Last updated: 15 March 2026</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
