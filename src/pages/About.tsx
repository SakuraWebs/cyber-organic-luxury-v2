import { motion } from 'motion/react';
import { Shield, Zap, Cpu, Palette, Globe } from 'lucide-react';

// 1. IMPORTAÇÃO CORRETA DAS IMAGENS
// Como o arquivo está em src/pages, subimos um nível (..) para entrar em components
// Dentro de src/pages/About.tsx

import imgFlorencia from './components/florencia-perfil.webp';
import imgEnrique from './components/enrique-perfil.webp';

const About = () => {
  const founders = [
    {
      name: "Florencia",
      role: "Chief Design Officer & Sales Lead",
      alias: "El Pulsar",
      description: "Responsable de la estética Ciber-Orgánica, curaduría visual y estrategias de marketing digital. Dirige la producción de contenido y la gestión de redes sociales con un enfoque en el impacto emocional, la sofisticación estética y la conversión premium.",
      image: imgFlorencia, // Usamos a variável importada
      accent: "cyan",
      expertise: ["Ciber-Orgánica", "Visual Curation", "Social Media", "Content Production"]
    },
    {
      name: "Enrique",
      role: "CTO & Solution Architect",
      alias: "El Motor",
      description: "Especialista en arquitectura sobre Google Cloud Platform con enfoque en estándares de certificación ACE. Experto en performance extrema (Core Web Vitals), ciberseguridad e implementación de arquitecturas escalables con Python y Vertex AI.",
      image: imgEnrique, // Usamos a variável importada
      accent: "bronze",
      expertise: ["GCP Architecture", "Cybersecurity", "Vertex AI"]
    }
  ];

  return (
    <div className="pt-32 pb-24 px-8 bg-brand-dark min-h-screen overflow-hidden relative">
      {/* Background Textures/Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-cyan/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <section className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-brand-cyan text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Nosotros</span>
            <h1 className="text-5xl md:text-8xl font-serif italic text-white leading-tight mb-8">
              Donde la Biología <br />
              <span className="text-brand-gold not-italic font-sans font-black tracking-tighter">encuentra la Tecnología</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed font-sans tracking-wide">
              Somos una agencia bio-digital dedicada a la creación de experiencias de lujo que fusionan la precisión técnica con la fluidez orgánica de la naturaleza.
            </p>
          </motion.div>
        </section>

        {/* Founders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/10">
                <div className="flex flex-col md:flex-row">
                  {/* Image Container */}
                  <div className="md:w-1/2 relative overflow-hidden aspect-[4/5]">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${founder.accent === 'cyan' ? 'from-brand-cyan/40' : 'from-brand-gold/40'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>

                  {/* Content Container */}
                  <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${founder.accent === 'cyan' ? 'text-brand-cyan' : 'text-brand-gold'}`}>
                          {founder.alias}
                        </span>
                        {founder.accent === 'cyan' ? <Palette className="w-4 h-4 text-brand-cyan opacity-50" /> : <Cpu className="w-4 h-4 text-brand-gold opacity-50" />}
                      </div>
                      <h2 className="text-3xl font-serif italic text-white mb-1">{founder.name}</h2>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">{founder.role}</p>
                      <p className="text-sm text-gray-400 leading-relaxed mb-8 font-sans">
                        {founder.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="h-px w-full bg-white/10" />
                      <div className="flex flex-wrap gap-2">
                        {founder.expertise.map((skill) => (
                          <span key={skill} className="text-[9px] uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio-Pulse Glow Effect on Hover */}
                <motion.div 
                  className={`absolute -inset-1 ${founder.accent === 'cyan' ? 'bg-brand-cyan/20' : 'bg-brand-gold/20'} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Decorative Number */}
              <span className="absolute -top-10 -left-10 text-[120px] font-serif font-black text-white/5 pointer-events-none select-none">
                0{index + 1}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Core Values / Expertise Section */}
        <section className="mt-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <Shield className="w-8 h-8 text-brand-cyan mb-6" />
              <h3 className="text-xl font-serif italic text-white mb-4">Seguridad Extrema</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Arquitecturas blindadas bajo estándares ACE de Google Cloud.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <Zap className="w-8 h-8 text-brand-gold mb-6" />
              <h3 className="text-xl font-serif italic text-white mb-4">Performance Bio-Digital</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Optimización extrema para una fluidez que se siente natural.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <Globe className="w-8 h-8 text-brand-cyan mb-6" />
              <h3 className="text-xl font-serif italic text-white mb-4">Escalabilidad Global</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Sistemas preparados para el crecimiento con Vertex AI y GCP.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
