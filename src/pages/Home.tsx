import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Leaf, Cpu, Droplets, Share2, Facebook, Globe, Zap, Shield, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Newsletter from '../components/Newsletter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


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

const performanceData = [
  { time: '00:00', firebase: 45, traditional: 350 },
  { time: '04:00', firebase: 48, traditional: 400 },
  { time: '08:00', firebase: 46, traditional: 450 },
  { time: '12:00', firebase: 42, traditional: 2800 },
  { time: '16:00', firebase: 50, traditional: 3500 },
  { time: '20:00', firebase: 47, traditional: 1200 },
  { time: '24:00', firebase: 45, traditional: 380 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-surface border border-white/10 p-4 rounded-sm shadow-xl backdrop-blur-md">
        <p className="font-sans text-white text-xs mb-2">{label}</p>
        <p className="font-sans text-[#FFCA28] text-sm flex items-center justify-between gap-4">
          <span>Firebase:</span> <span className="font-bold">{payload[0].value}ms</span>
        </p>
        <p className="font-sans text-brand-cyan text-sm flex items-center justify-between gap-4">
          <span>Tradicional:</span> <span className="font-bold">{payload[1].value}ms</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [showAuraShare, setShowAuraShare] = useState(false);
  

  const shareUrl = window.location.origin + '/portafolio/1';

  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <header className="relative px-8 max-w-7xl mx-auto mb-32 py-20 overflow-hidden rounded-sm border border-white/5">
        {/* Video Background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-15 scale-110"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-flowing-green-abstract-background-34446-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-transparent to-brand-dark opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark opacity-40"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-6 block"
            >
              Portafolio Curado
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl md:text-8xl font-medium tracking-tight text-white leading-[0.9]"
            >
              Diseño <br />
              <span className="italic text-brand-gold">Bio-Digital</span><br/>
              <span className="text-4xl md:text-6xl text-gray-400">para Marcas de Lujo</span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-sm"
          >
            <p className="font-sans text-gray-400 leading-relaxed text-sm tracking-wide">
              Creamos ecosistemas digitales que respiram, evolucionan y se adaptan. Tecnología invisible, impacto memorable.

            </p>
          </motion.div>
        </div>
      </header>

      {/* Bento Grid Portfolio */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Featured Project: Rancho Branco */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            onClick={() => window.location.href = '/portafolio/2'}
            className="md:col-span-8 group relative overflow-hidden rounded-sm bg-brand-surface h-[600px] cursor-pointer"
          >
            <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
              <img
                alt="Sitio inmersivo y bucólico para Rancho Branco"
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"
                src="https://ranchobranco.com.br/1.1.jpeg"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-12 z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] uppercase tracking-widest font-bold">
                  Diseño Web Inmersivo
                </span>
              </motion.div>
              <h2 className="font-serif text-5xl text-white mb-4">Rancho Branco</h2>
              <p className="font-sans text-gray-400 max-w-md mb-8">
                Refugio hiper-local y entornos bucólicos en medios inmersivos. Conectando la sofisticación rústica con la innovación bio-digital.
              </p>
              <button className="flex items-center gap-4 text-brand-gold group/btn">
                <span className="font-sans text-xs uppercase tracking-widest">Ver Proyecto</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
              </button>
            </div>
            <div className="absolute top-0 right-0 p-8 z-20 flex flex-col items-end gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAuraShare(!showAuraShare);
                }}
                className="w-12 h-12 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
                title="Compartir Proyecto"
                aria-label="Compartir Proyecto"
                aria-expanded={showAuraShare}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              
              <AnimatePresence>
                {showAuraShare && (
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
                    ].map((social) => (
                      <button
                        key={social.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(social.url(shareUrl), '_blank');
                        }}
                        className="w-10 h-10 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 transform hover:scale-110"
                        title={`Compartir en ${social.name}`}
                        aria-label={`Compartir en ${social.name}`}
                      >
                        <social.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Secondary Project: Atalaya 24 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            onClick={() => window.location.href = '/portafolio/1'}
            className="md:col-span-4 group relative overflow-hidden rounded-sm bg-brand-surface h-[600px] cursor-pointer"
          >
            <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
              <img
                alt="Diseño web y sistemas para Atalaya 24"
                className="w-full h-full object-cover object-top opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"
                src="https://atalaya24.com/wp-content/uploads/2026/01/ELIAS.webp"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark to-transparent opacity-60"></div>
            </div>
            <div className="absolute inset-0 p-10 flex flex-col justify-end relative z-10">
              <h3 className="font-serif text-3xl text-white mb-3">Atalaya 24</h3>
              <p className="font-sans text-gray-400 text-xs uppercase tracking-widest leading-loose mb-6">
                Sistemas de IA & Arquitectura digital.
              </p>
              <div className="h-1 w-0 bg-brand-gold group-hover:w-full transition-all duration-700"></div>
            </div>
          </motion.div>

          {/* Third Project: Verdant AI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="md:col-span-4 group relative overflow-hidden rounded-sm bg-brand-surface h-[450px] cursor-pointer"
          >
            <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105">
              <img
                alt="Campaña de marketing digital Verdant AI"
                className="w-full h-full object-cover opacity-50 mix-blend-soft-light transition-all duration-1000"
                src="https://picsum.photos/seed/green-tech/800/800.webp"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 p-10 flex flex-col justify-between border-t-2 border-transparent group-hover:border-brand-gold transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[10px] tracking-widest text-brand-cyan border border-brand-cyan/30 px-2 py-1 uppercase">
                    Sostenibilidad
                  </span>
                  <span className="font-sans text-[8px] tracking-widest text-white/70 bg-white/10 px-2 py-0.5 rounded-sm uppercase border border-white/20">
                    Demo
                  </span>
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Leaf className="w-5 h-5 text-brand-gold" />
                </motion.div>
              </div>
              <div>
                <h3 className="font-serif text-3xl text-white mb-2">Verdant AI</h3>
                <p className="font-sans text-gray-400 text-sm">
                  Algoritmos de crecimiento vegetal aplicados al diseño generativo urbano.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Small Grid Items */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-brand-surface rounded-sm p-8 flex flex-col justify-center border border-white/5 hover:border-brand-cyan/40 transition-colors">
              <Cpu className="w-8 h-8 text-brand-cyan mb-4" />
              <h4 className="font-serif text-xl text-white mb-2">Neural Interface</h4>
              <p className="font-sans text-gray-500 text-xs tracking-wider uppercase">Diseño UX Progresivo</p>
            </div>
            <div className="flex-1 bg-brand-gold p-8 rounded-sm flex flex-col justify-between group">
              <div className="flex justify-end">
                <Droplets className="w-12 h-12 text-brand-dark opacity-20 group-hover:scale-125 transition-transform" />
              </div>
              <div>
                <h4 className="font-serif text-xl text-brand-dark mb-1">Fluid Mechanics</h4>
                <p className="font-sans text-brand-dark/80 text-[10px] tracking-widest uppercase font-bold">
                  Instalaciones Digitales
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="md:col-span-4 bg-white/5 rounded-sm p-12 flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-cyan/5 to-transparent"></div>
            <h3 className="font-serif text-2xl text-white mb-6 relative z-10">
              ¿Tienes una visión <br /> fuera de lo común?
            </h3>
            <p className="font-sans text-gray-400 text-sm mb-8 relative z-10">
              Colaboremos para crear la próxima frontera de la experiencia digital de lujo.
            </p>
            <Link
              to="/contacto"
              className="px-8 py-3 border border-brand-gold text-brand-gold font-sans text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 relative z-10"
            >
              Iniciar Proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* Firebase Hosting Bento Grid */}
      <section className="px-8 max-w-7xl mx-auto my-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#FFCA28] mb-6 block">Serverless Architecture</span>
          <h2 className="font-serif text-5xl text-white mb-6">El Poder de <span className="italic text-[#FFCA28]">Firebase Hosting</span></h2>
          <p className="font-sans text-gray-400 text-sm leading-relaxed">
            Hospedaje de grado empresarial que escala instantáneamente. Supera las limitaciones de los servidores tradicionales con un ecosistema global sin caídas y ultra rápido.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Global CDN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-brand-surface border border-white/5 p-12 rounded-sm relative overflow-hidden group hover:border-[#FFCA28]/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-48 h-48 text-[#FFCA28]" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-[#FFCA28]/10 flex items-center justify-center rounded-sm mb-6">
                  <Globe className="w-6 h-6 text-[#FFCA28]" />
                </div>
                <h3 className="font-serif text-3xl text-white mb-4">CDN Global de Baja Latencia</h3>
                <p className="font-sans text-gray-400 text-sm max-w-md leading-relaxed">
                  Tus aplicaciones se distribuyen automáticamente en servidores perimetrales de Google en todo el mundo. Esto garantiza que tus usuarios experimenten tiempos de carga casi instantáneos, sin importar su ubicación geográfica.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Zero Downtime */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 bg-brand-dark border border-white/5 p-12 rounded-sm relative overflow-hidden group hover:border-brand-cyan/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-cyan/10 flex items-center justify-center rounded-sm mb-6">
                <Zap className="w-6 h-6 text-brand-cyan" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">Zero-Downtime</h3>
              <p className="font-sans text-gray-400 text-xs leading-relaxed">
                Despliegues atómicos instantáneos. Cuando actualizas tu APP, el tráfico cambia inmediatamente a la nueva versión sin cortes, asegurando disponibilidad del 99.99%.
              </p>
            </div>
          </motion.div>

          {/* Automatic SSL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-[#FFCA28]/5 border border-[#FFCA28]/10 p-12 rounded-sm relative overflow-hidden group hover:bg-[#FFCA28]/10 transition-all duration-500"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#FFCA28]/20 flex items-center justify-center rounded-sm mb-6">
                <Shield className="w-6 h-6 text-[#FFCA28]" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-4">SSL Automático</h3>
              <p className="font-sans text-gray-400 text-xs leading-relaxed">
                Certificados SSL gratuitos y auto-renovables provisionados en segundos para tu dominio personalizado. Máxima encriptación de extremo a extremo sin configuración manual.
              </p>
            </div>
          </motion.div>

          {/* Scale to Infinity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 bg-brand-surface border border-white/5 p-12 rounded-sm relative overflow-hidden group hover:border-brand-gold/30 transition-all duration-500"
          >
            <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
               <Server className="w-64 h-64 text-brand-gold" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center rounded-sm mb-6">
                <Server className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="font-serif text-3xl text-white mb-4">Escalabilidad Serverless</h3>
              <p className="font-sans text-gray-400 text-sm max-w-md leading-relaxed">
                Ya sea que tengas 10 usuarios o 10 millones en un pico repentino de tráfico, Firebase ajusta los recursos de forma automática e invisible. Olvídate de aprovisionar servidores o lidiar con balanceadores de carga.
              </p>
            </div>
          </motion.div>

          {/* Performance Graph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-12 bg-brand-dark border border-white/5 p-8 md:p-12 rounded-sm relative overflow-hidden group hover:border-white/10 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
              <div>
                <h3 className="font-serif text-3xl text-white mb-2">Latencia & Uptime (Ping en ms)</h3>
                <p className="font-sans text-gray-400 text-sm max-w-xl">
                  Comparativa de rendimiento en un pico de tráfico. 
                  Firebase mantiene estabilidad global, mientras que los servidores compartidos tradicionales colapsan ante la saturación, resultando en caídas de servicio.
                </p>
              </div>
              <div className="flex items-center gap-6 font-sans text-xs uppercase tracking-widest flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFCA28]"></div>
                  <span className="text-gray-300">Firebase Hosting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-cyan"></div>
                  <span className="text-gray-300">Servidor Tradicional</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFirebase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFCA28" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFCA28" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="traditional" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorTrad)" />
                  <Area type="monotone" dataKey="firebase" stroke="#FFCA28" strokeWidth={3} fillOpacity={1} fill="url(#colorFirebase)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter / Lead Magnet */}
      <Newsletter />

      {/* Aesthetic Divider */}
      <div className="py-32 flex justify-center opacity-20">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-brand-cyan to-transparent"></div>
      </div>

      {/* Expertise Teaser */}
      <section className="max-w-7xl mx-auto px-8 mb-48">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3">
            <h2 className="font-serif text-4xl text-white leading-tight">
              Filosofía de <br /> <span className="text-brand-gold italic">Diseño</span>
            </h2>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-sans text-xs tracking-[0.3em] text-brand-cyan uppercase mb-4">01. Simbiosis</h4>
              <p className="font-sans text-gray-400 text-sm leading-relaxed">
                No vemos la tecnología como una herramienta, sino como una extensión de la naturaleza.
                Cada línea de código es una fibra nerviosa.
              </p>
            </div>
            <div>
              <h4 className="font-sans text-xs tracking-[0.3em] text-brand-cyan uppercase mb-4">02. Silencio Visual</h4>
              <p className="font-sans text-gray-400 text-sm leading-relaxed">
                El verdadero lujo reside en lo que no está. Abrazamos el vacío para dejar que la esencia
                del producto brille sin ruido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-brand-surface/30 py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-6 block">Testimonios</span>
            <h2 className="font-serif text-5xl text-white">Voces del <span className="italic text-brand-gold">Ecosistema</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                quote: "La fusión entre arte y tecnología que lograron para Aura Boutique superó todas nuestras expectativas. No es solo un sitio web, es una experiencia sensorial.",
                author: "Elena V.",
                company: "Aura Boutique"
              },
              {
                quote: "CYBER ORGANIC entiende el lujo digital como nadie. Su enfoque en la visualización de datos biométricos ha revolucionado cómo nuestros clientes interactúan con su salud.",
                author: "Dr. Julian M.",
                company: "Synapse Analytics"
              },
              {
                quote: "Trabajar con ellos es entrar en una nueva dimensión del diseño. Su capacidad para traducir conceptos orgánicos en interfaces digitales es simplemente magistral.",
                author: "Sofía R.",
                company: "Verdant AI"
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col justify-between p-8 border border-white/5 hover:border-brand-gold/30 transition-colors duration-500 bg-brand-dark/40"
              >
                <div className="mb-8">
                  <span className="text-brand-gold text-4xl font-serif leading-none block mb-4">“</span>
                  <p className="font-serif text-xl text-gray-300 leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>
                <div>
                  <div className="h-px w-8 bg-brand-cyan mb-4"></div>
                  <h4 className="font-sans text-sm text-white font-bold uppercase tracking-widest">{t.author}</h4>
                  <p className="font-sans text-[10px] text-brand-cyan uppercase tracking-[0.2em] mt-1">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
