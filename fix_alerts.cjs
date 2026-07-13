const fs = require('fs');

let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

content = content.replace(/const msgs = \{ es: [^}]+\};\s*alert\(msgs\[language\] \|\| msgs.es\);/g, 'alert("Enlace de descarga en desarrollo.");');

fs.writeFileSync('src/pages/AIGenerator.tsx', content);
