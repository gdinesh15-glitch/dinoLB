import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB } from '../utils/db';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Themes: light, dark, midnight, forest
  const [theme, setThemeState] = useState(() => {
    return DB.get('theme_preference') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous theme classes
    const themes = ['theme-light', 'theme-dark', 'theme-midnight', 'theme-forest', 'dark'];
    themes.forEach(t => root.classList.remove(t));
    document.body.classList.remove('lm');
    
    // Apply new theme class
    root.classList.add(`theme-${theme}`);
    
    // Legacy support for tailwind 'dark' class if needed
    if (theme === 'dark' || theme === 'midnight' || theme === 'forest') {
      root.classList.add('dark');
    }
    
    if (theme === 'light') {
      document.body.classList.add('lm');
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    DB.set('theme_preference', newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
