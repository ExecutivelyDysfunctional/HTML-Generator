/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PromptForm } from './components/PromptForm';
import { PreviewCanvas } from './components/PreviewCanvas';
import { AppState } from './types';
import { Layout, Sparkles } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    prompt: '',
    isGenerating: false,
    generatedHtml: null,
    error: null,
    viewMode: 'preview',
  });

  const handleGenerate = async (prompt: string) => {
    setState((prev) => ({ ...prev, isGenerating: true, error: null, prompt }));
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate app');
      }

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedHtml: data.html,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message,
      }));
    }
  };

  const handleViewModeChange = (viewMode: 'preview' | 'code') => {
    setState((prev) => ({ ...prev, viewMode }));
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-stone-800">
          <Layout className="w-5 h-5 text-stone-600" />
          <h1 className="text-lg font-medium tracking-tight">Minimalist Generator</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar / Prompt Area */}
        <div className="w-full lg:w-96 bg-white border-r border-stone-200 p-6 flex flex-col shrink-0 lg:h-full overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-stone-800 mb-2">Create an App</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Describe the web application you want to build. Our AI will generate a responsive, single-file HTML app using Tailwind CSS.
            </p>
          </div>
          
          <PromptForm 
            onSubmit={handleGenerate} 
            isGenerating={state.isGenerating} 
            initialPrompt={state.prompt}
          />

          {state.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              <p className="font-medium mb-1">Generation failed</p>
              <p className="opacity-90">{state.error}</p>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col h-[600px] lg:h-full bg-stone-100 relative">
          <PreviewCanvas 
            html={state.generatedHtml} 
            viewMode={state.viewMode}
            onViewModeChange={handleViewModeChange}
            isGenerating={state.isGenerating}
          />
        </div>
      </main>
    </div>
  );
}
