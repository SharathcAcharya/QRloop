import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme State
      isDarkMode: false,
      colorScheme: 'blue', // blue, purple, green, red, yellow
      fontSize: 'medium', // small, medium, large
      animations: true,
      glassMorphism: true,
      
      // Theme Presets
      themes: {
        blue: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#10b981',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
        },
        purple: {
          primary: '#8b5cf6',
          secondary: '#3b82f6',
          accent: '#f59e0b',
          background: '#faf5ff',
          surface: '#ffffff',
          text: '#1e1b4b',
        },
        green: {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#3b82f6',
          background: '#f0fdf4',
          surface: '#ffffff',
          text: '#064e3b',
        },
        red: {
          primary: '#ef4444',
          secondary: '#dc2626',
          accent: '#f59e0b',
          background: '#fef2f2',
          surface: '#ffffff',
          text: '#7f1d1d',
        },
        yellow: {
          primary: '#f59e0b',
          secondary: '#d97706',
          accent: '#10b981',
          background: '#fffbeb',
          surface: '#ffffff',
          text: '#92400e',
        },
      },
      
      // Actions
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        document.documentElement.classList.toggle('dark', newMode);
        return { isDarkMode: newMode };
      }),
      
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      
      setFontSize: (size) => set({ fontSize: size }),
      
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      
      toggleGlassMorphism: () => set((state) => ({ glassMorphism: !state.glassMorphism })),
      
      getCurrentTheme: () => {
        const { themes, colorScheme, isDarkMode } = get();
        const baseTheme = themes[colorScheme];
        
        if (isDarkMode) {
          return {
            ...baseTheme,
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f1f5f9',
          };
        }
        
        return baseTheme;
      },
      
      applyTheme: (themeConfig) => set((state) => ({
        ...state,
        ...themeConfig,
      })),
      
      resetTheme: () => set({
        isDarkMode: false,
        colorScheme: 'blue',
        fontSize: 'medium',
        animations: true,
        glassMorphism: true,
      }),
      
      // System theme detection
      detectSystemTheme: () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        set({ isDarkMode: prefersDark });
        document.documentElement.classList.toggle('dark', prefersDark);
      },
      
      // Custom CSS properties
      updateCSSProperties: () => {
        const { getCurrentTheme } = get();
        const theme = getCurrentTheme();
        
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent);
        root.style.setProperty('--color-background', theme.background);
        root.style.setProperty('--color-surface', theme.surface);
        root.style.setProperty('--color-text', theme.text);
      },
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        colorScheme: state.colorScheme,
        fontSize: state.fontSize,
        animations: state.animations,
        glassMorphism: state.glassMorphism,
      }),
    }
  )
);
