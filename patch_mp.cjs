const fs = require('fs');

// 1. Patch server.ts
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  `unit_price: amount / 100, // Amount was in cents for Stripe, convert to whole units
              currency_id: "BRL"`,
  `unit_price: amount,
              currency_id: currencyId || "BRL"`
);

// We should also allow dynamic redirect URLs from req.body
server = server.replace(
  `back_urls: {
            success: \`\${appUrl}/ai-studio?checkout=success\`,
            pending: \`\${appUrl}/ai-studio?checkout=pending\`,
            failure: \`\${appUrl}/ai-studio?checkout=canceled\`
          }`,
  `back_urls: {
            success: req.body.redirectUrl ? \`\${appUrl}\${req.body.redirectUrl}?checkout=success\` : \`\${appUrl}/ai-studio?checkout=success\`,
            pending: req.body.redirectUrl ? \`\${appUrl}\${req.body.redirectUrl}?checkout=pending\` : \`\${appUrl}/ai-studio?checkout=pending\`,
            failure: req.body.redirectUrl ? \`\${appUrl}\${req.body.redirectUrl}?checkout=canceled\` : \`\${appUrl}/ai-studio?checkout=canceled\`
          }`
);

fs.writeFileSync('server.ts', server);

// 2. Patch AIGenerator.tsx to use whole amounts instead of cents
let aigen = fs.readFileSync('src/pages/AIGenerator.tsx', 'utf8');
aigen = aigen.replace(/handleCheckout\('price_esencial', 'payment', 500,/g, "handleCheckout('price_esencial', 'payment', 5,");
aigen = aigen.replace(/handleCheckout\('price_pro', 'subscription', 1500,/g, "handleCheckout('price_pro', 'subscription', 15,");
fs.writeFileSync('src/pages/AIGenerator.tsx', aigen);
