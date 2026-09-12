import { ThemeMode, AccentColor } from '../types';

export interface AccentThemeConfig {
  id: AccentColor;
  name: string;
  description: string;
  dotColor: string;
  bgClass: string;
  textClass: string;
  primaryButtonClass: string;
  activeRingClass: string;
  badgeClass: string;
  activeTabClass: string;
}

export const ACCENT_OPTIONS: Record<AccentColor, AccentThemeConfig> = {
  stone: {
    id: 'stone',
    name: 'Charcoal Minimal',
    description: 'Classic warm stone and deep charcoal neutrals',
    dotColor: '#292524',
    bgClass: 'bg-stone-900 dark:bg-stone-100',
    textClass: 'text-stone-900 dark:text-stone-100',
    primaryButtonClass: 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900',
    activeRingClass: 'ring-stone-900 dark:ring-stone-100 border-stone-900 dark:border-stone-100',
    badgeClass: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700',
    activeTabClass: 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900',
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Blue',
    description: 'Crisp, high-contrast tech blue',
    dotColor: '#2563eb',
    bgClass: 'bg-blue-600 dark:bg-blue-500',
    textClass: 'text-blue-600 dark:text-blue-400',
    primaryButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white',
    activeRingClass: 'ring-blue-600 dark:ring-blue-400 border-blue-600 dark:border-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    activeTabClass: 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white',
  },
  emerald: {
    id: 'emerald',
    name: 'Botanical Emerald',
    description: 'Natural forest and energetic emerald',
    dotColor: '#059669',
    bgClass: 'bg-emerald-600 dark:bg-emerald-500',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    primaryButtonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white',
    activeRingClass: 'ring-emerald-600 dark:ring-emerald-400 border-emerald-600 dark:border-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    activeTabClass: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white',
  },
  violet: {
    id: 'violet',
    name: 'Iris Violet',
    description: 'Modern creative violet and indigo spectrum',
    dotColor: '#7c3aed',
    bgClass: 'bg-violet-600 dark:bg-violet-500',
    textClass: 'text-violet-600 dark:text-violet-400',
    primaryButtonClass: 'bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-white',
    activeRingClass: 'ring-violet-600 dark:ring-violet-400 border-violet-600 dark:border-violet-400',
    badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    activeTabClass: 'bg-violet-600 text-white dark:bg-violet-500 dark:text-white',
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    description: 'Rich sunset amber and terracotta warm tone',
    dotColor: '#d97706',
    bgClass: 'bg-amber-600 dark:bg-amber-500',
    textClass: 'text-amber-600 dark:text-amber-400',
    primaryButtonClass: 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white',
    activeRingClass: 'ring-amber-600 dark:ring-amber-400 border-amber-600 dark:border-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    activeTabClass: 'bg-amber-600 text-white dark:bg-amber-500 dark:text-white',
  },
  rose: {
    id: 'rose',
    name: 'Coral Rose',
    description: 'Vibrant punchy coral and rose red',
    dotColor: '#e11d48',
    bgClass: 'bg-rose-600 dark:bg-rose-500',
    textClass: 'text-rose-600 dark:text-rose-400',
    primaryButtonClass: 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white',
    activeRingClass: 'ring-rose-600 dark:ring-rose-400 border-rose-600 dark:border-rose-400',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    activeTabClass: 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white',
  },
};

/**
 * Evaluates whether dark mode is currently active given the user preference.
 */
export function getIsDarkMode(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

/**
 * Synchronizes HTML root classes and dataset with current settings.
 */
export function applyThemeToDocument(mode: ThemeMode, accent: AccentColor): boolean {
  if (typeof document === 'undefined') return false;
  
  const isDark = getIsDarkMode(mode);
  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.dataset.theme = mode;
  root.dataset.accent = accent;
  
  return isDark;
}
