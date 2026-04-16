import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, Wind, Database, Info, X, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const data = [
  { month: 'Oct', leads: 45, engagement: 72 },
  { month: 'Nov', leads: 52, engagement: 78 },
  { month: 'Dic', leads: 48, engagement: 75 },
  { month: 'Ene', leads: 61, engagement: 84 },
  { month: 'Feb', leads: 75, engagement: 89 },
  { month: 'Mar', leads: 92, engagement: 94 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-dark border border-white/10 p-4 backdrop-blur-xl rounded-sm shadow-2xl">
        <p className="font-sans text-[10px] uppercase tracking-widest text-gray-500 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-serif italic text-white text-sm">{entry.name}:</span>
            <span className="font-mono text-brand-cyan text-sm">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function LivingData() {
  const [showInfo, setShowInfo] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSynthesizing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const metricsInfo = [
    {
      title: "Latencia de Respuesta",
      desc: "La velocidad de sinapsis entre el usuario y el núcleo digital. Menos de 20ms asegura una conexión biológica casi instantánea."
    },
    {
      title: "Tasa de Conversión Real",
      desc: "La eficiencia con la que el ecosistema digital transforma el interés pasivo en acciones vitales para la marca."
    },
    {
      title: "Engagement Orgánico",
      desc: "La profundidad del vínculo entre el organismo digital y su audiencia, medida a través de interacciones naturales y sostenidas."
    }
  ];

  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
      <header className="mb-32">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-brand-cyan mb-6 block"
        >
          Ecosistema Digital
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl text-white max-w-4xl leading-tight"
        >
          Living <span className="italic text-brand-gold">Data</span>
        </motion.h1>
        <p className="mt-8 font-sans text-gray-400 text-lg max-w-2xl">
          Nuestros sitios web no son estáticos. Son organismos digitales que reaccionan y evolucionan con el comportamiento del usuario.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {/* Live Metrics Simulation */}
        <div className="bg-brand-surface p-12 rounded-sm border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Activity className="w-32 h-32 text-brand-cyan" />
          </div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-serif text-3xl text-white">Pulso de Red</h3>
            <button 
              onClick={() => setShowInfo(true)}
              className="text-brand-cyan hover:text-white transition-all p-2 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
              aria-label="Más información"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8 relative z-10">
            {[
              { label: 'Latencia de Respuesta', value: '12ms', progress: 85 },
              { label: 'Tasa de Conversión Real', value: '4.8%', progress: 60 },
              { label: 'Engagement Orgánico', value: '92%', progress: 92 },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex justify-between font-sans text-[10px] tracking-widest uppercase">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className="text-brand-cyan">{stat.value}</span>
                </div>
                <div className="h-1 bg-white/5 w-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-brand-cyan"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-brand-surface p-8 rounded-sm border border-white/5 flex flex-col justify-between group hover:border-brand-gold/30 transition-colors">
            <Zap className="w-8 h-8 text-brand-gold mb-4" />
            <div>
              <h4 className="font-serif text-xl text-white mb-2">Optimización</h4>
              <p className="font-sans text-gray-500 text-xs">99+ PageSpeed Score</p>
            </div>
          </div>
          <div className="bg-brand-surface p-8 rounded-sm border border-white/5 flex flex-col justify-between group hover:border-brand-gold/30 transition-colors">
            <Wind className="w-8 h-8 text-brand-gold mb-4" />
            <div>
              <h4 className="font-serif text-xl text-white mb-2">Reactividad</h4>
              <p className="font-sans text-gray-500 text-xs">Interacciones en &lt;100ms</p>
            </div>
          </div>
          <div className="bg-brand-surface p-8 rounded-sm border border-white/5 flex flex-col justify-between group hover:border-brand-gold/30 transition-colors">
            <Database className="w-8 h-8 text-brand-gold mb-4" />
            <div>
              <h4 className="font-serif text-xl text-white mb-2">Infraestructura</h4>
              <p className="font-sans text-gray-500 text-xs">Edge Computing Global</p>
            </div>
          </div>
          <div className="bg-brand-surface p-8 rounded-sm border border-white/5 flex flex-col justify-between group hover:border-brand-gold/30 transition-colors">
            <Activity className="w-8 h-8 text-brand-gold mb-4" />
            <div>
              <h4 className="font-serif text-xl text-white mb-2">Evolución</h4>
              <p className="font-sans text-gray-500 text-xs">A/B Testing Continuo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Metrics Chart */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-brand-surface p-8 md:p-12 rounded-sm border border-white/5 mb-24"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 text-brand-gold mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Rendimiento Histórico</span>
            </div>
            <h3 className="font-serif text-4xl text-white italic">Crecimiento Bio-Digital</h3>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="font-sans text-[9px] uppercase tracking-widest text-gray-500 mb-1">Total Leads</span>
              <span className="font-mono text-2xl text-brand-cyan">+124%</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[9px] uppercase tracking-widest text-gray-500 mb-1">Avg. Engagement</span>
              <span className="font-mono text-2xl text-brand-gold">86.4%</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full relative group/chart">
          <AnimatePresence>
            {isSynthesizing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center border border-white/5 rounded-sm"
              >
                <div className="w-64 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-brand-cyan uppercase animate-pulse">Sintetizando...</span>
                    <span className="font-mono text-[10px] text-brand-cyan">86%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(0,220,229,0.5)]"
                    />
                  </div>
                  <p className="font-sans text-[8px] text-gray-500 uppercase tracking-widest text-center">Procesando métricas bio-digitales</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanning Line Effect */}
          <motion.div 
            initial={{ left: '-5%' }}
            animate={{ left: '105%' }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-cyan to-transparent z-10 opacity-30 group-hover/chart:opacity-60 transition-opacity"
          />
          
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,220,229,0.8)]"
            />
            <span className="font-mono text-[8px] tracking-[0.3em] text-brand-cyan uppercase">
              {isSynthesizing ? 'Inicializando Núcleo' : 'Datos Sincronizados'}
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Grotesk' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'Space Grotesk' }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '40px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'Space Grotesk' }}
              />
              <Line 
                name="Leads"
                type="monotone" 
                dataKey="leads" 
                stroke="#00dce5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#00dce5', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={3000}
                animationEasing="ease-in-out"
              />
              <Line 
                name="Engagement"
                type="monotone" 
                dataKey="engagement" 
                stroke="#eebd8e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#eebd8e', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={3500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Global Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            key="metrics-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-brand-dark/95 backdrop-blur-2xl flex items-center justify-center p-6"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              key="metrics-modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-brand-surface border border-white/10 p-10 max-w-lg w-full rounded-sm relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl text-brand-gold italic">Glosario de Métricas</h4>
                  <p className="font-sans text-[9px] text-gray-500 uppercase tracking-[0.3em]">
                    Pulso de Red • Cyber Organic
                  </p>
                </div>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-white hover:text-brand-gold transition-colors p-2 bg-white/5 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-6 custom-scrollbar">
                {metricsInfo.map((info) => (
                  <div key={info.title} className="group">
                    <h5 className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-cyan mb-3 font-bold group-hover:text-brand-gold transition-colors">
                      {info.title}
                    </h5>
                    <p className="font-sans text-sm text-gray-400 leading-relaxed border-l border-white/10 pl-6">
                      {info.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-center">
                <p className="font-sans text-[9px] text-gray-600 uppercase tracking-[0.4em]">
                  Procesamiento Biométrico Digital
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
