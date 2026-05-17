import { Link } from 'react-router-dom';
import { Globe, ChevronRight, ExternalLink } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const sources = [
  {
    name: 'Indian Railway Recruitment',
    url: 'https://indianrailways.gov.in',
    description: 'All railway recruitment including RRB NTPC, ALP, Group D, RRC, and zonal railway notifications.',
    category: 'Railway',
  },
  {
    name: 'Union Public Service Commission',
    url: 'https://upsc.gov.in',
    description: 'UPSC Civil Services, CAPF, NDA, CDS, Engineering Services, and other central service exams.',
    category: 'UPSC',
  },
  {
    name: 'Staff Selection Commission',
    url: 'https://ssc.nic.in',
    description: 'SSC CGL, CHSL, MTS, CPO, JE, GD Constable, and other SSC examinations.',
    category: 'SSC',
  },
  {
    name: 'Institute of Banking Personnel Selection',
    url: 'https://ibps.in',
    description: 'IBPS PO, Clerk, SO, RRB Officer and Office Assistant recruitment.',
    category: 'Banking',
  },
  {
    name: 'State Bank of India',
    url: 'https://sbi.co.in/careers',
    description: 'SBI PO, Clerk, SO, Specialist Officer, and apprentice recruitment.',
    category: 'Banking',
  },
  {
    name: 'Reserve Bank of India',
    url: 'https://rbi.org.in',
    description: 'RBI Grade B, Assistant, and other officer-level recruitment.',
    category: 'Banking',
  },
  {
    name: 'Indian Army Recruitment',
    url: 'https://joinindianarmy.nic.in',
    description: 'Indian Army officer and soldier recruitment (TGC, SSC, NCC, Soldier GD, Technical, Nursing).',
    category: 'Defence',
  },
  {
    name: 'Indian Navy Recruitment',
    url: 'https://joinindiannavy.gov.in',
    description: 'Indian Navy officer and sailor recruitment (SSB, SSC, Artificer Apprentice, SSR, AA).',
    category: 'Defence',
  },
  {
    name: 'Indian Air Force Recruitment',
    url: 'https://indianairforce.nic.in',
    description: 'IAF officer and airmen recruitment (AFCAT, NDA, Group X & Y).',
    category: 'Defence',
  },
  {
    name: 'National Recruitment Agency',
    url: 'https://nra.gov.in',
    description: 'Common Eligibility Test (CET) for non-gazetted government positions across India.',
    category: 'SSC',
  },
  {
    name: 'Ministry of Defence',
    url: 'https://mod.gov.in',
    description: 'Defence civilian recruitment, MES, ordnance factory, and DRDO notifications.',
    category: 'Defence',
  },
  {
    name: 'Teaching Recruitment',
    url: 'https://education.gov.in',
    description: 'Teacher eligibility tests (CTET, STET) and school/college faculty recruitment.',
    category: 'Teaching',
  },
  {
    name: 'PSU Recruitment (Coal India)',
    url: 'https://coalindia.in',
    description: 'Coal India Limited management and non-executive recruitment.',
    category: 'Engineering PSU',
  },
  {
    name: 'PSU Recruitment (ONGC)',
    url: 'https://ongcindia.com',
    description: 'ONGC executive and non-executive recruitment across engineering and technical disciplines.',
    category: 'Engineering PSU',
  },
  {
    name: 'PSU Recruitment (GAIL)',
    url: 'https://gailonline.com',
    description: 'GAIL (India) Limited management trainee and executive recruitment.',
    category: 'Engineering PSU',
  },
  {
    name: 'PSU Recruitment (NTPC)',
    url: 'https://ntpc.co.in',
    description: 'NTPC Limited executive and engineer recruitment.',
    category: 'Engineering PSU',
  },
  {
    name: 'PSU Recruitment (BHEL)',
    url: 'https://bhel.com',
    description: 'BHEL engineer and supervisor recruitment.',
    category: 'Engineering PSU',
  },
  {
    name: 'State Public Service Commissions',
    url: 'https://psc.gov.in',
    description: 'State PSC recruitment for state civil services, police services, and allied services.',
    category: 'State PSC',
  },
  {
    name: 'Ministry of Home Affairs',
    url: 'https://mha.gov.in',
    description: 'CAPF recruitment (BSF, CRPF, CISF, ITBP, SSB) and other MHA notifications.',
    category: 'Police',
  },
  {
    name: 'Employment News',
    url: 'https://employmentnews.gov.in',
    description: 'Weekly employment news with government job notifications from all ministries.',
    category: 'General',
  },
  {
    name: 'National Health Mission',
    url: 'https://nhm.nic.in',
    description: 'Healthcare recruitment across state NHM missions including doctors, nurses, and paramedics.',
    category: 'Health',
  },
  {
    name: 'ICAR',
    url: 'https://icar.org.in',
    description: 'Agricultural research and education recruitment under the Indian Council of Agricultural Research.',
    category: 'Agriculture',
  },
];

export default function Sources() {
  useDocumentTitle('Official Government Sources');

  const categories = [...new Set(sources.map(s => s.category))];

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-navy dark:text-text-dark font-medium">Official Sources</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Globe size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-navy dark:text-text-dark">Official Government Sources</h1>
            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
              All job notifications on NaukriSetu are sourced from these verified official government portals.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          We aggregate publicly available job notifications from official government websites. We encourage all users to
          visit these official sources directly to verify application details, download notification PDFs, and submit applications.
          NaukriSetu is not responsible for changes made to notifications after publication.
        </p>

        {categories.map(cat => (
          <div key={cat} className="mb-6">
            <h2 className="font-poppins font-semibold text-sm text-navy dark:text-text-dark mb-3 uppercase tracking-wider">{cat}</h2>
            <div className="grid gap-2">
              {sources.filter(s => s.category === cat).map(s => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-accent/30 hover:shadow-sm transition-all group"
                >
                  <Globe size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-navy dark:text-text-dark group-hover:text-accent transition-colors">{s.name}</span>
                      <ExternalLink size={12} className="text-text-muted flex-shrink-0" />
                    </div>
                    <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">{s.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
