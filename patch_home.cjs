const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const targetStr = `          {/* Main Featured Project: Atalaya 24 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            onClick={() => window.location.href = '/portafolio/1'}
            className="md:col-span-8 group relative overflow-hidden rounded-sm bg-brand-surface h-[600px] cursor-pointer"
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
                  Sistemas de IA & Web
                </span>
              </motion.div>
              <h2 className="font-serif text-5xl text-white mb-4">Atalaya 24</h2>
              <p className="font-sans text-gray-400 max-w-md mb-8">
                Arquitectura digital y biométrica de vanguardia enfocada en transmitir eficiencia y
                liderazgo transfronterizo en seguridad interactiva.
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
                      { icon: Facebook, name: 'Facebook', url: (u: string) => \`https://www.facebook.com/sharer/sharer.php?u=\${u}\` },
                      { icon: XIcon, name: 'X', url: (u: string) => \`https://twitter.com/intent/tweet?url=\${u}\` },
                      { icon: WhatsAppIcon, name: 'WhatsApp', url: (u: string) => \`https://api.whatsapp.com/send?text=\${encodeURIComponent('Mira este proyecto de CYBER ORGANIC: ' + u)}\` },
                    ].map((social) => (
                      <button
                        key={social.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(social.url(shareUrl), '_blank');
                        }}
                        className="w-10 h-10 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 transform hover:scale-110"
                        title={\`Compartir en \${social.name}\`}
                        aria-label={\`Compartir en \${social.name}\`}
                      >
                        <social.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Secondary Project: Rancho Branco */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            onClick={() => window.location.href = '/portafolio/2'}
            className="md:col-span-4 group relative overflow-hidden rounded-sm bg-brand-surface h-[600px] cursor-pointer"
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
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark to-transparent opacity-60"></div>
            </div>
            <div className="absolute inset-0 p-10 flex flex-col justify-end relative z-10">
              <h3 className="font-serif text-3xl text-white mb-3">Rancho Branco</h3>
              <p className="font-sans text-gray-400 text-xs uppercase tracking-widest leading-loose mb-6">
                Refugio hiper-local y entornos bucólicos en medios inmersivos.
              </p>
              <div className="h-1 w-0 bg-brand-gold group-hover:w-full transition-all duration-700"></div>
            </div>
          </motion.div>`;

const replacementStr = `          {/* Main Featured Project: Rancho Branco */}
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
                      { icon: Facebook, name: 'Facebook', url: (u: string) => \`https://www.facebook.com/sharer/sharer.php?u=\${u}\` },
                      { icon: XIcon, name: 'X', url: (u: string) => \`https://twitter.com/intent/tweet?url=\${u}\` },
                      { icon: WhatsAppIcon, name: 'WhatsApp', url: (u: string) => \`https://api.whatsapp.com/send?text=\${encodeURIComponent('Mira este proyecto de CYBER ORGANIC: ' + u)}\` },
                    ].map((social) => (
                      <button
                        key={social.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(social.url(shareUrl), '_blank');
                        }}
                        className="w-10 h-10 rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 transform hover:scale-110"
                        title={\`Compartir en \${social.name}\`}
                        aria-label={\`Compartir en \${social.name}\`}
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
          </motion.div>`;

if (code.includes('Atalaya 24')) {
  // Let's do a more robust replace by slicing if it fails
  if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/pages/Home.tsx', code);
    console.log("Successfully replaced string");
  } else {
    console.log("Exact target string not found. Trying via AST or regex.");
  }
} else {
  console.log("Could not find Atalaya 24 in file.");
}
