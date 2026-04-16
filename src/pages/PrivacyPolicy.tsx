import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-dark pt-40 pb-24 px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand-cyan mb-4 block">
            Legal
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-12 italic">
            Política de <span className="text-brand-gold">Privacidad</span>
          </h1>

          <div className="space-y-12 font-sans text-gray-400 text-sm leading-relaxed tracking-wide">
            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">1. Introducción</h2>
              <p>
                En CYBER ORGANIC AGENCY, valoramos su privacidad y nos comprometemos a proteger sus datos personales. 
                Esta política describe cómo recopilamos, usamos y protegemos su información de acuerdo con la 
                <strong> Lei Geral de Proteção de Dados (LGPD)</strong> de Brasil y otras normativas internacionales.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">2. Datos que Recopilamos</h2>
              <p>
                Podemos recopilar información personal que usted nos proporciona directamente, como su nombre, 
                dirección de correo electrónico y número de teléfono cuando se pone en contacto con nosotros o 
                solicita nuestros servicios. También recopilamos datos técnicos de navegación a través de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">3. Finalidad del Tratamiento</h2>
              <p>
                Utilizamos sus datos para:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Proveer y mejorar nuestros servicios creativos y tecnológicos.</li>
                <li>Responder a sus consultas y solicitudes de soporte.</li>
                <li>Enviar comunicaciones de marketing (siempre con su consentimiento previo).</li>
                <li>Cumplir con obligaciones legales y regulatorias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">4. Sus Derechos (LGPD)</h2>
              <p>
                De acuerdo con la LGPD, usted tiene derecho a:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Confirmar la existencia del tratamiento de sus datos.</li>
                <li>Acceder a sus datos personales.</li>
                <li>Corregir datos incompletos, inexactos o desactualizados.</li>
                <li>Solicitar la anonimización, bloqueo o eliminación de datos innecesarios.</li>
                <li>Revocar su consentimiento en cualquier momento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">5. Seguridad</h2>
              <p>
                Implementamos medidas técnicas y organizativas de seguridad para proteger sus datos contra 
                accesos no autorizados, pérdida o alteración. Sin embargo, ninguna transmisión por Internet 
                es 100% segura.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">6. Contacto</h2>
              <p>
                Para cualquier duda sobre esta política o para ejercer sus derechos, puede contactar con nuestro 
                Encargado de Protección de Datos en: <span className="text-brand-gold">privacidad@cyberorganic.luxury</span>
              </p>
            </section>

            <p className="pt-12 text-[10px] uppercase tracking-widest opacity-50">
              Última actualización: 25 de Marzo de 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
