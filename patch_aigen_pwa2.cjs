const fs = require('fs');
let code = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const targetState = `  // PWA Install State
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
    } else {
      alert("Para instalar la aplicación, abre el sitio en una pestaña nueva (fuera del iframe de vista previa) o usa la opción 'Instalar aplicación' en el menú principal de tu navegador.");
    }
  };`;

const replState = `  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
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
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    } else {
      alert("Para instalar la aplicación, abre el menú principal de tu navegador (los 3 puntos en Chrome) y selecciona 'Instalar aplicación' o 'Añadir a la pantalla de inicio'.\\n\\nNota: El navegador puede ocultar el botón automático si ya está instalada.");
    }
  };`;

if (code.includes(targetState)) {
  code = code.replace(targetState, replState);
  console.log("Replaced JS function");
} else {
  console.log("Could not find JS function");
}

fs.writeFileSync('src/pages/AIGenerator.tsx', code);
