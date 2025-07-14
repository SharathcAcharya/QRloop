import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQRStore = create(
  persist(
    (set, get) => ({
      // QR Code Generation State
      qrData: '',
      qrOptions: {
        width: 300,
        height: 300,
        type: 'svg',
        quality: 0.4,
        margin: 10,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: 'M',
        backgroundImage: null,
        backgroundImageAlpha: 0.1,
        logoImage: null,
        logoWidth: 80,
        logoHeight: 80,
        logoCornerRadius: 0,
        logoMargin: 0,
        dotOptions: {
          color: '#000000',
          type: 'square',
        },
        cornerSquareOptions: {
          color: '#000000',
          type: 'square',
        },
        cornerDotOptions: {
          color: '#000000',
          type: 'square',
        },
      },
      
      // Generated QR Codes History
      qrHistory: [],
      favorites: [],
      
      // Templates
      templates: [
        {
          id: 'modern',
          name: 'Modern',
          thumbnail: '/templates/modern.svg',
          options: {
            colorDark: '#1f2937',
            colorLight: '#ffffff',
            dotOptions: { type: 'rounded' },
            cornerSquareOptions: { type: 'extra-rounded' },
          },
        },
        {
          id: 'colorful',
          name: 'Colorful',
          thumbnail: '/templates/colorful.svg',
          options: {
            colorDark: '#3b82f6',
            colorLight: '#ffffff',
            dotOptions: { type: 'dots' },
            cornerSquareOptions: { type: 'square' },
          },
        },
        {
          id: 'minimal',
          name: 'Minimal',
          thumbnail: '/templates/minimal.svg',
          options: {
            colorDark: '#000000',
            colorLight: '#ffffff',
            dotOptions: { type: 'square' },
            cornerSquareOptions: { type: 'square' },
          },
        },
      ],
      
      // 3D Visualization Settings
      visualization3D: {
        enabled: false,
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
        animation: 'none',
        lighting: 'ambient',
        material: 'standard',
      },
      
      // Actions
      setQRData: (data) => set({ qrData: data }),
      
      setQROptions: (options) => set((state) => ({
        qrOptions: { ...state.qrOptions, ...options },
      })),
      
      addToHistory: (qrCode) => set((state) => ({
        qrHistory: [
          {
            id: Date.now().toString(),
            data: qrCode.data,
            options: qrCode.options,
            timestamp: new Date().toISOString(),
            name: qrCode.name || `QR Code ${state.qrHistory.length + 1}`,
          },
          ...state.qrHistory.slice(0, 99), // Keep last 100 items
        ],
      })),
      
      removeFromHistory: (id) => set((state) => ({
        qrHistory: state.qrHistory.filter((item) => item.id !== id),
      })),
      
      clearHistory: () => set({ qrHistory: [] }),
      
      addToFavorites: (qrCode) => set((state) => ({
        favorites: [...state.favorites, qrCode],
      })),
      
      removeFromFavorites: (id) => set((state) => ({
        favorites: state.favorites.filter((item) => item.id !== id),
      })),
      
      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some((item) => item.id === id);
      },
      
      applyTemplate: (templateId) => set((state) => {
        const template = state.templates.find((t) => t.id === templateId);
        if (template) {
          return {
            qrOptions: { ...state.qrOptions, ...template.options },
          };
        }
        return state;
      }),
      
      set3DVisualization: (settings) => set((state) => ({
        visualization3D: { ...state.visualization3D, ...settings },
      })),
      
      resetOptions: () => set((state) => ({
        qrOptions: {
          width: 300,
          height: 300,
          type: 'svg',
          quality: 0.4,
          margin: 10,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: 'M',
          backgroundImage: null,
          backgroundImageAlpha: 0.1,
          logoImage: null,
          logoWidth: 80,
          logoHeight: 80,
          logoCornerRadius: 0,
          logoMargin: 0,
          dotOptions: {
            color: '#000000',
            type: 'square',
          },
          cornerSquareOptions: {
            color: '#000000',
            type: 'square',
          },
          cornerDotOptions: {
            color: '#000000',
            type: 'square',
          },
        },
      })),
      
      // Batch Generation
      batchGenerate: async (dataList) => {
        const results = [];
        for (const data of dataList) {
          results.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            data: data.content,
            options: get().qrOptions,
            timestamp: new Date().toISOString(),
            name: data.name || `QR Code ${results.length + 1}`,
          });
        }
        
        set((state) => ({
          qrHistory: [...results, ...state.qrHistory].slice(0, 200),
        }));
        
        return results;
      },
      
      // Export functionality
      exportQR: async (format = 'png', quality = 1) => {
        const { qrData, qrOptions } = get();
        
        try {
          // This would be implemented with qr-code-styling library
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Generate QR code and return blob
          return new Promise((resolve) => {
            canvas.toBlob(resolve, `image/${format}`, quality);
          });
        } catch (error) {
          console.error('Export error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'qr-store',
      partialize: (state) => ({
        qrHistory: state.qrHistory,
        favorites: state.favorites,
        qrOptions: state.qrOptions,
        visualization3D: state.visualization3D,
      }),
    }
  )
);
