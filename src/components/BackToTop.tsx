import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-24 right-8 z-50",
            "w-12 h-12 rounded-full",
            "bg-brand-gold/25 text-brand-dark backdrop-blur-sm",
            "flex items-center justify-center",
            "shadow-lg shadow-brand-gold/20",
            "border border-brand-gold/50",
            "transition-colors hover:bg-white",
            "group"
          )}
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
