import React, { useState } from 'react';
import { Code2, MonitorPlay, Loader2, Smartphone, Tablet, Monitor, Download } from 'lucide-react';
import { CanvasBackground } from '../types';

interface PreviewCanvasProps {
  html: string | null;
  viewMode: 'preview' | 'code';
  onViewModeChange: (mode: 'preview' | 'code') => void;
  isGenerating: boolean;
  canvasBackground?: CanvasBackground;
  accentButtonClass?: string;
}

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

export function PreviewCanvas({
  html,
  viewMode,
  onViewModeChange,
  isGenerating,
  canvasBackground = 'plain',
  accentButtonClass,
}: PreviewCanvasProps) {
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

  // Derive canvas backdrop style classes
  const getBackdropClass = () => {
    switch (canvasBackground) {
      case 'dots':
        return 'bg-stone-100 dark:bg-stone-950 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] dark:bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px]';
      case 'grid':
        return 'bg-stone-100 dark:bg-stone-950 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#292524_1px,transparent_1px),linear-gradient(to_bottom,#292524_1px,transparent_1px)] [background-size:24px_24px]';
      case 'dark':
        return 'bg-stone-950';
      case 'plain':
      default:
        return 'bg-stone-100 dark:bg-stone-950';
    }
  };

  const downloadBtnClasses =
    accentButtonClass ||
    'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900';

  return (
    <div className="flex flex-col h-full w-full transition-colors duration-200">
      {/* Top bar */}
      <div className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/80 backdrop-blur flex items-center justify-between px-4 shrink-0 gap-4 flex-wrap z-10 transition-colors">
        <div className="flex p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg border border-stone-200/60 dark:border-stone-700/60">
          <button
            onClick={() => onViewModeChange('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-700/50'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'code'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-700/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Size Toggles - only shown when in preview mode */}
          {viewMode === 'preview' && html && (
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-lg border border-stone-200/60 dark:border-stone-700/60">
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
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-700/40'
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium shadow-xs transition-colors ${downloadBtnClasses}`}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className={`flex-1 relative overflow-hidden transition-colors ${getBackdropClass()}`}>
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-stone-50/95 dark:bg-stone-950/95 flex flex-col">
            {/* Skeleton App Mockup Header */}
            <div className="h-14 border-b border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between px-6 shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                <div className="w-24 h-4 rounded bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-7 rounded-md bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
              </div>
            </div>

            {/* Skeleton App Mockup Body */}
            <div className="flex-1 flex overflow-hidden select-none">
              {/* Skeleton Sidebar */}
              <div className="w-56 border-r border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col gap-4 shrink-0 hidden sm:flex">
                <div className="w-2/3 h-4 rounded bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                <div className="space-y-3 mt-4">
                  <div className="w-full h-8 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse" />
                  <div className="w-5/6 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse" />
                  <div className="w-full h-8 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse" />
                  <div className="w-4/5 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse" />
                </div>
              </div>

              {/* Skeleton Main Panel */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-stone-50 dark:bg-stone-950">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-32 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3 shadow-xs">
                    <div className="w-1/3 h-3 rounded bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                    <div className="w-2/3 h-6 rounded bg-stone-300/60 dark:bg-stone-600/60 animate-pulse" />
                    <div className="w-1/2 h-3 rounded bg-stone-200/50 dark:bg-stone-700/40 animate-pulse" />
                  </div>
                  <div className="h-32 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3 shadow-xs">
                    <div className="w-1/4 h-3 rounded bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                    <div className="w-1/2 h-6 rounded bg-stone-300/60 dark:bg-stone-600/60 animate-pulse" />
                    <div className="w-2/3 h-3 rounded bg-stone-200/50 dark:bg-stone-700/40 animate-pulse" />
                  </div>
                  <div className="h-32 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3 shadow-xs">
                    <div className="w-1/2 h-3 rounded bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                    <div className="w-3/4 h-6 rounded bg-stone-300/60 dark:bg-stone-600/60 animate-pulse" />
                    <div className="w-1/3 h-3 rounded bg-stone-200/50 dark:bg-stone-700/40 animate-pulse" />
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-xs h-64">
                  <div className="w-1/5 h-4 rounded bg-stone-200/70 dark:bg-stone-700/60 animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-full h-3 rounded bg-stone-100 dark:bg-stone-800 animate-pulse" />
                    <div className="w-full h-3 rounded bg-stone-100 dark:bg-stone-800 animate-pulse" />
                    <div className="w-4/5 h-3 rounded bg-stone-100 dark:bg-stone-800 animate-pulse" />
                    <div className="w-3/4 h-3 rounded bg-stone-100 dark:bg-stone-800 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Loading Dialog */}
            <div className="absolute inset-0 bg-stone-100/50 dark:bg-stone-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center max-w-sm mx-4">
                <div className="relative flex items-center justify-center mb-4">
                  <Loader2 className="w-10 h-10 animate-spin text-stone-700 dark:text-stone-300" />
                </div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-base mb-1.5">
                  Crafting your application...
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-5">
                  Translating your prompt into clean markup, responsive Tailwind layouts, and interactive logic.
                </p>
                <div className="w-48 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden relative">
                  <style>{`
                    @keyframes progressMove {
                      0% { left: -40%; width: 40%; }
                      50% { left: 30%; width: 55%; }
                      100% { left: 100%; width: 40%; }
                    }
                  `}</style>
                  <div
                    className="absolute h-full bg-stone-800 dark:bg-stone-200 rounded-full"
                    style={{ animation: 'progressMove 2s infinite ease-in-out' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!html && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 p-6 text-center">
            <MonitorPlay className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-stone-500 dark:text-stone-400">No output yet</p>
            <p className="text-sm mt-1 max-w-sm text-stone-400 dark:text-stone-500">
              Describe an app in the sidebar and click generate to see the results rendered here.
            </p>
          </div>
        )}

        {html && (
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center p-4 transition-opacity duration-300 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}
          >
            {viewMode === 'preview' ? (
              <div
                className={`w-full h-full bg-white transition-all duration-300 ${
                  deviceSize === 'mobile'
                    ? 'max-w-[375px] max-h-[812px] border border-stone-200 dark:border-stone-700 shadow-2xl rounded-2xl overflow-hidden'
                    : deviceSize === 'tablet'
                    ? 'max-w-[768px] max-h-[1024px] border border-stone-200 dark:border-stone-700 shadow-2xl rounded-2xl overflow-hidden'
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
              <div className="w-full h-full overflow-auto bg-stone-900 dark:bg-stone-950 text-stone-100 p-6 rounded-xl border border-stone-800">
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
