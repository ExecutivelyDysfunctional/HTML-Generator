import React, { useState } from 'react';
import { Code2, MonitorPlay, Loader2, Smartphone, Tablet, Monitor, Download } from 'lucide-react';

interface PreviewCanvasProps {
  html: string | null;
  viewMode: 'preview' | 'code';
  onViewModeChange: (mode: 'preview' | 'code') => void;
  isGenerating: boolean;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

export function PreviewCanvas({ html, viewMode, onViewModeChange, isGenerating }: PreviewCanvasProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const devices = [
    { id: 'mobile' as const, label: 'Mobile', icon: Smartphone, desc: '375px' },
    { id: 'tablet' as const, label: 'Tablet', icon: Tablet, desc: '768px' },
    { id: 'desktop' as const, label: 'Desktop', icon: Monitor, desc: '100%' },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top bar */}
      <div className="h-14 border-b border-stone-200 bg-white/50 backdrop-blur flex items-center justify-between px-4 shrink-0 gap-4 flex-wrap">
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

        <div className="flex items-center gap-2">
          {/* Device Size Toggles - only shown when in preview mode */}
          {viewMode === 'preview' && html && (
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200/60">
              {devices.map((device) => {
                const Icon = device.icon;
                const isSelected = deviceSize === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => setDeviceSize(device.id)}
                    title={`${device.label} (${device.desc})`}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{device.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Download Button */}
          {html && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-stone-100">
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-stone-50 flex flex-col">
            {/* Skeleton App Mockup Header */}
            <div className="h-14 border-b border-stone-200/80 bg-white flex items-center justify-between px-6 shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-stone-200/70 animate-pulse" />
                <div className="w-24 h-4 rounded bg-stone-200/70 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-7 rounded-md bg-stone-200/70 animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-stone-200/70 animate-pulse" />
              </div>
            </div>

            {/* Skeleton App Mockup Body */}
            <div className="flex-1 flex overflow-hidden select-none">
              {/* Skeleton Sidebar */}
              <div className="w-56 border-r border-stone-200/80 bg-white p-4 flex flex-col gap-4 shrink-0 hidden sm:flex">
                <div className="w-2/3 h-4 rounded bg-stone-200/70 animate-pulse" />
                <div className="space-y-3 mt-4">
                  <div className="w-full h-8 rounded-lg bg-stone-100 animate-pulse" />
                  <div className="w-5/6 h-8 rounded-lg bg-stone-100 animate-pulse" />
                  <div className="w-full h-8 rounded-lg bg-stone-100 animate-pulse" />
                  <div className="w-4/5 h-8 rounded-lg bg-stone-100 animate-pulse" />
                </div>
              </div>

              {/* Skeleton Main Panel */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-stone-50">
                {/* Visual grid cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-32 rounded-xl border border-stone-200/60 bg-white p-5 space-y-3 shadow-sm">
                    <div className="w-1/3 h-3 rounded bg-stone-200/70 animate-pulse" />
                    <div className="w-2/3 h-6 rounded bg-stone-300/60 animate-pulse" />
                    <div className="w-1/2 h-3 rounded bg-stone-200/50 animate-pulse" />
                  </div>
                  <div className="h-32 rounded-xl border border-stone-200/60 bg-white p-5 space-y-3 shadow-sm">
                    <div className="w-1/4 h-3 rounded bg-stone-200/70 animate-pulse" />
                    <div className="w-1/2 h-6 rounded bg-stone-300/60 animate-pulse" />
                    <div className="w-2/3 h-3 rounded bg-stone-200/50 animate-pulse" />
                  </div>
                  <div className="h-32 rounded-xl border border-stone-200/60 bg-white p-5 space-y-3 shadow-sm">
                    <div className="w-1/2 h-3 rounded bg-stone-200/70 animate-pulse" />
                    <div className="w-3/4 h-6 rounded bg-stone-300/60 animate-pulse" />
                    <div className="w-1/3 h-3 rounded bg-stone-200/50 animate-pulse" />
                  </div>
                </div>

                {/* Larger visual section */}
                <div className="rounded-xl border border-stone-200/60 bg-white p-6 space-y-4 shadow-sm h-64">
                  <div className="w-1/5 h-4 rounded bg-stone-200/70 animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-full h-3 rounded bg-stone-100 animate-pulse" />
                    <div className="w-full h-3 rounded bg-stone-100 animate-pulse" />
                    <div className="w-4/5 h-3 rounded bg-stone-100 animate-pulse" />
                    <div className="w-3/4 h-3 rounded bg-stone-100 animate-pulse" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <div className="w-20 h-8 rounded-lg bg-stone-200/70 animate-pulse" />
                    <div className="w-24 h-8 rounded-lg bg-stone-100 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Loading Dialog with Animated Progress Bar */}
            <div className="absolute inset-0 bg-stone-100/40 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="bg-white border border-stone-200/80 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center max-w-sm mx-4">
                <div className="relative flex items-center justify-center mb-4">
                  <Loader2 className="w-10 h-10 animate-spin text-stone-700" />
                </div>
                <h3 className="font-semibold text-stone-800 text-base mb-1.5">Crafting your application...</h3>
                <p className="text-xs text-stone-500 leading-relaxed mb-5">
                  Translating your prompt into clean markup, responsive Tailwind layouts, and interactive logic.
                </p>
                {/* Horizontal progress bar */}
                <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden relative">
                  <style>{`
                    @keyframes progressMove {
                      0% { left: -40%; width: 40%; }
                      50% { left: 30%; width: 55%; }
                      100% { left: 100%; width: 40%; }
                    }
                  `}</style>
                  <div 
                    className="absolute h-full bg-stone-800 rounded-full" 
                    style={{ animation: 'progressMove 2s infinite ease-in-out' }} 
                  />
                </div>
              </div>
            </div>
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
          <div className={`absolute inset-0 w-full h-full flex items-center justify-center p-4 transition-opacity duration-300 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}>
            {viewMode === 'preview' ? (
              <div
                className={`w-full h-full bg-white transition-all duration-300 ${
                  deviceSize === 'mobile'
                    ? 'max-w-[375px] max-h-[812px] border border-stone-200 shadow-xl rounded-2xl overflow-hidden'
                    : deviceSize === 'tablet'
                    ? 'max-w-[768px] max-h-[1024px] border border-stone-200 shadow-xl rounded-2xl overflow-hidden'
                    : 'max-w-full h-full shadow-none border-0'
                }`}
              >
                <iframe
                  title="Preview"
                  srcDoc={html}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="w-full h-full overflow-auto bg-stone-900 text-stone-100 p-6 rounded-xl border border-stone-800">
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
