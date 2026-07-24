const fs = require('fs');
let code = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const targetState = `  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);`;
const replState = `  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);`;

const targetEffect = `  useEffect(() => {
    // Verificar si el evento se disparó antes de montar React
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);`;

const replEffect = `  useEffect(() => {
    // Verificar si el evento se disparó antes de montar React
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);`;

const targetApkBtn = `                <button 
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                >
                  Instalar App (PWA)
                </button>`;

const replApkBtn = `                {isStandalone ? (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-transparent text-gray-500 font-bold uppercase tracking-widest text-xs py-3 rounded-lg border border-white/10 opacity-50 cursor-not-allowed"
                  >
                    App Instalada
                  </button>
                ) : (
                  <button 
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                  >
                    Instalar App (PWA)
                  </button>
                )}`;

const targetWinBtn = `                <button 
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                >
                  Instalar en Windows (PWA)
                </button>`;

const replWinBtn = `                {isStandalone ? (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-brand-cyan/5 text-gray-500 font-bold uppercase tracking-widest text-xs py-3 rounded-lg border border-brand-cyan/20 opacity-50 cursor-not-allowed"
                  >
                    App Instalada
                  </button>
                ) : (
                  <button 
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                  >
                    Instalar en Windows (PWA)
                  </button>
                )}`;

if (code.includes(targetState)) {
  code = code.replace(targetState, replState);
}
if (code.includes(targetEffect)) {
  code = code.replace(targetEffect, replEffect);
}
if (code.includes(targetApkBtn)) {
  code = code.replace(targetApkBtn, replApkBtn);
}
if (code.includes(targetWinBtn)) {
  code = code.replace(targetWinBtn, replWinBtn);
}

fs.writeFileSync('src/pages/AIGenerator.tsx', code);
console.log('done');
