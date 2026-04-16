import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Copy, Check, Loader2, Wand2, LogIn, LogOut } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

interface UserData {
  email: string;
  role: 'admin' | 'user';
  dailyUsage: number;
  maxDailyUsage: number;
  lastUsageDate: string;
}

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('Marketing Copy');
  const [tone, setTone] = useState('Lujo y Exclusividad');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  // Auth & Usage State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const contentTypes = [
    'Marketing Copy',
    'Post para Redes Sociales',
    'Contenido para Sitio Web',
    'Introducción de Blog',
    'Email Marketing',
    'Descripción de Producto'
  ];

  const tones = [
    'Lujo y Exclusividad',
    'Tecnológico y Vanguardista',
    'Orgánico y Emocional',
    'Directo y Persuasivo',
    'Corporativo y Profesional'
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

      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        // Ensure maxDailyUsage exists for older users
        const maxDailyUsage = data.maxDailyUsage ?? 4;
        
        // Reset daily usage if it's a new day
        if (data.lastUsageDate !== today) {
          await updateDoc(userRef, {
            dailyUsage: 0,
            maxDailyUsage,
            lastUsageDate: today
          });
          setUserData({ ...data, dailyUsage: 0, maxDailyUsage, lastUsageDate: today });
        } else {
          setUserData({ ...data, maxDailyUsage });
        }
      } else {
        // Create new user document
        // Enrique is admin by default based on his email
        const isAdmin = currentUser.email === 'enrique.rfm@gmail.com';
        const newData: UserData = {
          email: currentUser.email || '',
          role: isAdmin ? 'admin' : 'user',
          dailyUsage: 0,
          maxDailyUsage: 4,
          lastUsageDate: today
        };
        await setDoc(userRef, newData);
        setUserData(newData);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error al cargar los datos del usuario.");
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !user || !userData) return;

    // Check limits
    if (userData.role !== 'admin' && userData.dailyUsage >= userData.maxDailyUsage) {
      setError(`Has alcanzado tu límite de ${userData.maxDailyUsage} generaciones por día. Vuelve mañana o contacta a los administradores para obtener acceso ilimitado.`);
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `Eres un experto copywriter de lujo y estratega digital para la agencia Cyber Organic. Tu objetivo es crear contenido premium, sofisticado y altamente persuasivo. Mantén siempre una excelente ortografía y gramática en español.`;
      
      const userPrompt = `Genera un "${contentType}" con un tono "${tone}". 
      
Basado en la siguiente descripción o palabras clave: 
"${prompt}"

El contenido debe ser de alta calidad, listo para publicar, y reflejar la estética y valores solicitados. Si es para redes sociales, incluye hashtags relevantes. Si es un copy, asegúrate de que tenga un gancho atractivo y un llamado a la acción (CTA) sutil pero efectivo.`;

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
        
        // Update usage in Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          dailyUsage: increment(1)
        });
        
        // Update local state
        setUserData(prev => prev ? { ...prev, dailyUsage: prev.dailyUsage + 1 } : null);
      } else {
        throw new Error("No se pudo generar el contenido.");
      }
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Hubo un error al conectar con el núcleo de IA. Por favor, verifica tu conexión o intenta nuevamente.");
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
                  <span className={`text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm ${userData.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-cyan/20 text-brand-cyan'}`}>
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
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl">
                <form onSubmit={handleGenerate} className="space-y-6">
                  
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

                  {/* Prompt */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-widest">
                      Descripción o Palabras Clave
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ej: Lanzamiento de una nueva colección de relojes inteligentes con diseño minimalista. Destacar la duración de la batería y los materiales premium."
                      rows={5}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none custom-scrollbar"
                      required
                    />
                  </div>

                  {/* Quick Start */}
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

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading || !prompt.trim() || (userData?.role !== 'admin' && (userData?.dailyUsage ?? 0) >= (userData?.maxDailyUsage ?? 4))}
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
                        <span>Límite Diario Alcanzado</span>
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
                  {result && (
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
                  ) : result ? (
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-headings:text-white prose-headings:font-serif prose-a:text-brand-cyan overflow-y-auto max-h-[500px] custom-scrollbar pr-4">
                      {/* Render text with basic formatting (handling line breaks) */}
                      {result.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 last:mb-0">
                          {line}
                        </p>
                      ))}
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
    </div>
  );
}
