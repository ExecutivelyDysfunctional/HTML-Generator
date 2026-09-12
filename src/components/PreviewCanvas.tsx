import React from 'react';
import { Code2, MonitorPlay, Loader2 } from 'lucide-react';

interface PreviewCanvasProps {
  html: string | null;
  viewMode: 'preview' | 'code';
  onViewModeChange: (mode: 'preview' | 'code') => void;
  isGenerating: boolean;
}

export function PreviewCanvas({ html, viewMode, onViewModeChange, isGenerating }: PreviewCanvasProps) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Top bar */}
      <div className="h-14 border-b border-stone-200 bg-white/50 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <div className="flex p-1 bg-stone-100 rounded-lg border border-stone-200/60">
          <button
            onClick={() => onViewModeChange('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'code'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-stone-100">
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-stone-50/80 backdrop-blur-sm flex flex-col items-center justify-center text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-stone-400" />
            <p className="font-medium animate-pulse">Crafting your application...</p>
          </div>
        )}

        {!html && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 p-6 text-center">
            <MonitorPlay className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-stone-500">No output yet</p>
            <p className="text-sm mt-1 max-w-sm">
              Describe an app in the sidebar and click generate to see the results here.
            </p>
          </div>
        )}

        {html && (
          <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}>
            {viewMode === 'preview' ? (
              <iframe
                title="Preview"
                srcDoc={html}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full overflow-auto bg-stone-900 text-stone-100 p-6">
                <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                  <code>{html}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
