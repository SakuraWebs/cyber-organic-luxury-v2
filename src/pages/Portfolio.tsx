import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Facebook, ArrowUpRight, Share2, Linkedin as LinkedinIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { projects as localProjects } from '../data/projects';
import ProjectModal from '../components/ProjectModal';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const categories = ['Todos', 'Web', 'Contenido', 'Marketing'];

function ProjectCard({ project, onOpen }: { project: any, onOpen: (project: any) => void }) {
  const [showShare, setShowShare] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for lazy loading
  const isInView = useInView(containerRef, { once: true, margin: "300px 0px" });
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [deviceParams, setDeviceParams] = useState({ offset: 15, scale: 1.3 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setDeviceParams({ offset: 25, scale: 1.5 });
      } else if (w >= 768) {
        setDeviceParams({ offset: 15, scale: 1.3 });
      } else {
        setDeviceParams({ offset: 8, scale: 1.16 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [`-${deviceParams.offset}%`, `${deviceParams.offset}%`]);

  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -10 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShare(false);
      }
    }

    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShare]);

  return (
    <motion.div
      ref={containerRef}
      layout
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      style={{ position: 'relative' }}
      className="group relative overflow-hidden rounded-sm bg-brand-surface aspect-[4/5]"
    >
      <div className="absolute inset-0 overflow-hidden bg-brand-dark/40">
        {isInView && (
          <motion.img
            style={{ y, scale: deviceParams.scale }}
            src={project.image.includes('http') ? project.image : `${project.image}.webp`}
            alt={project.alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-all duration-1000 ease-out",
              isLoaded ? "opacity-60 grayscale blur-none group-hover:grayscale-0 group-hover:opacity-80" : "opacity-0 blur-xl grayscale"
            )}
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80"></div>
      
      {/* Social Sharing Buttons */}
      <div ref={shareMenuRef} className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowShare(!showShare);
          }}
          className="w-10 h-10 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
          title="Compartir Proyecto"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>

        <AnimatePresence>
          {showShare && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3"
            >
              {[
                { icon: Facebook, name: 'Facebook', url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
                { icon: XIcon, name: 'X', url: (u: string) => `https://twitter.com/intent/tweet?url=${u}` },
                { icon: WhatsAppIcon, name: 'WhatsApp', url: (u: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent('Mira este proyecto de CYBER ORGANIC: ' + u)}` },
                { icon: LinkedinIcon, name: 'LinkedIn', url: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
              ].map((social) => (
                <button
                  key={social.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    const shareUrl = window.location.origin + project.link;
                    window.open(social.url(shareUrl), '_blank');
                  }}
                  className="w-10 h-10 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 transform hover:scale-110"
                  title={`Compartir en ${social.name}`}
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 p-10 z-10 w-full translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
        <span className="font-sans text-[10px] tracking-widest text-brand-cyan uppercase mb-2 block">
          {project.category}
        </span>
        <h3 className="font-serif text-2xl text-white mb-2">{project.title}</h3>
        
        <motion.p 
          variants={contentVariants}
          className="font-sans text-gray-400 text-xs leading-relaxed mb-6"
        >
          {project.desc}
        </motion.p>
        
        <button
          onClick={() => onOpen(project)}
          className="inline-flex items-center gap-2 text-brand-gold font-sans text-[10px] uppercase tracking-widest hover:text-white transition-colors"
        >
          <motion.span variants={contentVariants} className="flex items-center gap-2">
            Ver Proyecto <ArrowUpRight className="w-3 h-3" />
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>(localProjects);

  useEffect(() => {
    const fetchFirestoreProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const firestoreProjects: any[] = [];
        querySnapshot.forEach((doc) => {
          firestoreProjects.push({ id: doc.id, ...doc.data() });
        });
        // Sort firestore projects by createdAt descending
        firestoreProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllProjects([...firestoreProjects, ...localProjects]);
      } catch (error) {
        console.error("Error fetching projects from Firestore:", error);
      }
    };
    fetchFirestoreProjects();
  }, []);

  const filteredProjects = allProjects.filter(
    (p) => activeCategory === 'Todos' || p.category === activeCategory
  );

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    setVisibleCount(prev => prev + 3);
    setIsLoadingMore(false);
  };

  const handleOpenModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    // Delay clearing the project to allow exit animation
    setTimeout(() => setSelectedProject(null), 500);
  };

  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
      <header className="mb-24 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-6 block"
        >
          Nuestro Trabajo
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl text-white mb-12"
        >
          Proyectos <span className="italic text-brand-gold">Seleccionados</span>
        </motion.h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(6); // Reset count on category change
              }}
              className={cn(
                'font-sans text-[10px] tracking-widest uppercase transition-all duration-500 pb-2 border-b-2',
                activeCategory === cat ? 'text-brand-cyan border-brand-cyan' : 'text-gray-500 border-transparent hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
      >
        {displayedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={handleOpenModal} />
        ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className={cn(
              "px-12 py-4 border border-brand-gold text-brand-gold font-sans text-xs uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4",
              isLoadingMore && "bg-brand-gold/10"
            )}
          >
            {isLoadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin"></div>
                Cargando...
              </>
            ) : (
              'Cargar Más Proyectos'
            )}
          </motion.button>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
