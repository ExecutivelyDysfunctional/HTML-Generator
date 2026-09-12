# Minimalist HTML App Generator

A sleek, full-stack web application that generates fully responsive, single-file HTML applications from natural language prompts using Tailwind CSS, vanilla JavaScript, and the Google Gemini API.

---

## 🎨 Visual Preview

The app features a polished, minimalist split-pane layout:
- **Left Panel**: Prompt composer with a clean textarea and single-click execution button.
- **Right Panel**: A dynamic interactive canvas featuring custom skeleton screen animations during active generations, responsive device toggles, and dual views.

---

## ✨ Core Features

### 🚀 Natural Language to Application
- **Zero-Config Code Generation**: Describe what you want to build (e.g., *"A Pomodoro timer with a clean UI, customizable intervals, and sound alerts"*), and our specialized prompt system instantly codes the app.
- **AI-Powered Frontend Engineering**: Powered by `gemini-3.8-flash` via the `@google/genai` SDK, producing clean, structured, semantic HTML, modern Tailwind styling, and working interactive JavaScript.

### 💻 Dual-Mode Canvas
- **Live Preview Mode**: Interact with the generated app directly inside a secure, sandboxed iframe.
- **Source Code Mode**: Inspect the raw markup and JavaScript inside an elegant, dark, word-wrapped code editor.

### 📱 Responsive Device Toggles
- **Real-Time Simulation**: Test layouts across multiple simulated screen viewports with instant-adjust toggles:
  - **Mobile** (375px viewport with simulated physical device boundaries)
  - **Tablet** (768px viewport with subtle drop shadows)
  - **Desktop** (100% fluid scaling)

### 💾 Self-Contained Exports
- **Single-Click Download**: Instantly export your generated web app as a self-contained, offline-ready `index.html` file.
- **CDN-Backed Dependencies**: Styled with Tailwind CSS via CDN and enhanced with premium font pairings via Google Fonts, ensuring zero local dependency setup for your users.

### ⏳ Polished User Experience
- **Animated Skeletons**: High-fidelity skeleton mockups and moving progress indicator lines keep the interface interactive and informative during compilation.
- **Robust Error Handling**: Real-time error boundary rendering with clear status updates in case of connection or prompt issues.

---

## 🛠️ Technology Stack

- **Client Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons), Motion (Animations)
- **Backend Service**: Express Server on Node.js
- **AI Core Integration**: Google GenAI SDK (`@google/genai` utilizing the `gemini-3.8-flash` model)
- **Production Bundler**: `esbuild` for CJS backend compilation, Vite for client build

---

## 🔌 How It Works

```
[ User Prompt ] ➔ [ Express API (/api/generate) ] ➔ [ Gemini 3.8 Flash ]
                                                               │
[ Sandbox Iframe ] 🔀 [ Live Preview / Code View ] 🗂️ 🗄️ ◀── [ Raw HTML ]
```

1. **Prompt Ingestion**: The frontend sends the natural language description to the Express API `/api/generate`.
2. **AI Synthesis**: The backend instructs Gemini using a strict system prompt to structure the response as a single, fully functioning, responsive HTML5 layout featuring modern Tailwind styling.
3. **Sanitization**: The server strips standard Markdown code blocks, outputting only raw, unadorned HTML markup to the frontend.
4. **Sandboxed Rendering**: The frontend displays the HTML inside an iframe restricted by sandbox configurations (`allow-scripts allow-same-origin`) to ensure secure execution.

---

## 🚀 Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the application dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Scripts

Run the following commands using npm:

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Boots up the Express server and Vite middleware in development mode on port `3000`. |
| **Build** | `npm run build` | Builds the client application using Vite and bundles the server using `esbuild` to `dist/server.cjs`. |
| **Production Start** | `npm run start` | Runs the compiled production-ready server from `dist/server.cjs`. |
| **Lint / Verify** | `npm run lint` | Runs TypeScript compilation checking (`tsc --noEmit`) to verify type safety. |
| **Clean** | `npm run clean` | Deletes the build output directories. |

---

## 💡 Prompt Inspiration

Try generating these apps with the generator:
- *"A modern minimalist calculator with pastel button themes, a history tape, and keypress support."*
- *"A gorgeous Kanban task board where I can drag cards between columns, add tags, and filter by priority."*
- *"A sleek weather dashboard with custom graphics, dummy data cards, search bar, and unit toggles (F/C)."*
- *"A Pomodoro focus timer with responsive canvas circular progress bar, ambient sound player, and stats summary."*
