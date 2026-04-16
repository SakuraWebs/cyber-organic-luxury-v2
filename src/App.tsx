import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
import AIGenerator from './pages/AIGenerator';
import ProjectDetail from './pages/ProjectDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookieConsent from './components/CookieConsent';
import Preloader from './components/Preloader';
import { AnimatePresence, motion } from 'motion/react';

import Admin from './pages/Admin';

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'CYBER ORGANIC AGENCY | Lujo Digital y Diseño Bio-Digital',
    description: 'Agencia creativa especializada en diseño web de alta gama, producción de contenido cinematográfico y marketing digital estratégico con enfoque bio-digital.'
  },
  '/servicios': {
    title: 'Servicios | CYBER ORGANIC AGENCY',
    description: 'Descubre nuestros servicios de diseño bio-digital, desarrollo web premium, producción de contenido y estrategias de marketing de lujo.'
  },
  '/nosotros': {
    title: 'Nosotros | CYBER ORGANIC AGENCY',
    description: 'Conoce al equipo detrás de CYBER ORGANIC. Fusionamos la precisión técnica con la fluidez orgánica para crear experiencias digitales únicas.'
  },
  '/portafolio': {
    title: 'Portafolio | CYBER ORGANIC AGENCY',
    description: 'Explora nuestra selección de proyectos destacados en diseño web, contenido y marketing digital para marcas premium.'
  },
  '/living-data': {
    title: 'Living Data | CYBER ORGANIC AGENCY',
    description: 'Visualización de datos en tiempo real con un enfoque orgánico y artístico. La intersección de la información y la vida.'
  },
  '/ai-studio': {
    title: 'AI Studio | CYBER ORGANIC AGENCY',
    description: 'Generador de contenido impulsado por IA. Crea visiones bio-digitales únicas utilizando nuestra tecnología avanzada.'
  },
  '/contacto': {
    title: 'Contacto | CYBER ORGANIC AGENCY',
    description: '¿Listo para elevar tu marca al siguiente nivel bio-digital? Contáctanos hoy mismo para una consulta personalizada.'
  },
  '/admin': {
    title: 'Admin Dashboard | CYBER ORGANIC AGENCY',
    description: 'Panel de administración para la gestión de contenidos y monitoreo de la plataforma.'
  },
  '/privacidad': {
    title: 'Política de Privacidad | CYBER ORGANIC AGENCY',
    description: 'Información sobre cómo manejamos y protegemos tus datos personales.'
  },
  '/terminos': {
    title: 'Términos de Servicio | CYBER ORGANIC AGENCY',
    description: 'Términos y condiciones legales para el uso de nuestro sitio web y servicios.'
  }
};

function DynamicMetadata() {
  const { pathname } = useLocation();
  
  // Handle dynamic routes like /portafolio/:projectId
  const isProjectDetail = pathname.startsWith('/portafolio/') && pathname.split('/').length === 3;
  
  const metadata = routeMetadata[pathname] || {
    title: isProjectDetail ? 'Proyecto | CYBER ORGANIC AGENCY' : 'CYBER ORGANIC AGENCY',
    description: 'Agencia creativa especializada en diseño web de alta gama y enfoque bio-digital.'
  };

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
    </Helmet>
  );
}

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
              <DynamicMetadata />
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
                  <Route path="/ai-studio" element={<AIGenerator />} />
                  <Route path="/admin" element={<Admin />} />
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
