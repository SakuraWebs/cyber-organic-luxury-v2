const fs = require('fs');
let code = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const apkTarget = `                {deferredPrompt ? (
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

const apkRepl = `                <button 
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                >
                  Instalar App (PWA)
                </button>`;

const winTarget = `                {deferredPrompt ? (
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

const winRepl = `                <button 
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                >
                  Instalar en Windows (PWA)
                </button>`;

const jsTarget = `  const handleInstallClick = async () => {
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

const jsRepl = `  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      alert("Para instalar la aplicación, abre el sitio en una pestaña nueva (fuera del iframe de vista previa) o usa la opción 'Instalar aplicación' en el menú principal de tu navegador.");
    }
  };`;

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

if (code.includes(jsTarget)) {
  code = code.replace(jsTarget, jsRepl);
  console.log("Replaced JS function");
} else {
  console.log("Could not find JS function");
}

fs.writeFileSync('src/pages/AIGenerator.tsx', code);
