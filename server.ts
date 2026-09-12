import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGenAIClient(customApiKey?: string): GoogleGenAI {
  const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Status endpoint to check server environment configuration
  app.get("/api/settings/status", (_req, res) => {
    const hasServerKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0
    );
    res.json({
      hasServerKey,
      defaultModel: "gemini-3.8-flash",
    });
  });

  // Verification endpoint to test custom or server API key
  app.post("/api/settings/verify-key", async (req, res) => {
    try {
      const { apiKey } = req.body;
      const keyToTest = (apiKey && apiKey.trim()) || process.env.GEMINI_API_KEY;

      if (!keyToTest) {
        return res.status(400).json({
          valid: false,
          error: "No API key provided and no default server key is configured in the environment.",
        });
      }

      const testAi = new GoogleGenAI({
        apiKey: keyToTest,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await testAi.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Respond with 'OK'",
        config: {
          maxOutputTokens: 5,
          temperature: 0.1,
        },
      });

      res.json({
        valid: true,
        message: "API key validated successfully!",
        modelUsed: "gemini-3.8-flash",
        response: response.text ? response.text.trim() : "OK",
      });
    } catch (error: any) {
      console.error("API key verification failed:", error);
      res.status(400).json({
        valid: false,
        error: error.message || "Failed to validate API key with Gemini API",
      });
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, apiKey, model = "gemini-3.8-flash", temperature = 0.7 } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const activeKey = (apiKey && apiKey.trim()) || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        return res.status(401).json({
          error: "No Gemini API key provided. Please configure your API key in Settings or set GEMINI_API_KEY in the environment.",
          missingApiKey: true,
        });
      }

      const ai = getGenAIClient(activeKey);

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

      const parsedTemperature = typeof temperature === "number" && !isNaN(temperature)
        ? Math.max(0, Math.min(2, temperature))
        : 0.7;

      const response = await ai.models.generateContent({
        model: model || "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: parsedTemperature,
        },
      });

      let generatedHtml = response.text || "";
      // Clean up markdown code fence wrapper if present
      if (generatedHtml.startsWith("```html")) {
        generatedHtml = generatedHtml.replace(/^```html\n?/, "").replace(/\n?```$/, "");
      } else if (generatedHtml.startsWith("```")) {
        generatedHtml = generatedHtml.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      res.json({ html: generatedHtml.trim() });
    } catch (error: any) {
      console.error("Error generating app:", error);
      const isAuthError =
        error.message?.includes("API_KEY") ||
        error.message?.includes("apiKey") ||
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403;

      res.status(500).json({
        error: error.message || "Failed to generate app",
        missingApiKey: isAuthError,
      });
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
