const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('app.post("/api/chat", async (req, res) => {', 'app.post("/api/chat", async (req, res) => {\nconsole.log("TESTING:", process.env.GEMINI_API_KEY);');
server = server.replace('app.post("/api/generate", async (req, res) => {', 'app.get("/api/test-key", (req, res) => res.json({ key: process.env.GEMINI_API_KEY }));\napp.post("/api/generate", async (req, res) => {');
fs.writeFileSync('server.ts', server);
