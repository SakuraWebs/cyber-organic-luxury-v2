import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || '¡Te has unido al desafío de 9 días!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Algo salió mal. Inténtalo de nuevo.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Error de conexión. Inténtalo más tarde.');
    }
  };

  return (
    <section className="px-8 max-w-4xl mx-auto py-24">
      <div className="bg-brand-surface rounded-sm p-12 border border-brand-gold/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand-gold mb-4 block"
          >
            Lead Magnet Exclusivo
          </motion.span>
          
          <h2 className="font-serif text-4xl text-white mb-6">
            El Desafío de <span className="italic">9 Días</span>: <br />
            Escala tu Presencia Bio-Digital
          </h2>
          
          <p className="font-sans text-gray-400 text-sm mb-10 leading-relaxed">
            Nueve correos cuidadosamente diseñados para transformar tu visión estratégica. 
            Aprende a fusionar la precisión de la IA con la esencia orgánica de tu marca.
          </p>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-brand-gold" />
              <p className="font-serif text-xl text-white">{message}</p>
              <p className="text-gray-500 text-sm">El primer paso acaba de ser enviado a tu bandeja.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="bg-brand-dark/50 border border-white/10 rounded-sm px-4 py-3 text-white font-sans text-sm focus:border-brand-gold outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Email Corporativo</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="bg-brand-dark/50 border border-white/10 rounded-sm px-4 py-3 text-white font-sans text-sm focus:border-brand-gold outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-4 w-full py-4 bg-brand-gold text-brand-dark font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Unirme al Desafío Gratis
                  </>
                )}
              </button>
              
              {status === 'error' && (
                <p className="text-red-400 text-xs mt-2 text-center">{message}</p>
              )}
            </form>
          )}
          
          <p className="text-[9px] text-gray-600 mt-8 uppercase tracking-widest">
            Sin spam. Solo valor puro. Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}
