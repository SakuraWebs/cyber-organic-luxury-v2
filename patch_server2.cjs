const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace("const { priceId, mode, amount, name, description, userEmail, userId } = req.body;", "const { priceId, mode, amount, name, description, userEmail, userId, currencyId } = req.body;");

fs.writeFileSync('server.ts', content);
