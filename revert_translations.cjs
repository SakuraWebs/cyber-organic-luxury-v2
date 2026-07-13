const fs = require('fs');

const tsContent = fs.readFileSync('src/translations.ts', 'utf8');
const esMatch = tsContent.match(/es:\s*({[\s\S]*?}),\n\s*en:/);

let esObj = {};
if (esMatch) {
  esObj = eval('(' + esMatch[1] + ')');
} else {
  console.log("Could not find 'es' object");
  process.exit(1);
}

const files = ['src/pages/Home.tsx', 'src/pages/AIGenerator.tsx', 'src/components/Navbar.tsx', 'src/components/Footer.tsx'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  for (const [key, value] of Object.entries(esObj)) {
    // Replace {t('key')} -> value (for JSX text)
    // We need to be careful. Sometimes we did {t('key')} in JSX text, so we can just replace with value.
    // Wait, if it was in JSX text, we used `{t('key')}` but we might want to just put the raw text `value` if it doesn't contain HTML, or we can just replace `{t('key')}` with `{key === 'key' ? value : value}` no, just `value`.
    const regex1 = new RegExp(`\\{\\s*t\\s*\\(\\s*['"]${key}['"]\\s*\\)\\s*\\}`, 'g');
    content = content.replace(regex1, value);
    
    // Replace t('key') -> "value" (for attributes, template literals, etc)
    const regex2 = new RegExp(`t\\s*\\(\\s*['"]${key}['"]\\s*\\)`, 'g');
    content = content.replace(regex2, JSON.stringify(value));
  }
  
  // Remove import { useLanguage } from '../contexts/LanguageContext';
  content = content.replace(/import\s+\{\s*useLanguage\s*\}\s+from\s+['"][^'"]+['"];?/g, '');
  
  // Remove const { t, language } = useLanguage();
  content = content.replace(/const\s+\{\s*t(?:,\s*language)?\s*\}\s*=\s*useLanguage\(\)\s*;/g, '');
  content = content.replace(/const\s+\{\s*language(?:,\s*t)?\s*\}\s*=\s*useLanguage\(\)\s*;/g, '');
  
  fs.writeFileSync(file, content);
  console.log(`Reverted ${file}`);
}
