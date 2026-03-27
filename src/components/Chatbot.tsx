import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `Eres el asistente inteligente de CYBER ORGANIC AGENCY. Tu nombre es 'Bio-Digital Assistant'. 
Eres profesional, sofisticado, y hablas con un tono que mezcla la precisión técnica con la elegancia orgánica. 
Ayudas a los usuarios con preguntas sobre nuestros servicios (Web, Contenido, Marketing), nuestro portafolio (Aura Boutique, Synapse Analytics, Verdant AI, etc.) y nuestra filosofía de diseño 'Bio-Digital'. 
Responde de forma concisa pero inspiradora. 
Si te preguntan por contacto, diles que pueden ir a la sección de contacto o escribir a info@cyberorganic.agency.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Bienvenido a CYBER ORGANIC AGENCY. Soy tu asistente Bio-Digital. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // We send the full history to keep context
      const response = await chat.sendMessage({ message: userMessage });
      const aiText = response.text || "Lo siento, he tenido un pequeño fallo en mi red neuronal. ¿Podrías repetir eso?";
      
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Lo siento, mi conexión con el núcleo digital se ha interrumpido brevemente. Por favor, inténtalo de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-brand-dark border border-white/10 rounded-sm shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-serif text-sm text-white tracking-wider">Bio-Digital Assistant</h3>
                  <p className="text-[10px] text-brand-cyan uppercase tracking-widest">En línea</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                    msg.role === 'user' ? "bg-brand-gold/20" : "bg-brand-cyan/20"
                  )}>
                    {msg.role === 'user' ? <User className="w-3 h-3 text-brand-gold" /> : <Bot className="w-3 h-3 text-brand-cyan" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-sm text-xs leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-brand-gold/10 text-white border border-brand-gold/20" 
                      : "bg-white/5 text-gray-300 border border-white/10"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-brand-cyan" />
                  </div>
                  <div className="p-3 rounded-sm bg-white/5 border border-white/10">
                    <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  aria-label="Escribe tu mensaje"
                  className="flex-grow bg-brand-dark border border-white/10 rounded-sm px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="w-10 h-10 rounded-sm bg-brand-cyan flex items-center justify-center text-brand-dark hover:bg-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        aria-expanded={isOpen}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500",
          isOpen ? "bg-white text-brand-dark rotate-90" : "bg-brand-cyan text-brand-dark"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
