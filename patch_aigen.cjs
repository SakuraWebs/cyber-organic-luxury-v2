const fs = require('fs');
let code = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

const apkTarget = `                <a 
                  href="#"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert("Enlace de descarga en desarrollo."); 
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                >
                  Descargar APK
                </a>`;
const apkReplacement = `                <a 
                  href="/downloads/cyber-organic-app.apk"
                  download="CyberOrganic.apk"
                  className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3DDC84]/10 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-white/20 hover:border-[#3DDC84]/50"
                >
                  Descargar APK
                </a>`;

const winTarget = `                <a 
                  href="#"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert("Enlace de descarga en desarrollo."); 
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                >
                  Descargar para Windows
                </a>`;
const winReplacement = `                <a 
                  href="/downloads/cyber-organic-app.exe"
                  download="CyberOrganic.exe"
                  className="w-full flex items-center justify-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors border border-brand-cyan/50 hover:border-transparent"
                >
                  Descargar para Windows
                </a>`;

if (code.includes(apkTarget)) {
  code = code.replace(apkTarget, apkReplacement);
  console.log("Replaced APK button");
} else {
  console.log("Could not find APK button");
}

if (code.includes(winTarget)) {
  code = code.replace(winTarget, winReplacement);
  console.log("Replaced Windows button");
} else {
  console.log("Could not find Windows button");
}

fs.writeFileSync('src/pages/AIGenerator.tsx', code);
