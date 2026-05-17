import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Disclaimer() {
  useDocumentTitle('Disclaimer');

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-navy dark:text-text-dark font-medium">Disclaimer</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark">Disclaimer</h1>
            <p className="text-xs text-text-muted dark:text-gray-400">Last updated: 15 March 2026</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-warning-light dark:bg-warning/10 border border-warning/20 rounded-xl">
            <p className="text-sm text-warning-800 dark:text-warning leading-relaxed font-medium">
              Please read this disclaimer carefully before using NaukriSetu. By using our platform, you accept the terms stated below.
            </p>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">Not a Government Website</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              NaukriSetu is an <strong>independent information aggregation portal</strong> and is <strong>not affiliated with, endorsed by, or representative of any Indian government body, ministry, department, or agency</strong>. We are a private platform that collects publicly available government job notifications and presents them in an accessible format.
            </p>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">Accuracy of Information</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              While we strive to keep all information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information displayed. Government job notifications are subject to change at any time by the issuing authority.
            </p>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">Your Responsibility</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Users are strongly advised to:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2 space-y-1.5 list-disc pl-5">
              <li>Always verify application details, dates, eligibility criteria, and salary information from the official recruitment notification PDF published by the respective government body.</li>
              <li>Check the official website of the recruiting organisation for any amendments, corrections, or updates to the notification.</li>
              <li>Not rely solely on the information provided on NaukriSetu for making career decisions.</li>
              <li>Cross-reference application deadlines with official sources, as dates may be extended or revised.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">No Guarantee of Availability</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              We do not guarantee that job listings displayed on our platform are still accepting applications, that vacancies have not been filled, or that examination dates have not been postponed. Government recruitment processes may be cancelled, suspended, or modified without notice.
            </p>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">AI-Generated Content</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Some content on NaukriSetu, including bilingual (English & Hindi) summaries and category classifications, is generated with the assistance of artificial intelligence. While we review and validate this content, it may contain errors or omissions.
            </p>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">Third-Party Links</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform contains links to external websites, including official government portals and third-party sources. We have no control over the content, privacy practices, or availability of these sites and accept no responsibility for them.
            </p>
          </div>

          <div>
            <h2 className="font-poppins font-semibold text-base text-navy dark:text-text-dark mb-2">Limitation of Liability</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              NaukriSetu, its operators, contributors, and affiliates shall not be held liable for any loss, damage, or inconvenience arising from the use of this platform, including but not limited to missed application deadlines, incorrect eligibility assessments, or financial losses.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-text-muted dark:text-gray-400">
              For questions, contact{' '}
              <a href="mailto:legal@naukrisetu.com" className="text-accent hover:underline">legal@naukrisetu.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
