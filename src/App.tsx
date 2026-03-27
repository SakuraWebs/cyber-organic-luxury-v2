import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import About from './pages/About';
import LivingData from './pages/LivingData';
import ProjectDetail from './pages/ProjectDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookieConsent from './components/CookieConsent';
import Preloader from './components/Preloader';
import { AnimatePresence, motion } from 'motion/react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Duration of the preloader animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <Preloader show={loading} />
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="min-h-screen bg-brand-dark flex flex-col"
          >
            <Router>
              <ScrollToTop />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/servicios" element={<Services />} />
                  <Route path="/nosotros" element={<About />} />
                  <Route path="/portafolio" element={<Portfolio />} />
                  <Route path="/portafolio/:projectId" element={<ProjectDetail />} />
                  <Route path="/living-data" element={<LivingData />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/privacidad" element={<PrivacyPolicy />} />
                  <Route path="/terminos" element={<TermsOfService />} />
                </Routes>
              </main>
              <Chatbot />
              <BackToTop />
              <CookieConsent />
              <Footer />
            </Router>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
