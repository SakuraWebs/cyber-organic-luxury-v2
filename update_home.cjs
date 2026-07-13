const fs = require('fs');

let homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');

homeContent = homeContent.replace('Atalaya 24', "{t('home.portfolio.1.title')}");
homeContent = homeContent.replace('Rancho Branco', "{t('home.portfolio.2.title')}");
homeContent = homeContent.replace('Verdant AI', "{t('home.portfolio.3.title')}");
homeContent = homeContent.replace('Neural Interface', "{t('home.portfolio.4.title')}");
homeContent = homeContent.replace('Diseño UX Progresivo', "{t('home.portfolio.4.tag')}");
homeContent = homeContent.replace('Fluid Mechanics', "{t('home.portfolio.5.title')}");
homeContent = homeContent.replace('Serverless Architecture', "{t('home.architecture.tag')}");
homeContent = homeContent.replace('El Poder de <span className="italic text-[#FFCA28]">Firebase Hosting</span>', '{t("home.architecture.title")} <span className="italic text-[#FFCA28]">Firebase Hosting</span>');
homeContent = homeContent.replace('CDN Global de Baja Latencia', "{t('home.architecture.1.title')}");
homeContent = homeContent.replace('Tus aplicaciones se distribuyen automáticamente en servidores perimetrales de Google en todo el mundo. Esto garantiza que tus usuarios experimenten tiempos de carga casi instantáneos, sin importar su ubicación geográfica.', "{t('home.architecture.1.desc')}");
homeContent = homeContent.replace('Zero-Downtime', "{t('home.architecture.2.title')}");
homeContent = homeContent.replace('Despliegues atómicos instantáneos. Cuando actualizas tu APP, el tráfico cambia inmediatamente a la nueva versión sin cortes, asegurando disponibilidad del 99.99%.', "{t('home.architecture.2.desc')}");
homeContent = homeContent.replace('SSL Automático', "{t('home.architecture.3.title')}");
homeContent = homeContent.replace('Certificados SSL gratuitos y auto-renovables provisionados en segundos para tu dominio personalizado. Máxima encriptación de extremo a extremo sin configuración manual.', "{t('home.architecture.3.desc')}");
homeContent = homeContent.replace('Escalabilidad Serverless', "{t('home.architecture.4.title')}");
homeContent = homeContent.replace('Ya sea que tengas 10 usuarios o 10 millones en un pico repentino de tráfico, Firebase ajusta los recursos de forma automática e invisible. Olvídate de aprovisionar servidores o lidiar con balanceadores de carga.', "{t('home.architecture.4.desc')}");
homeContent = homeContent.replace('Latencia & Uptime (Ping en ms)', "{t('home.graph.title')}");
homeContent = homeContent.replace('Comparativa de rendimiento en un pico de tráfico. \\n                  Firebase mantiene estabilidad global, mientras que los servidores compartidos tradicionales colapsan ante la saturación, resultando en caídas de servicio.', "{t('home.graph.desc')}");
homeContent = homeContent.replace('>Firebase Hosting<', ">{t('home.graph.firebase')}<");
homeContent = homeContent.replace('>Servidor Tradicional<', ">{t('home.graph.traditional')}<");
homeContent = homeContent.replace('Filosofía de <br /> <span className="text-brand-gold italic">Diseño</span>', '{t("home.principles.title")} <br /> <span className="text-brand-gold italic">{t("home.principles.title2")}</span>');
homeContent = homeContent.replace('01. Simbiosis', "{t('home.principles.1.title')}");
homeContent = homeContent.replace('Integramos la precisión algorítmica con la imperfección orgánica. Cada interacción debe sentirse natural y predecible, como respirar.', "{t('home.principles.1.desc')}");
homeContent = homeContent.replace('02. Silencio Visual', "{t('home.principles.2.title')}");
homeContent = homeContent.replace('Eliminamos el ruido. Diseñamos espacios que permiten al usuario concentrarse en lo importante, usando el vacío como herramienta.', "{t('home.principles.2.desc')}");
homeContent = homeContent.replace('Testimonios', "{t('home.testimonials.tag')}");
homeContent = homeContent.replace('Voces del <span className="italic text-brand-gold">Ecosistema</span>', '{t("home.testimonials.title1")} <span className="italic text-brand-gold">{t("home.testimonials.title2")}</span>');
homeContent = homeContent.replace('<span className="font-sans text-xs uppercase tracking-widest">Ver Proyecto</span>', '<span className="font-sans text-xs uppercase tracking-widest">{t("home.testimonials.view")}</span>');
homeContent = homeContent.replace('Hospedaje de grado empresarial que escala instantáneamente. Supera las limitaciones de los servidores tradicionales con un ecosistema global sin caídas y ultra rápido.', "{t('home.architecture.subtitle')}");

fs.writeFileSync('src/pages/Home.tsx', homeContent);
