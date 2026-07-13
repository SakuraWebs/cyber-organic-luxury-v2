const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /res\.status\(200\)\.json\(\{ sessionId: session\.id, url: session\.url \}\);\s*\} catch \(e: any\) \{\s*console\.error\("Stripe Checkout Error:", e\);\s*res\.status\(500\)\.json\(\{ error: e\.message \}\);\s*\}\s*\}\);/g;
content = content.replace(regex, "");

fs.writeFileSync('server.ts', content);
