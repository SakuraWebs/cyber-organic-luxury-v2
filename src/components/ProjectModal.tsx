import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ProjectModalProps {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-[101] bg-brand-surface border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Left Side: Image Gallery */}
            <div className="w-full md:w-1/2 h-64 md:h-full overflow-y-auto scrollbar-hide bg-black/20">
              <div className="flex flex-col gap-4 p-4 md:p-8">
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  src={project.image.includes('http') ? project.image : `${project.image}.webp`}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-video object-cover rounded-sm border border-white/5"
                  referrerPolicy="no-referrer"
                />
                {project.gallery.map((img: string, index: number) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    src={img.includes('http') ? img : `${img}.webp`}
                    alt={`${project.title} gallery ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-video object-cover rounded-sm border border-white/5"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Project Info */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-16 flex flex-col bg-brand-surface">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] uppercase tracking-widest border border-brand-gold/20 rounded-full">
                    {project.category}
                  </span>
                  <div className="h-[1px] flex-grow bg-white/10"></div>
                </div>

                <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
                  {project.title}
                </h2>

                <div className="grid grid-cols-2 gap-8 mb-12 border-y border-white/5 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Cliente</p>
                      <p className="text-sm text-white font-medium">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Año</p>
                      <p className="text-sm text-white font-medium">{project.year}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h3 className="font-serif text-xl text-brand-gold mb-4 italic">Sobre el Proyecto</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {project.fullDesc}
                  </p>
                </div>

                <div className="mb-12">
                  <h3 className="font-serif text-xl text-brand-gold mb-6 italic">Servicios Aplicados</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.services.map((service: string, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-xs text-white group hover:border-brand-cyan/50 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 text-brand-cyan" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                  <button 
                    onClick={onClose}
                    className="group flex items-center gap-4 text-brand-gold hover:text-white transition-colors uppercase tracking-[0.3em] text-xs"
                  >
                    Cerrar Detalle
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
