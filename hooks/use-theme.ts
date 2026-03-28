"use client";

import { useState, useEffect } from 'react';
import { Theme, ThemeConfig, getInitialTheme, saveTheme, isMarathiText } from '@/lib/theme';

export function useTheme() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getInitialTheme());

  const toggleTheme = () => {
    const newTheme: Theme = themeConfig.theme === 'light' ? 'dark' : 'light';
    const newConfig = { ...themeConfig, theme: newTheme };
    setThemeConfig(newConfig);
    saveTheme(newConfig);
  };

  const detectMarathi = (text: string) => {
    const hasMarathi = isMarathiText(text);
    const newConfig = { ...themeConfig, isMarathi: hasMarathi };
    setThemeConfig(newConfig);
    saveTheme(newConfig);
  };

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(themeConfig.theme);
    
    // Apply font if Marathi is detected using data attribute
    if (themeConfig.isMarathi) {
      document.documentElement.setAttribute('data-marathi', 'true');
      document.documentElement.style.fontFamily = '"Yatra One", "Noto Sans Devanagari", sans-serif';
    } else {
      document.documentElement.removeAttribute('data-marathi');
      document.documentElement.style.fontFamily = '';
    }
  }, [themeConfig]);

  return {
    theme: themeConfig.theme,
    isDark: themeConfig.theme === 'dark',
    isMarathi: themeConfig.isMarathi,
    toggleTheme,
    detectMarathi,
    colors: themeConfig.theme === 'light' ? {
      bg: 'bg-slate-50',
      card: 'bg-white',
      text: 'text-slate-900',
      muted: 'text-slate-600',
      border: 'border-slate-200',
      input: 'bg-white border-slate-300 text-slate-900',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      isDark: false,
    } : {
      bg: 'bg-slate-900',
      card: 'bg-slate-800',
      text: 'text-slate-100',
      muted: 'text-slate-400',
      border: 'border-slate-700',
      input: 'bg-slate-800 border-slate-600 text-slate-100',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      isDark: true,
    }
  };
}
