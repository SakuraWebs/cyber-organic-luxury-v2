import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects as localProjects } from '../data/projects';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User, Briefcase, ExternalLink, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      // Check local projects first
      const localProject = localProjects.find(p => String(p.id) === String(projectId));
      
      if (localProject) {
        setProject(localProject);
        setLoading(false);
        return;
      }

      // If not local, try fetching from Firestore
      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/portafolio');
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate('/portafolio');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24">
      <Helmet>
        <title>{project.title} | CYBER ORGANIC AGENCY</title>
        <meta name="description" content={project.desc} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={project.image.includes('http') ? project.image : `${project.image}.webp`}
          alt={project.alt}
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/portafolio" 
                className="inline-flex items-center gap-2 text-brand-gold font-sans text-[10px] uppercase tracking-widest mb-8 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Volver al Portafolio
              </Link>
              <span className="block font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-4">
                {project.category}
              </span>
              <h1 className="font-serif text-5xl md:text-8xl text-white mb-6 leading-tight">
                {project.title.split(' ')[0]} <br />
                <span className="italic text-brand-gold">{project.title.split(' ').slice(1).join(' ')}</span>
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-8 max-w-7xl mx-auto mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Project Info Sidebar */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12 sticky top-40"
            >
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-brand-cyan mb-1">
                    <User className="w-3 h-3" />
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Cliente</span>
                  </div>
                  <p className="font-serif text-xl text-white">{project.client}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-brand-cyan mb-1">
                    <Calendar className="w-3 h-3" />
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Año</span>
                  </div>
                  <p className="font-serif text-xl text-white">{project.year}</p>
                </div>

                <div className="space-y-4 lg:pt-4">
                  <div className="flex items-center gap-3 text-brand-cyan mb-1">
                    <Briefcase className="w-3 h-3" />
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Servicios</span>
                  </div>
                  <ul className="space-y-2">
                    {project.services.map((service: string, index: number) => (
                      <li key={index} className="flex items-center gap-3 text-gray-400 font-sans text-xs">
                        <ChevronRight className="w-3 h-3 text-brand-gold" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(project.link, '_blank')}
                className="w-full py-5 bg-brand-gold text-brand-dark font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-3"
              >
                Visitar Sitio <ExternalLink className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Project Description & Gallery */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-24"
            >
              <div className="space-y-8">
                <h2 className="font-serif text-3xl text-white italic">El Desafío</h2>
                <p className="font-sans text-gray-400 text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left">
                  {project.fullDesc}
                </p>
              </div>

              <div className="space-y-12">
                {project.gallery.map((img: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative aspect-video overflow-hidden rounded-sm group"
                  >
                    <img
                      src={img.includes('http') ? img : `${img}.webp`}
                      alt={`${project.title} gallery ${index + 1}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-700"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next Project Footer */}
      <section className="mt-48 border-t border-white/10 pt-24 px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand-cyan mb-8 block">
            Siguiente Proyecto
          </span>
          {(() => {
            // Find the index of the current project in local projects
            // If it's a firestore project, just show the first local project as next
            const currentIndex = localProjects.findIndex(p => p.id === project.id);
            const nextProject = currentIndex !== -1 
              ? localProjects[(currentIndex + 1) % localProjects.length]
              : localProjects[0];
              
            return (
              <Link to={`/portafolio/${nextProject.id}`} className="group inline-block">
                <h3 className="font-serif text-5xl md:text-8xl text-white group-hover:text-brand-gold transition-colors duration-500 mb-8">
                  {nextProject.title}
                </h3>
                <div className="flex items-center justify-center gap-4 text-brand-gold group-hover:text-white transition-colors">
                  <span className="font-sans text-xs uppercase tracking-widest">Explorar</span>
                  <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
