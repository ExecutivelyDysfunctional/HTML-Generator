import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
          temperature: 0.7,
        },
      });

      let generatedHtml = response.text || "";
      // Fallback: clean up markdown block if the model included it despite instructions
      if (generatedHtml.startsWith("\`\`\`html")) {
        generatedHtml = generatedHtml.replace(/^\`\`\`html\n?/, "").replace(/\n?\`\`\`$/, "");
      } else if (generatedHtml.startsWith("\`\`\`")) {
        generatedHtml = generatedHtml.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
      }

      res.json({ html: generatedHtml.trim() });
    } catch (error: any) {
      console.error("Error generating app:", error);
      res.status(500).json({ error: error.message || "Failed to generate app" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
