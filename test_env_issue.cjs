const { createServer: createViteServer } = require("vite");
async function test() {
  console.log("BEFORE Vite:", process.env.GEMINI_API_KEY);
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  console.log("AFTER Vite:", process.env.GEMINI_API_KEY);
  process.exit(0);
}
test();
