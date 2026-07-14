const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('app.get("/api/test-key", (req, res) => res.json({ key: process.env.GEMINI_API_KEY }));\n', '');
server = server.replace('console.log("TESTING:", process.env.GEMINI_API_KEY); console.log("KEY IS:", process.env.GEMINI_API_KEY);\n', '');
fs.writeFileSync('server.ts', server);
