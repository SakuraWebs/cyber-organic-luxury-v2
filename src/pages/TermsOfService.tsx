import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-dark pt-40 pb-24 px-8">
      <Helmet>
        <title>Términos de Servicio | CYBER ORGANIC AGENCY</title>
        <meta name="description" content="Términos de Servicio de Cyber Organic Agency." />
      </Helmet>

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
            Términos de <span className="text-brand-gold">Servicio</span>
          </h1>

          <div className="space-y-12 font-sans text-gray-400 text-sm leading-relaxed tracking-wide">
            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos de Servicio 
                y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos 
                términos, tiene prohibido utilizar o acceder a este sitio.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">2. Licencia de Uso</h2>
              <p>
                Se concede permiso para descargar temporalmente una copia de los materiales (información o software) 
                en el sitio web de CYBER ORGANIC AGENCY para visualización transitoria personal y no comercial solamente. 
                Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Modificar o copiar los materiales.</li>
                <li>Utilizar los materiales para cualquier propósito comercial o para cualquier exhibición pública.</li>
                <li>Intentar descompilar o realizar ingeniería inversa de cualquier software contenido en el sitio.</li>
                <li>Eliminar cualquier derecho de autor u otras notaciones de propiedad de los materiales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">3. Descargo de Responsabilidad</h2>
              <p>
                Los materiales en el sitio web de CYBER ORGANIC AGENCY se proporcionan "tal cual". 
                CYBER ORGANIC AGENCY no ofrece garantías, expresas o implícitas, y por la presente renuncia 
                y niega todas las demás garantías, incluyendo, sin limitación, las garantías implícitas 
                o condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción 
                de propiedad intelectual u otra violación de derechos.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">4. Limitaciones</h2>
              <p>
                En ningún caso CYBER ORGANIC AGENCY o sus proveedores serán responsables de cualquier daño 
                (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción 
                del negocio) que surja del uso o la imposibilidad de usar los materiales en el sitio web de 
                CYBER ORGANIC AGENCY.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">5. Exactitud de los Materiales</h2>
              <p>
                Los materiales que aparecen en el sitio web de CYBER ORGANIC AGENCY podrían incluir errores 
                técnicos, tipográficos o fotográficos. CYBER ORGANIC AGENCY no garantiza que ninguno de 
                los materiales en su sitio web sea exacto, completo o actual.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">6. Enlaces</h2>
              <p>
                CYBER ORGANIC AGENCY no ha revisado todos los sitios vinculados a su sitio web y no es 
                responsable de los contenidos de ningún sitio vinculado. La inclusión de cualquier enlace 
                no implica la aprobación por parte de CYBER ORGANIC AGENCY del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-white font-serif text-2xl mb-6 italic">7. Modificaciones</h2>
              <p>
                CYBER ORGANIC AGENCY puede revisar estos términos de servicio para su sitio web en cualquier 
                momento sin previo aviso. Al utilizar este sitio web, usted acepta estar sujeto a la versión 
                actual de estos términos de servicio.
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
