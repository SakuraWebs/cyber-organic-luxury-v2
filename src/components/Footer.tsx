import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full py-20 px-12 border-t border-white/5 bg-brand-dark">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        <div>
          <Logo className="mb-8" />
          <p className="font-sans text-xs tracking-widest uppercase text-gray-400 leading-relaxed">
            Elevando la narrativa digital a través de la integración orgánica y la excelencia técnica.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-sans text-xs tracking-[0.3em] text-white uppercase mb-2">Contacto</h5>
          <span className="font-serif italic text-sm text-brand-gold hover:text-brand-cyan transition-colors duration-700 cursor-pointer">
            info@cyberorganicagency.com
          </span>
          <span className="font-serif italic text-sm text-brand-gold hover:text-brand-cyan transition-colors duration-700 cursor-pointer">
            +598 95 467 979
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h5 className="font-sans text-xs tracking-[0.3em] text-white uppercase mb-2">Redes Sociales</h5>
          <div className="flex flex-wrap gap-6">
            <a href="https://www.instagram.com/cyberorganicagency" target="_blank" rel="noopener noreferrer" className="font-sans text-xs tracking-widest uppercase text-gray-400 hover:text-brand-cyan transition-colors duration-700">Instagram</a>
            <a href="https://www.facebook.com/cyberorganicagency" target="_blank" rel="noopener noreferrer" className="font-sans text-xs tracking-widest uppercase text-gray-400 hover:text-brand-cyan transition-colors duration-700">Facebook</a>
            <a href="https://x.com/cyberorganicagency" target="_blank" rel="noopener noreferrer" className="font-sans text-xs tracking-widest uppercase text-gray-400 hover:text-brand-cyan transition-colors duration-700">X</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
        <p className="font-sans text-xs tracking-widest uppercase text-gray-400 text-center">
          © {new Date().getFullYear()} CYBER ORGANIC AGENCY. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <div className="flex gap-8">
          <Link to="/privacidad" className="font-sans text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link>
          <Link to="/terminos" className="font-sans text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  );
}
