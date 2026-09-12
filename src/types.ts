export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'stone' | 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
export type CanvasBackground = 'plain' | 'dots' | 'grid' | 'dark';

export interface AppSettings {
  apiKey: string;
  model: string;
  temperature: number;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  canvasBackground: CanvasBackground;
}

export interface AppState {
  prompt: string;
  isGenerating: boolean;
  generatedHtml: string | null;
  error: string | null;
  missingApiKey?: boolean;
  viewMode: 'preview' | 'code';
}

export type ActivePage = 'generator' | 'settings';
