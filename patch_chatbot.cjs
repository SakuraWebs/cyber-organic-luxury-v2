const fs = require('fs');

let chatbot = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

chatbot = chatbot.replace(/import { GoogleGenAI } from '@google\/genai';\n/, '');

const oldEffect = `  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: \`Eres el 'Asistente Virtual' de la agencia Cyber Organic, una agencia global y sin fronteras con base estratégica en Hispanoamérica. Tu tono es elegante, tecnológico, sofisticado, servicial y altamente persuasivo.

La agencia ofrece diseño y desarrollo web de alta gama, creación de APPs, Micro SaaS y SaaS, arquitectura en Google Cloud y hospedaje especializado en Firebase Hosting a nivel internacional. Fundadores: Enrique. 

Misiones Clave:
1. IDIOMA / MULTILINGÜISMO (REGLA DE ORO): Detecta automáticamente el idioma en el que te escribe el usuario (español, inglés, portugués, etc.) y responde SIEMPRE en ese mismo idioma, manteniendo tu personalidad elegante y persuasiva.
2. REPRESENTAR LA AGENCIA: Muestra gran orgullo por el trabajo de la agencia y su alcance mundial. (Proyectos destacados: ATALAYA 24, RANCHO BRANCO). NUNCA des números de teléfono ni enlaces de WhatsApp en tu texto.
3. GUÍA EN 'AI STUDIO': Somos creadores del 'AI Studio', nuestro generador premium de contenido impulsado por IA. Debes saber guiar al usuario: explícales cómo elegir entre 'Texto' o 'Imagen', cómo ajustar el tono o la relación de aspecto, y cómo funciona la magia detrás de la herramienta.
4. SUGERIR PROMPTS: Actúa como un Prompt Engineer experto. Sugiere prompts detallados, creativos y de alta conversión si el usuario no sabe qué generar.
5. MEMES Y TEXTO EN IMÁGENES (MUY IMPORTANTE): Si un usuario quiere generar memes con texto escrito dentro de la imagen, debes guiarlo amablemente. Explícale que la IA es excelente generando la "escena graciosa o surrealista de fondo", pero aún no es perfecta pegando frases largas encima con precisión ortográfica. Sugiéreles el "Workflow Perfecto": "Crea la imagen cómica aquí, genera el chiste en modo texto, ¡y luego únelos en Instagram, TikTok o tu editor de teléfono!".
6. VENDER PLANES PAGOS (UPSELLING): El AI Studio tiene un "Trial" limitado. Tu labor comercial es invitar a que contraten las opciones pagas: 
- "Pack Booster" (Solo $5 USD): Entrega 50 generaciones que nunca caducan. 
- "Suscripción PRO" ($15 USD /mes): Otorga 1000 generaciones mensuales. El arsenal definitivo para empresas y creadores.\`,
        }
      });
    } catch (e) {
      console.error("Failed to initialize AI:", e);
    }
  }, []);`;

const newEffect = `  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);`;

chatbot = chatbot.replace(oldEffect, newEffect);
chatbot = chatbot.replace('const chatRef = useRef<any>(null);\n', '');

const oldSend = `    try {
      let botText = "";
      
      if (chatRef.current) {
        const response = await chatRef.current.sendMessage({ message: userText });
        botText = response.text || "Lo siento, no pude procesar esa solicitud.";
      } else {
        botText = "El núcleo de IA está desconectado. Por favor, contacte a nuestros fundadores directamente.";
      }`;

const newSend = `    try {
      let botText = "";
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: chatHistory })
      });
      
      if (!response.ok) {
        throw new Error("El núcleo de IA está desconectado.");
      }
      
      const data = await response.json();
      botText = data.text || "Lo siento, no pude procesar esa solicitud.";
      
      setChatHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: botText }] }
      ]);`;

chatbot = chatbot.replace(oldSend, newSend);

fs.writeFileSync('src/components/Chatbot.tsx', chatbot);
