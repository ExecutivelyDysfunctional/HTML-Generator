import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  initialPrompt?: string;
  buttonClass?: string;
}

export function PromptForm({
  onSubmit,
  isGenerating,
  initialPrompt = '',
  buttonClass,
}: PromptFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };

  const submitButtonClasses =
    buttonClass ||
    'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium text-stone-700 dark:text-stone-300">
          App Description
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A Pomodoro timer with a clean UI, start/pause buttons, audio bells, and responsive stats."
          className="w-full h-40 p-4 bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 focus:border-transparent transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm leading-relaxed"
          disabled={isGenerating}
        />
      </div>
      <button
        type="submit"
        disabled={!prompt.trim() || isGenerating}
        className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${submitButtonClasses}`}
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
