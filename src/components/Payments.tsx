import React, { useState, useEffect } from 'react';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const services = [
  { id: 'web', name: 'Web Development', usdPrice: 1000 },
  { id: 'app', name: 'App Development', usdPrice: 2000 },
  { id: 'saas', name: 'SaaS Platform', usdPrice: 3000 },
];

const currencies = [
  { code: 'BRL', symbol: 'R$', rate: 5.5, locale: 'pt-BR' },
  { code: 'UYU', symbol: '$U', rate: 40.0, locale: 'es-UY' },
  { code: 'ARS', symbol: '$', rate: 1000.0, locale: 'es-AR' },
  { code: 'USD', symbol: '$', rate: 1.0, locale: 'en-US' },
];

export default function Payments() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión (ve a AI Studio) para realizar un pago.');
      return;
    }

    setIsLoading(true);
    try {
      const amount = selectedService.usdPrice * selectedCurrency.rate;
      
      const response = await fetch('/api/create-mercadopago-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: selectedService.id,
          name: selectedService.name,
          description: `Pago por ${selectedService.name}`,
          amount: amount,
          currencyId: selectedCurrency.code,
          userEmail: user.email,
          userId: user.uid,
          redirectUrl: '/servicios'
        })
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se pudo generar el enlace de pago.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error al procesar el pago.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatedPrice = selectedService.usdPrice * selectedCurrency.rate;
  const formattedPrice = new Intl.NumberFormat(selectedCurrency.locale, {
    style: 'currency',
    currency: selectedCurrency.code
  }).format(calculatedPrice);

  return (
    <section className="mt-48 pt-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="font-sans text-[10px] tracking-widest text-brand-gold uppercase mb-4 block">Pagos Internacionales</span>
        <h2 className="font-serif text-4xl text-white mb-6">Contrata Nuestros Servicios</h2>
        <p className="font-sans text-gray-400 text-lg">Inicia tu proyecto hoy mismo. Soporte para múltiples divisas en Latinoamérica vía Mercado Pago.</p>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-sm p-5 sm:p-8 md:p-12 max-w-xl mx-auto shadow-2xl w-full">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-4">Selecciona el Servicio</label>
            <div className="grid grid-cols-1 gap-4">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-5 border rounded-sm flex justify-between items-center transition-all ${
                    selectedService.id === s.id 
                      ? 'border-brand-gold bg-brand-gold/5 text-white' 
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <span className="font-serif text-lg">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-4">Moneda Local</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCurrency(c)}
                  className={`py-3 border rounded-sm text-xs font-mono transition-all ${
                    selectedCurrency.code === c.code 
                      ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan' 
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/50 p-6 sm:p-8 rounded-sm border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <span className="text-gray-400 text-sm uppercase tracking-widest text-[10px]">Total a pagar</span>
            <span className="text-2xl sm:text-3xl font-serif text-white break-all">{formattedPrice}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading || !user}
            className="w-full py-5 rounded-sm bg-brand-gold text-brand-dark font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_0_20px_rgba(201,160,80,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CreditCard className="w-5 h-5" />
            )}
            <span>Pagar con Mercado Pago</span>
          </button>

          {!user && (
            <p className="text-center text-xs text-brand-gold mt-4 font-mono">
              * Debes iniciar sesión en la sección AI Studio para proceder con el pago.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-500 text-[10px] uppercase tracking-widest mt-6 text-center">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Pagos 100% seguros. Cifrado de extremo a extremo.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
