const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/<LanguageProvider>/g, '');
content = content.replace(/<\/LanguageProvider>/g, '');
content = content.replace(/import\s+\{\s*LanguageProvider\s*\}\s+from\s+['"][^'"]+['"];?/g, '');
fs.writeFileSync('src/App.tsx', content);
