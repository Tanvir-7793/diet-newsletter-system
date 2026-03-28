export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  theme: Theme;
  isMarathi: boolean;
}

export const getInitialTheme = (): ThemeConfig => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('newsletter-theme');
    return stored ? JSON.parse(stored) : { theme: 'light', isMarathi: false };
  }
  return { theme: 'light', isMarathi: false };
};

export const saveTheme = (config: ThemeConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('newsletter-theme', JSON.stringify(config));
  }
};

export const isMarathiText = (text: string): boolean => {
  // Simple detection of Devanagari script characters
  const devanagariRegex = /[\u0900-\u097F]/;
  return devanagariRegex.test(text);
};

export const getThemeColors = (theme: Theme) => {
  const colors = {
    light: {
      bg: 'bg-slate-50',
      card: 'bg-white',
      text: 'text-slate-900',
      muted: 'text-slate-600',
      border: 'border-slate-200',
      input: 'bg-white border-slate-300 text-slate-900',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    dark: {
      bg: 'bg-slate-900',
      card: 'bg-slate-800',
      text: 'text-slate-100',
      muted: 'text-slate-400',
      border: 'border-slate-700',
      input: 'bg-slate-800 border-slate-600 text-slate-100',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
    }
  };
  return colors[theme];
};
