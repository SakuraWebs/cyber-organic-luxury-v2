const fs = require('fs');
let content = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');

content = content.replace(/'\/api\/create-checkout-session'/, "'/api/create-mercadopago-preference'");
content = content.replace(/Pagos internacionales procesados con encriptación de grado militar vía Stripe\./g, "Pagos procesados de forma segura vía Mercado Pago para toda Latinoamérica.");
content = content.replace(/stripe/i, "Mercado Pago");

fs.writeFileSync('src/pages/AIGenerator.tsx', content);
