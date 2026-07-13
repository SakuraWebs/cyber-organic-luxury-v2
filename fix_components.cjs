const fs = require('fs');

const files = ['src/components/Footer.tsx', 'src/components/Navbar.tsx'];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<LanguageSwitcher\s*\/>/g, '');
    content = content.replace(/import\s+LanguageSwitcher\s+from\s+['"]\.\/LanguageSwitcher['"];?/g, '');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
