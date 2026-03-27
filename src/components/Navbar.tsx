import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Logo from './Logo';

const navItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Portafolio', path: '/portafolio' },
  { name: 'Living Data', path: '/living-data' },
  { name: 'Contacto', path: '/contacto' },
];

const menuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: 50, filter: 'blur(10px)' },
  open: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24
    }
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500 px-8 py-6',
        scrolled ? 'bg-brand-dark/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-16">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                to={item.path}
                className={cn(
                  'text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-500',
                  location.pathname === item.path
                    ? 'text-brand-cyan border-b-2 border-brand-cyan pb-1'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <Link
            to="/contacto"
            className="px-6 py-2 bg-brand-gold text-brand-dark rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors duration-500"
          >
            Menu
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={cn("md:hidden text-white transition-opacity duration-300", isOpen ? "opacity-0 pointer-events-none" : "opacity-100")} 
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-40 md:hidden"
            />
            
            {/* Menu Content */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-brand-surface border-l border-white/10 p-12 z-50 md:hidden shadow-2xl"
            >
              <div className="flex justify-end mb-12">
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex flex-col space-y-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-xl font-serif tracking-[0.1em] block transition-colors duration-300 group',
                        location.pathname === item.path ? 'text-brand-gold italic' : 'text-gray-400 hover:text-white'
                      )}
                    >
                      <span className="text-[10px] font-sans tracking-[0.3em] text-brand-cyan mr-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        0{index + 1}
                      </span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                variants={itemVariants}
                className="absolute bottom-12 left-12 right-12"
              >
                <div className="h-px w-full bg-white/5 mb-8" />
                <p className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-4">Contacto</p>
                <p className="font-serif text-sm text-brand-gold italic">hola@cyberorganic.luxury</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
