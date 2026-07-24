const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
const target = `<link rel="apple-touch-icon" href="/og-image.png" />`;
const repl = `<link rel="apple-touch-icon" href="/og-image.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#3DDC84" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('SW registration failed:', err);
          });
        });
      }
    </script>`;
if (code.includes(target)) {
  code = code.replace(target, repl);
  fs.writeFileSync('index.html', code);
  console.log('index.html updated');
} else {
  console.log('target not found in index.html');
}
