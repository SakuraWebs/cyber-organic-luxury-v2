const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('app.post("/api/chat", async (req, res) => {', 'app.post("/api/chat", async (req, res) => {\nconsole.log("INSIDE API CHAT:", process.env.GEMINI_API_KEY);');
fs.writeFileSync('server.ts', server);
