import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, Check, CheckCircle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issue in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const serviceOptions = [
  'Website de Alta Performance',
  'Producción de Contenido',
  'Marketing Digital',
  'Branding & Identidad',
  'E-Commerce Luxury',
  'Consultoría Estratégica'
];

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    description: '',
    budget: '',
    deadline: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'El nombre es requerido';
        else if (value.trim().length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'email':
        if (!value.trim()) error = 'El correo es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Formato de correo inválido';
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-]{7,20}$/.test(value)) error = 'Formato de teléfono inválido';
        break;
      case 'description':
        if (!value.trim()) error = 'La descripción es requerida';
        else if (value.trim().length < 20) error = 'Por favor, cuéntanos un poco más (mín. 20 caracteres)';
        break;
      case 'services':
        if (value.length === 0) error = 'Selecciona al menos un servicio';
        break;
      case 'budget':
        if (!value) error = 'Selecciona un rango de presupuesto';
        break;
      case 'deadline':
        if (!value) error = 'Selecciona un plazo';
        break;
    }
    return error;
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, (formState as any)[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: any) => {
    setFormState(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const toggleService = (service: string) => {
    const newServices = formState.services.includes(service)
      ? formState.services.filter(s => s !== service)
      : [...formState.services, service];
    
    handleChange('services', newServices);
    setTouched(prev => ({ ...prev, services: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formState).forEach(key => {
      const error = validateField(key, (formState as any)[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formState).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = document.getElementById(Object.keys(newErrors)[0]);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/enrique@sakurawebs.com.br', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formState,
          _subject: 'CYBER ORGANIC AGENCY - Nueva Solicitud de Proyecto',
          _template: 'table'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsSuccess(false);
    setFormState({
      name: '',
      email: '',
      phone: '',
      company: '',
      services: [],
      description: '',
      budget: '',
      deadline: ''
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Contacto | CYBER ORGANIC AGENCY</title>
        <meta name="description" content="¿Tienes una visión fuera de lo común? Hablemos de tu próximo proyecto digital de lujo." />
      </Helmet>
      <header className="mb-24">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-6 block"
        >
          Contacto
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl text-white max-w-4xl leading-tight"
        >
          Hablemos de tu <br />
          <span className="italic text-brand-gold">Próximo Proyecto</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Contact Info */}
        <div className="lg:col-span-4">
          <div className="space-y-12 sticky top-40">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-500">
                <Mail className="w-5 h-5 text-brand-gold group-hover:text-brand-dark transition-colors" />
              </div>
              <div>
                <h4 className="font-sans text-[10px] tracking-widest text-brand-cyan uppercase mb-2">Email</h4>
                <p className="font-serif text-xl text-white hover:text-brand-gold transition-colors cursor-pointer">
                  enrique@sakurawebs.com.br
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-500">
                <Phone className="w-5 h-5 text-brand-gold group-hover:text-brand-dark transition-colors" />
              </div>
              <div>
                <h4 className="font-sans text-[10px] tracking-widest text-brand-cyan uppercase mb-2">Teléfono</h4>
                <p className="font-serif text-xl text-white hover:text-brand-gold transition-colors cursor-pointer">
                  +598 2900 1234
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 group">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-500">
                  <MapPin className="w-5 h-5 text-brand-gold group-hover:text-brand-dark transition-colors" />
                </div>
                <div>
                  <h4 className="font-sans text-[10px] tracking-widest text-brand-cyan uppercase mb-2">Ubicación</h4>
                  <p className="font-serif text-xl text-white">
                    Montevideo, Uruguay
                  </p>
                </div>
              </div>
              
              {/* Interactive Map */}
              <div className="h-64 w-full rounded-sm overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <MapContainer 
                  center={[-34.9011, -56.1645]} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%', background: '#101415' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[-34.9011, -56.1645]}>
                    <Popup>
                      <div className="font-sans text-xs">
                        <strong className="text-brand-dark">CYBER ORGANIC AGENCY</strong><br />
                        Montevideo, Uruguay
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8">
          <form noValidate onSubmit={handleSubmit} className="space-y-12 bg-brand-surface/30 p-8 md:p-12 rounded-sm border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={cn(
                    "w-full bg-transparent border-b py-4 font-sans text-white focus:outline-none transition-colors",
                    errors.name && touched.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                  )}
                  placeholder="Tu nombre completo"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={cn(
                    "w-full bg-transparent border-b py-4 font-sans text-white focus:outline-none transition-colors",
                    errors.email && touched.email ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                  )}
                  placeholder="tu@email.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={cn(
                    "w-full bg-transparent border-b py-4 font-sans text-white focus:outline-none transition-colors",
                    errors.phone && touched.phone ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                  )}
                  placeholder="+598 ..."
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Empresa</label>
                <input
                  id="company"
                  type="text"
                  value={formState.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 font-sans text-white focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Nombre de tu empresa"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase block">Tipo de Servicio de Interés</label>
                {errors.services && touched.services && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest">{errors.services}</p>
                )}
              </div>
              <div id="services" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceOptions.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={cn(
                      "flex items-center gap-4 p-4 border transition-all duration-500 text-left",
                      formState.services.includes(service)
                        ? "border-brand-gold bg-brand-gold/5 text-white"
                        : "border-white/5 text-gray-500 hover:border-white/20",
                      errors.services && touched.services && !formState.services.includes(service) && "border-red-500/20"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 border flex items-center justify-center transition-colors",
                      formState.services.includes(service) ? "bg-brand-gold border-brand-gold" : "border-white/20"
                    )}>
                      {formState.services.includes(service) && <Check className="w-3 h-3 text-brand-dark" />}
                    </div>
                    <span className="font-sans text-xs uppercase tracking-widest">{service}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Descripción del Proyecto</label>
              <textarea
                id="description"
                rows={4}
                value={formState.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                className={cn(
                  "w-full bg-transparent border-b py-4 font-sans text-white focus:outline-none transition-colors resize-none",
                  errors.description && touched.description ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                )}
                placeholder="Cuéntanos sobre los objetivos y desafíos de tu proyecto..."
              />
              {errors.description && touched.description && (
                <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Presupuesto Estimado</label>
                <div className="relative">
                  <select
                    id="budget"
                    value={formState.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    onBlur={() => handleBlur('budget')}
                    className={cn(
                      "w-full bg-transparent border-b py-4 font-sans text-white focus:outline-none transition-colors appearance-none",
                      errors.budget && touched.budget ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                    )}
                  >
                    <option value="" className="bg-brand-dark">Selecciona un rango</option>
                    <option value="< 5k" className="bg-brand-dark">Menos de $5,000</option>
                    <option value="5k - 15k" className="bg-brand-dark">$5,000 - $15,000</option>
                    <option value="15k - 50k" className="bg-brand-dark">$15,000 - $50,000</option>
                    <option value="50k+" className="bg-brand-dark">Más de $50,000</option>
                  </select>
                  {errors.budget && touched.budget && (
                    <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">{errors.budget}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] tracking-widest text-gray-500 uppercase">Plazo Deseado</label>
                <div className="relative">
                  <select
                    id="deadline"
                    value={formState.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    onBlur={() => handleBlur('deadline')}
                    className={cn(
                      "w-full bg-transparent border-b py-4 font-sans text-white focus:outline-none transition-colors appearance-none",
                      errors.deadline && touched.deadline ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                    )}
                  >
                    <option value="" className="bg-brand-dark">Selecciona un plazo</option>
                    <option value="1 month" className="bg-brand-dark">1 mes</option>
                    <option value="2-3 months" className="bg-brand-dark">2-3 meses</option>
                    <option value="3-6 months" className="bg-brand-dark">3-6 meses</option>
                    <option value="6 months+" className="bg-brand-dark">Más de 6 meses</option>
                  </select>
                  {errors.deadline && touched.deadline && (
                    <p className="text-red-500 text-[10px] uppercase tracking-widest mt-1">{errors.deadline}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-6 bg-brand-gold text-brand-dark font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando Propuesta...' : (
                <>
                  Enviar Solicitud
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-brand-surface border border-brand-gold/20 p-12 md:p-16 rounded-sm shadow-2xl text-center overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-cyan/5 rounded-full blur-3xl"></div>
              
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center border border-brand-gold/30 mx-auto mb-10"
                >
                  <CheckCircle className="w-12 h-12 text-brand-gold" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-serif text-4xl text-white mb-6"
                >
                  Conexión <span className="italic text-brand-gold">Establecida</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-sans text-gray-400 text-sm leading-relaxed mb-12 max-w-sm mx-auto"
                >
                  Tu mensaje ha sido integrado en nuestro ecosistema digital. 
                  Nuestros arquitectos de marca revisarán tu propuesta y te contactarán en un plazo de 24 a 48 horas.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="px-12 py-4 bg-brand-gold text-brand-dark font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-300"
                >
                  Entendido
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
