import { motion } from 'motion/react';
import { useState } from 'react';
import { Check } from 'lucide-react';
import Payments from '../components/Payments';
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
    title: 'APPs, Micro SaaS y SaaS',
    description: 'Transformamos tu visión en plataformas robustas y escalables. Desarrollamos software a medida, desde Micro SaaS de nicho hasta complejas aplicaciones empresariales (SaaS), enfocados en arquitectura sólida, rendimiento y experiencias de usuario que retienen clientes.',
    icon: Layers,
    features: ['Desarrollo Full-Stack', 'Arquitectura Multi-tenant', 'Lógica de Negocios Compleja', 'Bases de Datos Escalables'],
    color: 'text-brand-gold'
  },
  {
    title: 'Hospedaje en Firebase Hosting',
    description: 'Despliegues ultra rápidos e infraestructura global. A diferencia de los hospedajes tradicionales (que suelen ser lentos y propensos a caídas), Firebase ofrece un CDN global respaldado por Google, certificados SSL automáticos, escalado instantáneo (Serverless) y máxima seguridad sin la carga de administrar servidores.',
    icon: Zap,
    features: ['CDN Global Automático', 'Escalado Serverless', 'Despliegue Continuo (CI/CD)', 'SSL Gratuito y Renovable'],
    color: 'text-white'
  }
];



function ProjectEstimator() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleService = (type: string) => {
    setSelected(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  let timeline = "-";
  let complexity = "-";

  if (selected.length > 0) {
    const hasWeb = selected.includes('Web');
    const hasApp = selected.includes('App');
    const hasSaaS = selected.includes('SaaS');

    let min = 0;
    let max = 0;
    let comp = 0;

    if (hasWeb) { min += 4; max += 6; comp = Math.max(comp, 1); }
    if (hasApp) { min += 8; max += 12; comp = Math.max(comp, 2); }
    if (hasSaaS) { min += 12; max += 16; comp = Math.max(comp, 3); }

    // Overlap discount if more than one
    if (selected.length > 1) {
      min = Math.floor(min * 0.85);
      max = Math.floor(max * 0.85);
    }

    timeline = `${min}-${max} Semanas`;
    
    if (comp === 1) complexity = "Baja";
    else if (comp === 2) complexity = selected.length > 1 ? "Media-Alta" : "Media";
    else if (comp === 3) complexity = selected.length === 3 ? "Muy Alta" : "Alta";
  }

  return (
    <section className="mt-48 pt-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="font-sans text-[10px] tracking-widest text-brand-gold uppercase mb-4 block">Calculadora Interactiva</span>
        <h2 className="font-serif text-4xl text-white mb-6">Estimador de Proyectos</h2>
        <p className="font-sans text-gray-400 text-lg">Selecciona los servicios que requieres para obtener una estimación aproximada de tiempo y complejidad para tu próximo desarrollo.</p>
      </div>

      <div className="bg-brand-surface border border-white/5 p-8 md:p-12 rounded-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {['Web', 'App', 'SaaS'].map(type => {
            const isSelected = selected.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleService(type)}
                className={`flex items-center justify-between p-6 border rounded-sm transition-all duration-300 ${isSelected ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/30'}`}
              >
                <span className={`font-serif text-xl ${isSelected ? 'text-brand-gold' : 'text-white'}`}>{type}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-brand-gold bg-brand-gold' : 'border-white/30'}`}>
                  {isSelected && <Check className="w-4 h-4 text-brand-dark" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left border-t border-white/5 pt-12">
          <div>
            <span className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-2 block">Tiempo Estimado</span>
            <div className="font-serif text-4xl text-white">{timeline}</div>
          </div>
          <div>
            <span className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-2 block">Nivel de Complejidad</span>
            <div className="font-serif text-4xl text-brand-cyan">{complexity}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
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

      <ProjectEstimator />

      <Payments />

      {/* Process Section */}
      <section className="mt-48 pt-32 border-t border-white/5">
        <h2 className="font-serif text-4xl text-white mb-20 text-center">Nuestro Proceso</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Arquitectura', desc: 'Análisis de requisitos y diseño de la infraestructura técnica para tu SaaS o APP.', icon: Target },
            { step: '02', title: 'Desarrollo', desc: 'Programación robusta con interfaces premium y atención obsesiva al detalle.', icon: Layers },
            { step: '03', title: 'Despliegue (Firebase)', desc: 'Lanzamiento y hospedaje serverless garantizando velocidad y escalabilidad global.', icon: Zap },
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
