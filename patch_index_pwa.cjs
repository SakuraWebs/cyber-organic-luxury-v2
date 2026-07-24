const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `<script>
      if ('serviceWorker' in navigator) {`;
      
const repl = `<script>
      window.deferredPrompt = null;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
      });
      if ('serviceWorker' in navigator) {`;

if (code.includes(target)) {
  code = code.replace(target, repl);
  fs.writeFileSync('index.html', code);
  console.log('index.html updated');
} else {
  console.log('target not found in index.html');
}
