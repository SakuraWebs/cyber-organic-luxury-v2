const fs = require('fs');
let code = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const targetState = `  const [showPaywall, setShowPaywall] = useState(false);`;
const replState = `  const [showPaywall, setShowPaywall] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };`;

if (code.includes(targetState)) {
  code = code.replace(targetState, replState);
}

const apkTarget = `                <a 
                  href="/downloads/cyber-organic-app.apk"
                  download="CyberOrganic.apk"
                  className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                >
                  Descargar APK
                </a>`;
const apkRepl = `                {deferredPrompt ? (
                  <button 
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                  >
                    Instalar App (PWA)
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-transparent text-gray-500 font-bold uppercase tracking-widest text-xs py-3 rounded-lg border border-white/10 opacity-50 cursor-not-allowed"
                  >
                    App Instalada / No Soportado
                  </button>
                )}`;

const winTarget = `                <a 
                  href="/downloads/cyber-organic-app.exe"
                  download="CyberOrganic.exe"
                  className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                >
                  Descargar para Windows
                </a>`;
const winRepl = `                {deferredPrompt ? (
                  <button 
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                  >
                    Instalar en Windows (PWA)
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-brand-cyan/5 text-gray-500 font-bold uppercase tracking-widest text-xs py-3 rounded-lg border border-brand-cyan/20 opacity-50 cursor-not-allowed"
                  >
                    App Instalada / No Soportado
                  </button>
                )}`;

if (code.includes(apkTarget)) {
  code = code.replace(apkTarget, apkRepl);
  console.log("Replaced APK button");
} else {
  console.log("Could not find APK button");
}

if (code.includes(winTarget)) {
  code = code.replace(winTarget, winRepl);
  console.log("Replaced Windows button");
} else {
  console.log("Could not find Windows button");
}

fs.writeFileSync('src/pages/AIGenerator.tsx', code);
