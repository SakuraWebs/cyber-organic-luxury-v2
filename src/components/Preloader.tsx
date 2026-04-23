import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface PreloaderProps {
  show: boolean;
}

export default function Preloader({ show }: PreloaderProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] bg-brand-dark flex items-center justify-center overflow-hidden"
        >
          {/* Background digital grid effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Large Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8 sm:mb-12"
            >
              <Logo className="scale-[1.1] sm:scale-[1.5] md:scale-[2.5]" loading={true} />
            </motion.div>

            {/* Loading Progress Bar */}
            <div className="w-40 sm:w-48 h-[2px] bg-white/5 relative overflow-hidden mt-8 sm:mt-12">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-brand-gold"
              />
            </div>

            {/* Status Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 flex flex-col items-center px-6 text-center"
            >
              <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.4em] sm:tracking-[0.6em] text-brand-cyan uppercase opacity-50 mb-2">
                Iniciando Sistema
              </span>
              <motion.span 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="font-serif text-[9px] sm:text-[10px] italic text-brand-gold"
              >
                Integrando lo orgánico con lo digital...
              </motion.span>
            </motion.div>
          </div>

          {/* Decorative scanner line */}
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 2.5, ease: "linear", repeat: 0 }}
            className="absolute left-0 right-0 h-[1px] bg-brand-cyan/20 shadow-[0_0_15px_rgba(0,255,255,0.3)] z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
