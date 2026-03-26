import { motion } from 'motion/react';
import { Globe, Share2, BarChart3, Zap, Layers, Target } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Helmet } from 'react-helmet-async';

const services = [
  {
    title: 'Websites de Alta Performance',
    description: 'Desarrollamos ecosistemas digitales que no solo se ven increíbles, sino que están optimizados para la velocidad, el SEO y la conversión. Utilizamos las últimas tecnologías para garantizar una experiencia de usuario fluida y reactiva.',
    icon: Globe,
    features: ['Arquitectura Headless', 'Optimización Core Web Vitals', 'Diseño UX/UI Progresivo', 'Integraciones API'],
    color: 'text-brand-cyan'
  },
  {
    title: 'Producción de Contenido',
    description: 'Creamos narrativas visuales y textuales que capturan la esencia de tu marca. Desde fotografía de alta gama hasta videos cinematográficos para redes sociales, nuestro contenido está diseñado para generar impacto y engagement.',
    icon: Share2,
    features: ['Video Short-form', 'Fotografía Editorial', 'Copywriting Estratégico', 'Diseño de Movimiento'],
    color: 'text-brand-gold'
  },
  {
    title: 'Marketing Digital Estratégico',
    description: 'No solo generamos tráfico, atraemos a la audiencia correcta. Nuestras estrategias de marketing están basadas en datos y orientadas a resultados, asegurando un retorno de inversión sólido y un crecimiento sostenible.',
    icon: BarChart3,
    features: ['Estrategia de Paid Media', 'SEO & SEM Avanzado', 'Email Marketing Automatizado', 'Análisis de Datos'],
    color: 'text-white'
  }
];

export default function Services() {
  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Servicios | CYBER ORGANIC AGENCY</title>
        <meta name="description" content="Descubre nuestros servicios de diseño web de alta performance, producción de contenido cinematográfico y marketing digital estratégico." />
      </Helmet>
      <header className="mb-32">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-6 block"
        >
          Nuestra Experiencia
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl text-white max-w-4xl leading-tight"
        >
          Soluciones Digitales <br />
          <span className="italic text-brand-gold">Sin Compromisos</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 gap-32">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col md:flex-row gap-16 items-start"
          >
            <div className="md:w-1/2">
              <div className={cn("mb-8", service.color)}>
                <service.icon className="w-12 h-12" />
              </div>
              <h2 className="font-serif text-4xl text-white mb-6">{service.title}</h2>
              <p className="font-sans text-gray-400 text-lg leading-relaxed mb-8">
                {service.description}
              </p>
            </div>
            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feature) => (
                <div
                  key={feature}
                  className="p-6 bg-brand-surface border border-white/5 rounded-sm flex items-center gap-4 group hover:border-brand-gold/30 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span className="font-sans text-xs uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Process Section */}
      <section className="mt-48 pt-32 border-t border-white/5">
        <h2 className="font-serif text-4xl text-white mb-20 text-center">Nuestro Proceso</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Descubrimiento', desc: 'Inmersión profunda en tu marca y objetivos.', icon: Target },
            { step: '02', title: 'Creación', desc: 'Diseño y desarrollo con atención obsesiva al detalle.', icon: Zap },
            { step: '03', title: 'Optimización', desc: 'Lanzamiento y refinamiento basado en datos reales.', icon: Layers },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className="w-16 h-16 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-gold transition-colors duration-500">
                <item.icon className="w-6 h-6 text-brand-gold group-hover:text-brand-dark transition-colors" />
              </div>
              <span className="font-sans text-[10px] tracking-widest text-brand-cyan uppercase mb-4 block">{item.step}</span>
              <h4 className="font-serif text-2xl text-white mb-4">{item.title}</h4>
              <p className="font-sans text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
