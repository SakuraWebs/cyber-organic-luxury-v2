const fs = require('fs');

let content = fs.readFileSync('src/pages/Services.tsx', 'utf8');

// Insert the import for useState
content = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { useState } from 'react';\nimport { Check } from 'lucide-react';");

const estimatorCode = `

function ProjectEstimator() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleService = (type: string) => {
    setSelected(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  let timeline = "-";
  let complexity = "-";

  if (selected.length > 0) {
    const hasWeb = selected.includes('Web');
    const hasApp = selected.includes('App');
    const hasSaaS = selected.includes('SaaS');

    let min = 0;
    let max = 0;
    let comp = 0;

    if (hasWeb) { min += 4; max += 6; comp = Math.max(comp, 1); }
    if (hasApp) { min += 8; max += 12; comp = Math.max(comp, 2); }
    if (hasSaaS) { min += 12; max += 16; comp = Math.max(comp, 3); }

    // Overlap discount if more than one
    if (selected.length > 1) {
      min = Math.floor(min * 0.85);
      max = Math.floor(max * 0.85);
    }

    timeline = \`\${min}-\${max} Semanas\`;
    
    if (comp === 1) complexity = "Baja";
    else if (comp === 2) complexity = selected.length > 1 ? "Media-Alta" : "Media";
    else if (comp === 3) complexity = selected.length === 3 ? "Muy Alta" : "Alta";
  }

  return (
    <section className="mt-48 pt-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="font-sans text-[10px] tracking-widest text-brand-gold uppercase mb-4 block">Calculadora Interactiva</span>
        <h2 className="font-serif text-4xl text-white mb-6">Estimador de Proyectos</h2>
        <p className="font-sans text-gray-400 text-lg">Selecciona los servicios que requieres para obtener una estimación aproximada de tiempo y complejidad para tu próximo desarrollo.</p>
      </div>

      <div className="bg-brand-surface border border-white/5 p-8 md:p-12 rounded-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {['Web', 'App', 'SaaS'].map(type => {
            const isSelected = selected.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleService(type)}
                className={\`flex items-center justify-between p-6 border rounded-sm transition-all duration-300 \${isSelected ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/30'}\`}
              >
                <span className={\`font-serif text-xl \${isSelected ? 'text-brand-gold' : 'text-white'}\`}>{type}</span>
                <div className={\`w-6 h-6 rounded-full border flex items-center justify-center transition-colors \${isSelected ? 'border-brand-gold bg-brand-gold' : 'border-white/30'}\`}>
                  {isSelected && <Check className="w-4 h-4 text-brand-dark" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left border-t border-white/5 pt-12">
          <div>
            <span className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-2 block">Tiempo Estimado</span>
            <div className="font-serif text-4xl text-white">{timeline}</div>
          </div>
          <div>
            <span className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-2 block">Nivel de Complejidad</span>
            <div className="font-serif text-4xl text-brand-cyan">{complexity}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

content = content.replace("export default function Services() {", estimatorCode + "\nexport default function Services() {");

content = content.replace("{/* Process Section */}", "<ProjectEstimator />\n\n      {/* Process Section */}");

fs.writeFileSync('src/pages/Services.tsx', content);
