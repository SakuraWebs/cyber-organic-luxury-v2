const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

content = content.replace(/import\s+\{\s*loadMercado Pago\s*\}\s+from\s+'@stripe\/stripe-js';/, '');
content = content.replace(/const stripePromise = loadStripe\(import\.meta\.env\.VITE_STRIPE_PUBLIC_KEY \|\| ''\);/, '');

fs.writeFileSync('src/pages/AIGenerator.tsx', content);
