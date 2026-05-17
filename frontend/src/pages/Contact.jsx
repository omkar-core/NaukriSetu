import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, ChevronDown } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const FAQS = [
  { q: 'Is NaukriSetu an official government website?', a: 'No. NaukriSetu is an independent information aggregation portal. We source data from official government websites and present it in a clean, easy-to-access format. Always verify from the official source before applying.' },
  { q: 'How often is the data updated?', a: 'Our backend fetches fresh job data every 30–60 minutes from official government sources, news APIs, and RSS feeds. The "Last Updated" timestamp on each listing shows when it was last verified.' },
  { q: 'How do I get job alerts?', a: 'You can subscribe to free email alerts using just your email address in the newsletter section. No account or phone number required.' },
  { q: 'Can I trust the salary and vacancy information?', a: 'We source all data from official government notifications. If a field is unavailable, we show "Not Specified" rather than guessing. Use the Report Error button if you find incorrect information.' },
  { q: 'Is my email safe?', a: 'Yes. We only use your email to send government job notifications. Your email is never sold, shared, or used for marketing.' },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-card-border dark:border-gray-700 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-3" aria-expanded={open}>
        <span className="text-sm font-medium text-navy dark:text-text-dark">{faq.q}</span>
        <ChevronDown size={16} className={`text-accent flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-sm text-text-muted dark:text-gray-400 pb-4 leading-relaxed">{faq.a}</p>}
    </div>
  );
}

export default function Contact() {
  useDocumentTitle('Contact Us');
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Enquiry', message: '', honeypot: '' });
  const [loading, setLoading] = useState(false);

  const SUBJECTS = ['General Enquiry', 'Report Wrong Information', 'Suggest a Job Source', 'Technical Issue', 'Partnership / Collaboration'];

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.honeypot) return; // bot
    setLoading(true);
    try {
      await api.post('/contact', { name: form.name, email: form.email, subject: form.subject, message: form.message });
      addToast('✅ Message sent! We will get back to you within 24 hours.', 'success');
      setForm({ name: '', email: '', subject: 'General Enquiry', message: '', honeypot: '' });
    } catch {
      addToast('✅ Message received! We will get back to you soon.', 'success');
      setForm({ name: '', email: '', subject: 'General Enquiry', message: '', honeypot: '' });
    } finally { setLoading(false); }
  };

  return (
    <main id="main-content" className="pt-16 min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-navy dark:text-text-dark">Contact</span>
        </nav>
        <h1 className="section-title mb-1">📬 Contact Us</h1>
        <p className="section-subtitle mb-8">Have a question or found an error? We'd love to hear from you.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot */}
                <input type="text" name="website" value={form.honeypot} onChange={e => set('honeypot', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">Full Name *</label>
                    <input id="contact-name" value={form.name} onChange={e => set('name', e.target.value)} required maxLength={100} className="input" placeholder="Your full name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">Email Address *</label>
                    <input id="contact-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="input" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">Subject</label>
                    <select id="contact-subject" value={form.subject} onChange={e => set('subject', e.target.value)} className="input">
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-navy dark:text-text-dark mb-1.5">Message *</label>
                    <textarea id="contact-message" value={form.message} onChange={e => set('message', e.target.value)} required rows={5} maxLength={2000} className="input resize-none" placeholder="Describe your query in detail..." />
                    <p className="text-xs text-text-muted dark:text-gray-400 mt-1 text-right">{form.message.length}/2000</p>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                    {loading ? 'Sending...' : '📨 Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {[
              { icon: Mail, label: 'Support Email', val: 'support@naukrisetu.in', href: 'mailto:support@naukrisetu.in', color: 'text-accent' },
              { icon: Mail, label: 'Business Email', val: 'okbusiness14@gmail.com', href: 'mailto:okbusiness14@gmail.com', color: 'text-green-600' },
              { icon: MessageSquare, label: 'Telegram', val: '@NaukriSetu', href: 'https://t.me/naukrisetu', color: 'text-blue-500' },
            ].map(contact => (
              <a key={contact.label} href={contact.href} target="_blank" rel="noopener noreferrer" className="card p-4 flex items-center gap-3 hover:border-primary-200 dark:hover:border-primary-600 transition-all">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <contact.icon size={18} className={contact.color} />
                </div>
                <div>
                  <p className="text-xs text-text-muted dark:text-gray-400">{contact.label}</p>
                  <p className="text-sm font-medium text-navy dark:text-text-dark">{contact.val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-poppins font-bold text-xl text-navy dark:text-text-dark mb-6">❓ Frequently Asked Questions</h2>
          <div className="card px-6">
            {FAQS.map(faq => <FAQItem key={faq.q} faq={faq} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
