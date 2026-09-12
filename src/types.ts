export interface AppState {
  prompt: string;
  isGenerating: boolean;
  generatedHtml: string | null;
  error: string | null;
  viewMode: 'preview' | 'code';
}
