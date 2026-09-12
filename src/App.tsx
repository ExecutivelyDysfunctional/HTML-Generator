/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PromptForm } from './components/PromptForm';
import { PreviewCanvas } from './components/PreviewCanvas';
import { SettingsPage } from './components/SettingsPage';
import { AppState, AppSettings, ActivePage, ThemeMode } from './types';
import {
  Layout,
  Sparkles,
  Settings as SettingsIcon,
  CodeXml,
  KeyRound,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { ACCENT_OPTIONS, applyThemeToDocument, getIsDarkMode } from './utils/theme';

const STORAGE_KEY = 'minimalist_generator_settings';

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  model: 'gemini-3.8-flash',
  temperature: 0.7,
  themeMode: 'system',
  accentColor: 'stone',
  canvasBackground: 'plain',
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('generator');
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [state, setState] = useState<AppState>({
    prompt: '',
    isGenerating: false,
    generatedHtml: null,
    error: null,
    missingApiKey: false,
    viewMode: 'preview',
  });

  // Apply theme class to document root and listen for OS system theme changes
  useEffect(() => {
    applyThemeToDocument(settings.themeMode, settings.accentColor);

    if (settings.themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        applyThemeToDocument('system', settings.accentColor);
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.themeMode, settings.accentColor]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to persist settings:', e);
    }
  };

  const handleCycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(settings.themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    const updated = { ...settings, themeMode: nextMode };
    handleSaveSettings(updated);
  };

  const handleGenerate = async (prompt: string) => {
    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      missingApiKey: false,
      prompt,
    }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          apiKey: settings.apiKey,
          model: settings.model,
          temperature: settings.temperature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: data.error || 'Failed to generate app',
          missingApiKey: Boolean(data.missingApiKey),
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedHtml: data.html,
        missingApiKey: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message || 'An unexpected error occurred during generation.',
        missingApiKey: false,
      }));
    }
  };

  const handleViewModeChange = (viewMode: 'preview' | 'code') => {
    setState((prev) => ({ ...prev, viewMode }));
  };

  const hasCustomKey = Boolean(settings.apiKey && settings.apiKey.trim().length > 0);
  const activeAccent = ACCENT_OPTIONS[settings.accentColor] || ACCENT_OPTIONS.stone;
  const isDarkActive = getIsDarkMode(settings.themeMode);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col font-sans text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 z-30 transition-colors">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100 cursor-pointer"
            onClick={() => setActivePage('generator')}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs ${activeAccent.bgClass}`}>
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                Minimalist Generator
              </h1>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 font-mono hidden sm:block">
                HTML & Tailwind App Builder
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200/80 dark:border-stone-700/80">
            <button
              onClick={() => setActivePage('generator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'generator'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <CodeXml className="w-3.5 h-3.5" />
              <span>Generator</span>
            </button>
            <button
              onClick={() => setActivePage('settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePage === 'settings'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
              {hasCustomKey && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  title="Custom API key configured"
                />
              )}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Header Theme Mode Toggle */}
          <button
            onClick={handleCycleTheme}
            title={`Theme: ${settings.themeMode.toUpperCase()} (Click to toggle Light/Dark/System)`}
            className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
          >
            {settings.themeMode === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : settings.themeMode === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Laptop className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            )}
            <span className="capitalize hidden sm:inline">{settings.themeMode}</span>
          </button>

          {hasCustomKey ? (
            <button
              onClick={() => setActivePage('settings')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <KeyRound className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Custom Key</span>
            </button>
          ) : (
            <button
              onClick={() => setActivePage('settings')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
            >
              <KeyRound className="w-3 h-3 text-stone-400 dark:text-stone-500" />
              <span>API Key</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium pl-2 border-l border-stone-200 dark:border-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            <span className="hidden md:inline font-mono">{settings.model}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activePage === 'settings' ? (
        <SettingsPage
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onBackToGenerator={() => setActivePage('generator')}
        />
      ) : (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar / Prompt Area */}
          <div className="w-full lg:w-96 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 p-6 flex flex-col shrink-0 lg:h-full overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-stone-800 dark:text-stone-100 mb-2">
                Create an App
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                Describe the web application you want to build. Our AI will generate a responsive,
                single-file HTML app using Tailwind CSS.
              </p>
            </div>

            <PromptForm
              onSubmit={handleGenerate}
              isGenerating={state.isGenerating}
              initialPrompt={state.prompt}
              buttonClass={activeAccent.primaryButtonClass}
            />

            {state.error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-red-700 dark:text-red-300">Generation failed</p>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed opacity-95">
                  {state.error}
                </p>
                {state.missingApiKey && (
                  <div className="pt-2">
                    <button
                      onClick={() => setActivePage('settings')}
                      className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" />
                      <span>Configure API Key in Settings</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col h-[600px] lg:h-full bg-stone-100 dark:bg-stone-950 relative">
            <PreviewCanvas
              html={state.generatedHtml}
              viewMode={state.viewMode}
              onViewModeChange={handleViewModeChange}
              isGenerating={state.isGenerating}
              canvasBackground={settings.canvasBackground}
              accentButtonClass={activeAccent.primaryButtonClass}
            />
          </div>
        </main>
      )}
    </div>
  );
}
