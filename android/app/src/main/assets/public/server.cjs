var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      const systemInstruction = `You are an expert frontend developer and designer. Your task is to generate a complete, responsive, single-file HTML web application based on the user's request. 

Constraints & Requirements:
1. Return ONLY valid, raw HTML. Do not wrap the response in markdown code blocks like \`\`\`html.
2. The HTML must be completely self-contained in a single file.
3. Use a minimalist, clean, and modern design language.
4. Use Tailwind CSS via CDN for styling: <script src="https://cdn.tailwindcss.com"></script>
5. Include any necessary Google Fonts if they improve the design.
6. Make the layout responsive (mobile-first approach using Tailwind's sm:, md:, lg: prefixes).
7. If JavaScript is needed, include it within a <script> tag at the bottom of the body.
8. Ensure good accessibility (contrast, semantic HTML).`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      let generatedHtml = response.text || "";
      if (generatedHtml.startsWith("```html")) {
        generatedHtml = generatedHtml.replace(/^\`\`\`html\n?/, "").replace(/\n?\`\`\`$/, "");
      } else if (generatedHtml.startsWith("```")) {
        generatedHtml = generatedHtml.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
      }
      res.json({ html: generatedHtml.trim() });
    } catch (error) {
      console.error("Error generating app:", error);
      res.status(500).json({ error: error.message || "Failed to generate app" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
