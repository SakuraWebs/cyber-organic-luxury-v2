const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

content = content.replace(/Stripe/g, 'Mercado Pago');
content = content.replace(/sk_test o sk_live/g, 'APP_USR-');

fs.writeFileSync('src/pages/AIGenerator.tsx', content);
