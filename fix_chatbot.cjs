const fs = require('fs');

const content = `import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Send, Cpu } from 'lucide-react';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; href: string }[];
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatHistory, setChatHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      text: 'Iniciando conexión segura...\\nBienvenido a Cyber Organic. Soy tu Asistente Virtual. ¿En qué puedo asistirte hoy?' 
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsTyping(true);

    const currentCount = interactionCount + 1;
    setInteractionCount(currentCount);

    try {
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
      ]);

      let options: Message['options'] = undefined;

      const isCreatorQuestion = /(quien|quién).*(creo|creó|hizo|desarrollo|desarrolló|invento|inventó|programo|programó)/i.test(userText) || /(creador|desarrollador|programador)/i.test(userText);
      
      if (isCreatorQuestion) {
         options = [
          { 
            label: "Conectar con Enrique (WhatsApp)", 
            href: "https://wa.me/55559918125?text=Hola%20Enrique,%20estaba%20hablando%20con%20el%20Asistente%20Virtual%20y%20me%20gustaría%20contactarte." 
          }
        ];
      } else if (currentCount === 3) {
        botText += "\\n\\nHe notado su interés continuo. Para brindarle una experiencia de nivel premium, puedo transferir esta sesión directamente con nuestro fundador, Enrique Fernández.";
        options = [
          { 
            label: "Conectar con Enrique (WhatsApp)", 
            href: "https://wa.me/55559918125?text=Hola%20Enrique,%20vengo%20del%20Asistente%20Virtual%20y%20quisiera%20información." 
          }
        ];
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: botText, options }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: "Error de conexión con el núcleo bio-digital. Por favor, intente nuevamente." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
          >
            <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-dark border border-brand-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] overflow-hidden transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/20 to-brand-gold/20 animate-pulse" />
              <Cpu className="w-6 h-6 text-brand-cyan relative z-10 group-hover:text-brand-gold transition-colors" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] md:w-[380px] h-[550px] max-h-[80vh] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-brand-cyan/10 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-cyan/10 rounded-lg">
                  <Terminal className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-serif italic text-white text-lg leading-none mb-1">Asistente Virtual</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    <span className="font-mono text-[9px] text-brand-cyan uppercase tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={\`flex \${msg.sender === 'user' ? 'justify-end' : 'justify-start'}\`}
                >
                  <div 
                    className={\`max-w-[85%] p-3 rounded-xl \${
                      msg.sender === 'user' 
                        ? 'bg-brand-cyan/10 border border-brand-cyan/20 text-white rounded-tr-sm' 
                        : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm'
                    }\`}
                  >
                    <p className={\`text-sm leading-relaxed whitespace-pre-wrap \${msg.sender === 'bot' ? 'font-mono text-xs' : 'font-sans'}\`}>
                      {msg.text}
                    </p>
                    
                    {/* Action Buttons */}
                    {msg.options && (
                      <div className="mt-4 flex flex-col gap-2">
                        {msg.options.map((opt, i) => (
                          <a
                            key={i}
                            href={opt.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-brand-dark bg-brand-cyan hover:bg-brand-gold transition-colors px-3 py-2.5 rounded-sm text-center uppercase tracking-wider font-bold"
                          >
                            {opt.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/50">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escriba su mensaje..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan/50 focus:bg-white/10 transition-all font-mono"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2 text-brand-cyan hover:text-brand-gold disabled:opacity-50 disabled:hover:text-brand-cyan transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
`;

fs.writeFileSync('src/components/Chatbot.tsx', content);
