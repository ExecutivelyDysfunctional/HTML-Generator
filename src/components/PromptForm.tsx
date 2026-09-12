import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  initialPrompt?: string;
}

export function PromptForm({ onSubmit, isGenerating, initialPrompt = '' }: PromptFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium text-stone-700">
          App Description
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A Pomodoro timer with a clean UI, start/pause buttons, and a settings modal."
          className="w-full h-40 p-4 bg-white border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-shadow text-stone-800 placeholder:text-stone-400 text-sm leading-relaxed"
          disabled={isGenerating}
        />
      </div>
      <button
        type="submit"
        disabled={!prompt.trim() || isGenerating}
        className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>Generate App</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
