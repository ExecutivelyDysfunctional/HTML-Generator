import React, { useState, useEffect } from 'react';
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sliders,
  Cpu,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Palette,
  Check,
  Grid,
} from 'lucide-react';
import { AppSettings, ThemeMode, AccentColor, CanvasBackground } from '../types';
import { ACCENT_OPTIONS, applyThemeToDocument } from '../utils/theme';

interface SettingsPageProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onBackToGenerator: () => void;
}

interface ServerStatus {
  hasServerKey: boolean;
  defaultModel: string;
}

interface VerificationResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  error?: string;
}

export function SettingsPage({
  settings,
  onSaveSettings,
  onBackToGenerator,
}: SettingsPageProps) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [themeMode, setThemeMode] = useState<ThemeMode>(settings.themeMode || 'system');
  const [accentColor, setAccentColor] = useState<AccentColor>(settings.accentColor || 'stone');
  const [canvasBackground, setCanvasBackground] = useState<CanvasBackground>(
    settings.canvasBackground || 'plain'
  );

  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [verification, setVerification] = useState<VerificationResult>({ status: 'idle' });

  // Update DOM immediately for live interactive preview as settings change
  useEffect(() => {
    applyThemeToDocument(themeMode, accentColor);
  }, [themeMode, accentColor]);

  // Fetch server status on mount
  useEffect(() => {
    fetch('/api/settings/status')
      .then((res) => res.json())
      .then((data: ServerStatus) => setServerStatus(data))
      .catch((err) => console.error('Failed to fetch server settings status:', err));
  }, []);

  const handleTestKey = async () => {
    setVerification({ status: 'loading' });
    try {
      const res = await fetch('/api/settings/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setVerification({
          status: 'error',
          error: data.error || 'Failed to authenticate API key with Gemini.',
        });
      } else {
        setVerification({
          status: 'success',
          message: data.message || 'API key is valid and working!',
        });
      }
    } catch (err: any) {
      setVerification({
        status: 'error',
        error: err.message || 'Network error while validating API key.',
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      apiKey: apiKey.trim(),
      model,
      temperature,
      themeMode,
      accentColor,
      canvasBackground,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefaults = () => {
    setApiKey('');
    setModel('gemini-3.8-flash');
    setTemperature(0.7);
    setThemeMode('system');
    setAccentColor('stone');
    setCanvasBackground('plain');
    setVerification({ status: 'idle' });
    onSaveSettings({
      apiKey: '',
      model: 'gemini-3.8-flash',
      temperature: 0.7,
      themeMode: 'system',
      accentColor: 'stone',
      canvasBackground: 'plain',
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const hasCustomKey = Boolean(apiKey && apiKey.trim().length > 0);
  const hasServerKey = Boolean(serverStatus?.hasServerKey);
  const activeAccent = ACCENT_OPTIONS[accentColor] || ACCENT_OPTIONS.stone;

  return (
    <div className="flex-1 flex flex-col bg-stone-50 dark:bg-stone-950 overflow-y-auto transition-colors duration-200">
      <div className="max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="space-y-1">
            <button
              onClick={onBackToGenerator}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App Generator</span>
            </button>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Settings & Customization
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Customize interface appearance, theme palette, Gemini API keys, and model parameters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors shadow-sm ${activeAccent.primaryButtonClass}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Save Notification */}
        {isSaved && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Settings and theme preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. Dark Mode & Theming Options */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                    Appearance & Theming
                  </h2>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed">
                  Choose between Light, Dark, or System theme modes and personalize your visual accent colors.
                </p>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${activeAccent.badgeClass}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeAccent.dotColor }} />
                <span>{activeAccent.name}</span>
              </span>
            </div>

            {/* Theme Mode Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                Interface Color Scheme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'light' as ThemeMode,
                    label: 'Light Mode',
                    icon: Sun,
                    description: 'Clean, high-clarity daylight palette with warm neutral accents.',
                  },
                  {
                    id: 'dark' as ThemeMode,
                    label: 'Dark Mode',
                    icon: Moon,
                    description: 'Deep contrast, eye-safe slate palette designed for low-light focus.',
                  },
                  {
                    id: 'system' as ThemeMode,
                    label: 'System Sync',
                    icon: Laptop,
                    description: 'Automatically follows your OS system preferences.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = themeMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setThemeMode(item.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? `border-stone-900 dark:border-stone-100 ring-2 ring-stone-900/10 dark:ring-stone-100/20 bg-stone-50 dark:bg-stone-800/80`
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected
                                  ? 'text-stone-900 dark:text-stone-100'
                                  : 'text-stone-500 dark:text-stone-400'
                              }`}
                            />
                            <span
                              className={`text-sm font-semibold ${
                                isSelected
                                  ? 'text-stone-900 dark:text-stone-100'
                                  : 'text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Palette Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                Accent Highlight Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {(Object.keys(ACCENT_OPTIONS) as AccentColor[]).map((key) => {
                  const opt = ACCENT_OPTIONS[key];
                  const isSelected = accentColor === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAccentColor(key)}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                        isSelected
                          ? `border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 ring-2 ring-stone-900/10 dark:ring-stone-100/20`
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs text-white"
                        style={{ backgroundColor: opt.dotColor }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-medium leading-tight ${
                          isSelected
                            ? 'text-stone-900 dark:text-stone-100'
                            : 'text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {opt.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canvas Stage Background Texture */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                    Preview Canvas Backdrop
                  </label>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Select how the backdrop behind your generated application preview renders.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'plain' as CanvasBackground, label: 'Subtle Solid', desc: 'Minimal neutral' },
                  { id: 'dots' as CanvasBackground, label: 'Dot Grid', desc: 'Matrix pattern' },
                  { id: 'grid' as CanvasBackground, label: 'Blueprint', desc: 'Technical lines' },
                  { id: 'dark' as CanvasBackground, label: 'Dark Studio', desc: 'High contrast' },
                ].map((bg) => {
                  const isSelected = canvasBackground === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setCanvasBackground(bg.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 ring-1 ring-stone-900 dark:ring-stone-100'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {bg.label}
                        </span>
                        <Grid className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400">
                        {bg.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 2. API Key Configuration Section */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                    <Key className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                    Gemini API Key
                  </h2>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl leading-relaxed">
                  Provide your personal Google Gemini API key. This key will be used to generate
                  HTML applications with Gemini models. If left blank, the app falls back to the
                  server&apos;s environment key if present.
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {hasCustomKey ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Custom Key Active
                  </span>
                ) : hasServerKey ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    Using Server Key
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    No Key Configured
                  </span>
                )}
              </div>
            </div>

            {/* Input & Controls */}
            <div className="space-y-3">
              <label htmlFor="apiKeyInput" className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                API Key
              </label>
              <div className="relative flex items-center">
                <input
                  id="apiKeyInput"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    if (verification.status !== 'idle') {
                      setVerification({ status: 'idle' });
                    }
                  }}
                  placeholder={
                    hasServerKey
                      ? 'Server key detected in environment. Enter custom key to override...'
                      : 'AIzaSy...'
                  }
                  className="w-full pl-3.5 pr-24 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 text-sm font-mono placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {apiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        setApiKey('');
                        setVerification({ status: 'idle' });
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition-colors"
                      title="Clear key"
                    >
                      <span className="text-xs font-medium px-1">Clear</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition-colors"
                    title={showApiKey ? 'Hide key' : 'Show key'}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action buttons & Get Key link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-4 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get an API Key from Google AI Studio</span>
                </a>

                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={verification.status === 'loading'}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300/80 dark:border-stone-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verification.status === 'loading' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-600 dark:text-stone-400" />
                      <span>Validating Key...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>

              {/* Verification Feedback Banners */}
              {verification.status === 'success' && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{verification.message}</p>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                      Successfully connected to Gemini API. Your requests will use this verified key.
                    </p>
                  </div>
                </div>
              )}

              {verification.status === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-800 dark:text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Validation failed</p>
                    <p className="text-red-700 dark:text-red-300 mt-0.5">{verification.error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Storage notice */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 rounded-xl flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-400">
              <ShieldCheck className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  Client-Side Persistence:{' '}
                </span>
                <span>
                  Your custom key is saved exclusively in your browser&apos;s local storage and is
                  never logged or shared.
                </span>
              </div>
            </div>
          </section>

          {/* 3. Model Selection Section */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Gemini Model
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Choose the Gemini model version used for code generation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'gemini-3.8-flash',
                  name: 'Gemini 3.8 Flash',
                  badge: 'Recommended',
                  desc: 'Fast, state-of-the-art multimodal reasoning with exceptional code synthesis.',
                },
                {
                  id: 'gemini-2.5-flash',
                  name: 'Gemini 2.5 Flash',
                  badge: 'Fastest',
                  desc: 'Optimized for high-speed generation and low latency interactive responses.',
                },
                {
                  id: 'gemini-2.5-pro',
                  name: 'Gemini 2.5 Pro',
                  badge: 'Deep Reasoning',
                  desc: 'Best for complex logic, multi-component apps, and detailed JavaScript state.',
                },
              ].map((m) => {
                const isSelected = model === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModel(m.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm ring-1 ring-stone-900 dark:ring-stone-100'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-sm">{m.name}</span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-stone-800 dark:bg-stone-200 text-stone-200 dark:text-stone-800 border border-stone-700 dark:border-stone-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {m.badge}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected
                            ? 'text-stone-300 dark:text-stone-700'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {m.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Generation Parameters Section */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Sliders className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Generation Parameters
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Adjust how deterministic or creative the model output should be.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="temperatureInput"
                    className="text-xs font-semibold text-stone-800 dark:text-stone-200"
                  >
                    Temperature:{' '}
                    <span className="font-mono text-stone-600 dark:text-stone-400">
                      {temperature.toFixed(2)}
                    </span>
                  </label>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Lower values (0.2) produce strict, precise HTML. Higher values (0.9) encourage creative visual layouts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTemperature(0.7)}
                  className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline transition-colors"
                >
                  Reset (0.7)
                </button>
              </div>

              <input
                id="temperatureInput"
                type="range"
                min="0.0"
                max="1.2"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-900 dark:accent-stone-100"
              />

              <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500 font-medium">
                <span>0.0 (Precise)</span>
                <span>0.7 (Balanced default)</span>
                <span>1.2 (Creative)</span>
              </div>
            </div>
          </section>

          {/* Save Button Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToGenerator}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2 ${activeAccent.primaryButtonClass}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
