import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, Loader2, Wand2, LogIn, LogOut, Crown, Zap, Shield, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Define the public key locally for the frontend initialization
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface UserData {
  email: string;
  role: 'admin' | 'user' | 'pro';
  dailyUsage: number;
  maxDailyUsage: number;
  lastUsageDate: string;
  firstLoginDate?: string; // ISO date string tracking account creation
  deviceId?: string; // Local device fingerprint to prevent sybil attacks
}

export default function AIGenerator() {
  const [generationMode, setGenerationMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  
  // Text generation states
  const [contentType, setContentType] = useState('Marketing Copy');
  const [tone, setTone] = useState('Lujo y Exclusividad');
  const [result, setResult] = useState('');
  
  // Image generation states
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageStyle, setImageStyle] = useState('Fotorealista');
  const [imageResult, setImageResult] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  // Auth & Usage State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [showPaywall, setShowPaywall] = useState(false);

  // Check if limit is reached
  const isLimitReached = userData?.role !== 'admin' && (userData?.dailyUsage ?? 0) >= (userData?.maxDailyUsage ?? 4);

  const contentTypes = [
    'Marketing Copy',
    'Post para Redes Sociales',
    'Idea para Meme / Viral',
    'Contenido para Sitio Web',
    'Introducción de Blog',
    'Email Marketing',
    'Descripción de Producto'
  ];

  const tones = [
    'Lujo y Exclusividad',
    'Tecnológico y Vanguardista',
    'Orgánico y Emocional',
    'Humorístico y Viral (Meme)',
    'Directo y Persuasivo',
    'Corporativo y Profesional'
  ];

  const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  const imageStyles = [
    'Fotorealista',
    'Estilo Meme / Gráfico Cómico',
    'Render 3D Cinematográfico',
    'Ilustración Digital',
    'Acuarela',
    'Cyberpunk',
    'Minimalista',
    'Surrealismo'
  ];

  const quickStarts = [
    {
      label: "Real Estate de Lujo",
      contentType: "Post para Redes Sociales",
      tone: "Lujo y Exclusividad",
      prompt: "Lanzamiento de un nuevo penthouse frente al mar en Punta del Este. Destacar las vistas panorámicas, los acabados de mármol italiano y la privacidad absoluta."
    },
    {
      label: "Tech Startup",
      contentType: "Marketing Copy",
      tone: "Tecnológico y Vanguardista",
      prompt: "Nueva aplicación de gestión patrimonial con inteligencia artificial. Resaltar la seguridad criptográfica, el análisis predictivo y la interfaz minimalista."
    },
    {
      label: "Moda Sostenible",
      contentType: "Email Marketing",
      tone: "Orgánico y Emocional",
      prompt: "Colección de otoño inspirada en la naturaleza. Materiales sostenibles, tonos tierra y producción artesanal de edición limitada."
    }
  ];

  useEffect(() => {
    // Check for checkout success
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      // Small timeout to allow firebase to sync if necessary
      setTimeout(() => {
        setResult("¡Pago completado con éxito! Tus créditos han sido aplicados a tu cuenta.");
        // Clean URL to prevent refresh issues
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 500);
    } else if (params.get('checkout') === 'canceled') {
      setError("El proceso de pago fue cancelado.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreateUserData(currentUser);
      } else {
        setUserData(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchOrCreateUserData = async (currentUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      const today = new Date().toISOString().split('T')[0];
      const nowISO = new Date().toISOString();
      
      // Simple device fingerprinting stored in LocalStorage to prevent multi-accounts
      let localDeviceId = localStorage.getItem('cyber_org_device_id');
      if (!localDeviceId) {
        localDeviceId = crypto.randomUUID();
        localStorage.setItem('cyber_org_device_id', localDeviceId);
      }

      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        const maxDailyUsage = data.maxDailyUsage ?? 4;
        
        let updatePayload: Partial<UserData> = {};
        
        // Ensure legacy users get a creation date
        if (!data.firstLoginDate) {
          updatePayload.firstLoginDate = nowISO;
          data.firstLoginDate = nowISO;
        }
        if (!data.deviceId) {
          updatePayload.deviceId = localDeviceId;
          data.deviceId = localDeviceId;
        }

        // Check if 10-day trial has expired
        const startDate = new Date(data.firstLoginDate);
        const daysSinceCreation = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreation >= 10 && data.role === 'user' && maxDailyUsage > 0) {
          // Trial expired, block credits permanently for free users
          updatePayload.maxDailyUsage = 0;
          data.maxDailyUsage = 0;
        }

        // Reset daily usage if it's a new day
        if (data.lastUsageDate !== today) {
          updatePayload.dailyUsage = 0;
          updatePayload.lastUsageDate = today;
          data.dailyUsage = 0;
          data.lastUsageDate = today;
        }

        
        setUserData({ ...data }); // Set data FIRST so UI always works

        if (Object.keys(updatePayload).length > 0) {
          try {
            await updateDoc(userRef, updatePayload);
          } catch(e) {
            console.warn("Could not sync limit updates to server:", e);
          }
        }
        
        // Mark local device as having an active or expired trial
        localStorage.setItem('cyber_org_trial_used', 'true');
        
      } else {
        // Create new user document
        const isAdmin = currentUser.email === 'enrique.rfm@gmail.com';
        
        // Sybil / Multi-account attack prevention check
        const hasDeviceTrialUsed = localStorage.getItem('cyber_org_trial_used') === 'true';
        // If device has used a trial, and user is not admin, they get 0 credits initially instead of 4
        const initialCredits = isAdmin ? 4 : (hasDeviceTrialUsed ? 0 : 4);

        const newData: UserData = {
          email: currentUser.email || '',
          role: isAdmin ? 'admin' : 'user',
          dailyUsage: 0,
          maxDailyUsage: initialCredits,
          lastUsageDate: today,
          firstLoginDate: nowISO,
          deviceId: localDeviceId
        };
        
        setUserData(newData);

        try {
          await setDoc(userRef, newData);
        } catch(e) {
             console.warn("Could not sync new user to DB. Using local placeholder.", e);
        }
        
        if (!isAdmin) {
          localStorage.setItem('cyber_org_trial_used', 'true');
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error al cargar los datos del usuario.");
    }
  };

  const handleLogin = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      // Optional: Force custom parameters if popup is blocked or failing
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(`Error al iniciar sesión: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription', amount: number, name: string, description: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode,
          amount,
          name,
          description,
          userEmail: user.email,
          userId: user.uid
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      if (err.message.includes('publishable API key')) {
        setError(`Error del Servidor: La llave de Stripe configurada es pública, debe usar la llave Privada/Secreta (Comienza con sk_test o sk_live).`);
      } else {
        setError(`Error al procesar pago: ${err.message}`);
      }
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !user || !userData) return;

    // Check limits before generating
    if (userData.role !== 'admin' && userData.dailyUsage >= userData.maxDailyUsage) {
      setShowPaywall(true); // Open paywall immediately
      // Do not set error and return so they can just use the paywall
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');
    setImageResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      if (generationMode === 'text') {
        const systemInstruction = `Eres un experto copywriter de lujo y estratega digital para la agencia Cyber Organic. Tu objetivo es crear contenido premium, sofisticado y altamente persuasivo. Mantén siempre una excelente ortografía y gramática en español.`;
        
        const userPrompt = `Genera un "${contentType}" con un tono "${tone}". \n\nBasado en la siguiente descripción o palabras clave: \n"${prompt}"\n\nEl contenido debe ser de alta calidad, listo para publicar, y reflejar la estética y valores solicitados. Si es para redes sociales, incluye hashtags relevantes. Si es un copy, asegúrate de que tenga un gancho atractivo y un llamado a la acción (CTA) sutil pero efectivo.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        if (response.text) {
          setResult(response.text);
        } else {
          throw new Error("No se pudo generar el contenido.");
        }
      } else {
        const imagePrompt = `Estilo visual requerido: ${imageStyle}. ${prompt}`;
        
        try {
          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio as any,
            }
          });

          if (response.generatedImages && response.generatedImages.length > 0) {
            const base64EncodeString = response.generatedImages[0].image.imageBytes;
            setImageResult(`data:image/jpeg;base64,${base64EncodeString}`);
          } else {
            throw new Error("No se pudo generar la imagen. Intenta con otra descripción.");
          }
        } catch (imgErr: any) {
          console.error("Error specific to image generation:", imgErr);
          throw new Error(`Error de Imagen: ${imgErr.message}`);
        }
      }
      
      // Update usage in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        dailyUsage: increment(1)
      });
      
      // Update local state
      setUserData(prev => prev ? { ...prev, dailyUsage: prev.dailyUsage + 1 } : null);

      // Auto-open paywall if limit reached
      if (userData.role !== 'admin' && (userData.dailyUsage + 1) >= userData.maxDailyUsage) {
        setShowPaywall(true);
      }

    } catch (err: any) {
      console.error("Error generating content:", err);
      setError(`Hubo un error al conectar con el núcleo de IA. Detalles: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-brand-cyan/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-brand-gold/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Cyber Organic AI Studio</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
              Generador de <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-gold italic">
                Contenido Bio-Digital
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
              Potencia tu mensaje con nuestra inteligencia artificial integrada. Genera copys persuasivos, posts para redes sociales y contenido web con la sofisticación que tu marca merece.
            </p>
          </div>
          
          {/* User Status / Login Button */}
          <div className="flex flex-col items-center md:items-end gap-3">
            {user && userData ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-right backdrop-blur-md">
                <p className="text-sm text-white font-medium mb-1">{user.displayName || user.email}</p>
                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="text-xs font-mono text-gray-400 uppercase">Rol:</span>
                  <span className={`text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm ${userData.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : userData.role === 'pro' ? 'bg-purple-500/20 text-purple-400' : 'bg-brand-cyan/20 text-brand-cyan'}`}>
                    {userData.role}
                  </span>
                </div>
                {userData.role !== 'admin' && (
                  <p className="text-xs text-gray-400 font-mono mb-3">
                    Usos hoy: <span className="text-white">{userData.dailyUsage}</span> / {userData.maxDailyUsage}
                  </p>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors ml-auto"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : null}
          </div>
        </motion.div>

        {!user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wand2 className="w-8 h-8 text-brand-cyan" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-4">Acceso Exclusivo</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              El AI Studio es una herramienta exclusiva. Inicia sesión para acceder. Los usuarios registrados tienen un límite de 4 generaciones por día.
            </p>
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Continuar con Google</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Input Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              {isLimitReached ? (
                <div className="bg-white/5 border border-brand-gold/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(201,160,80,0.1)] text-center">
                  <Crown className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-white mb-2">Límite Diario Alcanzado</h3>
                  <p className="text-gray-400 text-sm mb-6">Has agotado tus generaciones gratuitas. Adquiere créditos extra o eleva tu cuenta a un nivel premium para continuar creando.</p>
                  <button 
                    onClick={() => setShowPaywall(true)}
                    className="w-full bg-brand-gold hover:bg-white text-brand-dark font-bold uppercase tracking-widest text-xs py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(201,160,80,0.3)]"
                  >
                    Ver Planes Disponibles
                  </button>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl">
                  <div className="flex gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setGenerationMode('text')}
                      className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${generationMode === 'text' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-gray-500 hover:text-white'}`}
                    >
                      Texto
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenerationMode('image')}
                      className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${generationMode === 'image' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-500 hover:text-white'}`}
                    >
                      Imagen
                    </button>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-6">
                  
                  {generationMode === 'text' ? (
                    <>
                      {/* Content Type */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono text-brand-cyan uppercase tracking-widest">
                          Tipo de Contenido
                        </label>
                        <div className="relative">
                          <select 
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-brand-cyan/50 transition-colors cursor-pointer"
                          >
                            {contentTypes.map(type => (
                              <option key={type} value={type} className="bg-brand-dark text-white">{type}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                          </div>
                        </div>
                      </div>

                      {/* Tone */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono text-brand-gold uppercase tracking-widest">
                          Tono de Comunicación
                        </label>
                        <div className="relative">
                          <select 
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-brand-gold/50 transition-colors cursor-pointer"
                          >
                            {tones.map(t => (
                              <option key={t} value={t} className="bg-brand-dark text-white">{t}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Aspect Ratio */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono text-brand-cyan uppercase tracking-widest">
                          Relación de Aspecto
                        </label>
                        <div className="relative">
                          <select 
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-brand-cyan/50 transition-colors cursor-pointer"
                          >
                            {aspectRatios.map(ar => (
                              <option key={ar} value={ar} className="bg-brand-dark text-white">{ar}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                          </div>
                        </div>
                      </div>

                      {/* Style */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono text-brand-gold uppercase tracking-widest">
                          Estilo Visual
                        </label>
                        <div className="relative">
                          <select 
                            value={imageStyle}
                            onChange={(e) => setImageStyle(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-brand-gold/50 transition-colors cursor-pointer"
                          >
                            {imageStyles.map(s => (
                              <option key={s} value={s} className="bg-brand-dark text-white">{s}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Prompt */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-widest">
                      Descripción o Palabras Clave
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={generationMode === 'text' 
                        ? "Ej: Lanzamiento de una nueva colección de relojes inteligentes..."
                        : "Ej: Un reloj inteligente brillante sobre un fondo negro abstracto..."}
                      rows={5}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none custom-scrollbar"
                      required
                    />
                  </div>

                  {/* Quick Start (Text Only limit for now) */}
                  {generationMode === 'text' && (
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <label className="block text-xs font-mono text-white/50 uppercase tracking-widest">
                        Ejemplos Rápidos
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {quickStarts.map((qs, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setContentType(qs.contentType);
                              setTone(qs.tone);
                              setPrompt(qs.prompt);
                            }}
                            className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-brand-cyan/20 hover:text-brand-cyan hover:border-brand-cyan/30 transition-colors"
                          >
                            {qs.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full group relative overflow-hidden rounded-lg bg-white text-black font-bold uppercase tracking-widest text-sm py-4 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-white to-brand-gold opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sintetizando...</span>
                        </>
                      ) : (userData?.role !== 'admin' && (userData?.dailyUsage ?? 0) >= (userData?.maxDailyUsage ?? 4)) ? (
                        <span>Obtener Más Créditos</span>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>Generar Contenido</span>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
              )}
            </motion.div>

            {/* Output Area */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-7"
            >
              <div className="h-full min-h-[400px] bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 relative flex flex-col">
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">
                    Resultado Generado
                  </h3>
                  {result && generationMode === 'text' && (
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-cyan hover:text-brand-gold transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                  {imageResult && generationMode === 'image' && (
                    <a 
                      href={imageResult}
                      download="cyber-organic-ai-image.png"
                      className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
                    >
                      <span>Descargar Imagen</span>
                    </a>
                  )}
                </div>

                <div className="flex-grow relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-cyan/50">
                      <div className="w-16 h-16 border-t-2 border-r-2 border-brand-cyan rounded-full animate-spin mb-4" />
                      <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Procesando redes neuronales...</p>
                    </div>
                  ) : error ? (
                    <div className="absolute inset-0 flex items-center justify-center text-red-400/80 text-center p-6">
                      <p className="font-mono text-sm">{error}</p>
                    </div>
                  ) : result && generationMode === 'text' ? (
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-headings:text-white prose-headings:font-serif prose-a:text-brand-cyan overflow-y-auto max-h-[500px] custom-scrollbar pr-4">
                      {/* Render text with basic formatting (handling line breaks) */}
                      {result.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : imageResult && generationMode === 'image' ? (
                    <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-xl">
                      <img 
                        src={imageResult} 
                        alt="Imagen generada por IA" 
                        className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 text-center p-6">
                      <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-light text-lg max-w-sm">
                        Describe tu idea en el panel izquierdo y deja que nuestra IA cree el contenido perfecto para tu marca.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full my-8 space-y-12"
            >
              <button 
                onClick={() => setShowPaywall(false)}
                className="absolute -top-12 right-0 md:-right-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>Volver al resultado</span>
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold font-mono text-xs uppercase tracking-widest mb-4">
                  <Crown className="w-4 h-4" />
                  Nivel Elite Requerido
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-white">Has alcanzado el límite <span className="italic text-brand-cyan">Bio-Digital</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  Para mantener la máxima calidad de nuestra infraestructura de Inteligencia Artificial, los accesos gratuitos están limitados. Desbloquea todo el potencial de Cyber Organic.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Option 1: Pack Inicial */}
                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-colors flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-serif text-white mb-2">Pack Esencial</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">$5</span>
                      <span className="text-gray-400 font-mono text-sm uppercase">USD</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">Recarga inmediata de inteligencia artificial para necesidades creativas de alto impacto y de uso único.</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-cyan shrink-0" />
                      <span className="text-gray-300 text-sm">50 generaciones de texto avanzado o imagen en alta resolución.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-cyan shrink-0" />
                      <span className="text-gray-300 text-sm">Sin caducidad. Úsalos exactamente cuando los necesites.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-cyan shrink-0" />
                      <span className="text-gray-300 text-sm">Derechos comerciales completos para tu marca.</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => handleCheckout('price_esencial', 'payment', 500, 'Pack Esencial', '50 Generaciones Bio-Digitales')}
                    disabled={isLoading}
                    className="w-full bg-transparent hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/20 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Recargar Créditos
                  </button>
                </div>

                {/* Option 2: PRO */}
                <div className="relative bg-gradient-to-b from-brand-gold/10 to-transparent border border-brand-gold/30 rounded-2xl p-8 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(201,160,80,0.1)]">
                  <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark font-bold font-mono text-[10px] uppercase tracking-widest py-1 px-4 rounded-bl-lg">
                    Recomendado
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-serif text-brand-gold mb-2">Cyber Organic PRO</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">$15</span>
                      <span className="text-gray-400 font-mono text-sm uppercase">USD / mes</span>
                    </div>
                    <p className="text-sm text-brand-gold/80 leading-relaxed">La suite completa para marcas de lujo, creadores y agencias que exigen el poder absoluto de la IA.</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-gold shrink-0" />
                      <span className="text-white text-sm font-medium">1000 créditos mensuales renovables.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-gold shrink-0" />
                      <span className="text-white text-sm font-medium">Desbloqueo de Generación de Video IA (Exclusivo PRO).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-gold shrink-0" />
                      <span className="text-white text-sm font-medium">Entrenamiento con el estilo de tu propia marca.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-gold shrink-0" />
                      <span className="text-white text-sm font-medium">Soporte prioritario arquitectónico.</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => handleCheckout('price_pro', 'subscription', 1500, 'Cyber Organic PRO', 'Suscripción Mensual - 1000 Créditos IA')}
                    disabled={isLoading}
                    className="w-full bg-brand-gold hover:bg-white text-brand-dark font-bold uppercase tracking-widest text-xs py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(201,160,80,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                    Actualizar a PRO
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center flex items-center justify-center gap-2 text-gray-400 text-xs font-mono opacity-80">
                <Shield className="w-3 h-3" />
                <span>Pagos internacionales procesados con encriptación de grado militar vía Stripe.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
