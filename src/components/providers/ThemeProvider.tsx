/**
 * Theme Provider - Handles dark/light mode toggle
 */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('proofly-theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    updateThemeClass(initialTheme);
    setMounted(true);
  }, []);

  const updateThemeClass = (newTheme: Theme) => {
    // Update both html and body classes for maximum compatibility
    const html = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Add new theme class
    html.classList.add(newTheme);
    body.classList.add(newTheme);
    
    // Set data attributes for additional compatibility
    html.setAttribute('data-theme', newTheme);
    body.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('proofly-theme', newTheme);
    updateThemeClass(newTheme);
  };

  // Apply theme class immediately on mount to prevent flash
  useEffect(() => {
    if (mounted) {
      updateThemeClass(theme);
    }
  }, [theme, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
