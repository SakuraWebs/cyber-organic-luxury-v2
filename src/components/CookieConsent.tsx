import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="fixed bottom-0 left-0 w-full z-[9999] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto bg-brand-dark/90 backdrop-blur-xl border border-white/10 rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-lg text-white italic">Privacidad & Cookies (LGPD)</h4>
                <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-2xl">
                  Utilizamos cookies para mejorar su experiencia y analizar el tráfico de acuerdo con la 
                  <strong> Lei Geral de Proteção de Dados (LGPD)</strong>. Al continuar navegando, usted acepta nuestro uso de cookies. 
                  Consulte nuestra <Link to="/privacidad" className="text-brand-gold hover:underline">Política de Privacidad</Link> para más información.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-8 py-3 bg-brand-gold text-brand-dark font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all duration-300"
              >
                Aceptar Todo
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-3 text-gray-500 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
