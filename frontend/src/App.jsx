import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';
import CookieConsent from './components/ui/CookieConsent.jsx';
import BackToTop from './components/ui/BackToTop.jsx';
import TelegramPrompt from './components/ui/TelegramPrompt.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const LatestJobs = lazy(() => import('./pages/LatestJobs.jsx'));
const JobDetails = lazy(() => import('./pages/JobDetails.jsx'));
const Internships = lazy(() => import('./pages/Internships.jsx'));
const Apprenticeship = lazy(() => import('./pages/Apprenticeship.jsx'));
const GovtExams = lazy(() => import('./pages/GovtExams.jsx'));
const AdmitCard = lazy(() => import('./pages/AdmitCard.jsx'));
const Results = lazy(() => import('./pages/Results.jsx'));
const Notifications = lazy(() => import('./pages/Notifications.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const LiveNews = lazy(() => import('./pages/LiveNews.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Bookmarks = lazy(() => import('./pages/Bookmarks.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Disclaimer = lazy(() => import('./pages/Disclaimer.jsx'));
const Sources = lazy(() => import('./pages/Sources.jsx'));
const Offline = lazy(() => import('./pages/Offline.jsx'));
const ServerError = lazy(() => import('./pages/ServerError.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BookmarkProvider>
              <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary dark:text-text-dark transition-colors">
                <Header />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/jobs" element={<LatestJobs />} />
                      <Route path="/jobs/:id" element={<JobDetails />} />
                      <Route path="/internships" element={<Internships />} />
                      <Route path="/apprenticeship" element={<Apprenticeship />} />
                      <Route path="/exams" element={<GovtExams />} />
                      <Route path="/admit-card" element={<AdmitCard />} />
                      <Route path="/results" element={<Results />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/live-news" element={<LiveNews />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/bookmarks" element={<Bookmarks />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/disclaimer" element={<Disclaimer />} />
                      <Route path="/sources" element={<Sources />} />
                      <Route path="/offline" element={<Offline />} />
                      <Route path="/server-error" element={<ServerError />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <BottomNav />
                <ToastContainer />
                <CookieConsent />
                <BackToTop />
                <TelegramPrompt />
              </div>
            </BookmarkProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
