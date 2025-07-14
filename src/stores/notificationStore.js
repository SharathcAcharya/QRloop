import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // Notification State
      notifications: [],
      isFirstVisit: true,
      tourCompleted: false,
      lastActiveDate: null,
      
      // PWA State
      isInstalled: false,
      installPrompt: null,
      updateAvailable: false,
      
      // Feature Introduction
      newFeatures: [
        {
          id: '3d-visualization',
          title: '3D QR Visualization',
          description: 'Experience QR codes in 3D with interactive controls',
          icon: '🎮',
          version: '1.0.0',
          isNew: true,
          seen: false,
        },
        {
          id: 'ai-enhancement',
          title: 'AI Style Enhancement',
          description: 'Let AI optimize your QR code designs automatically',
          icon: '🤖',
          version: '1.0.0',
          isNew: true,
          seen: false,
        },
        {
          id: 'batch-generation',
          title: 'Batch QR Generation',
          description: 'Generate multiple QR codes from CSV files',
          icon: '📊',
          version: '1.0.0',
          isNew: true,
          seen: false,
        },
        {
          id: 'collaboration',
          title: 'Real-time Collaboration',
          description: 'Work together with your team in real-time',
          icon: '👥',
          version: '1.0.0',
          isNew: true,
          seen: false,
        },
      ],
      
      // Analytics tracking
      userStats: {
        totalQRsGenerated: 0,
        totalScans: 0,
        favoriteFeatures: [],
        sessionCount: 0,
        totalTimeSpent: 0,
        lastSessionDate: null,
      },
      
      // Actions
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: 'info',
            ...notification,
          },
          ...state.notifications,
        ],
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      
      setFirstVisit: (isFirst) => set({ isFirstVisit: isFirst }),
      
      completeTour: () => set({ tourCompleted: true }),
      
      updateLastActive: () => set({
        lastActiveDate: new Date().toISOString(),
      }),
      
      setInstalled: (installed) => set({ isInstalled: installed }),
      
      setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
      
      setUpdateAvailable: (available) => set({ updateAvailable: available }),
      
      markFeatureAsSeen: (featureId) => set((state) => ({
        newFeatures: state.newFeatures.map((feature) =>
          feature.id === featureId ? { ...feature, seen: true } : feature
        ),
      })),
      
      getUnseenFeatures: () => {
        const { newFeatures } = get();
        return newFeatures.filter((feature) => !feature.seen);
      },
      
      // User statistics
      incrementQRGenerated: () => set((state) => ({
        userStats: {
          ...state.userStats,
          totalQRsGenerated: state.userStats.totalQRsGenerated + 1,
        },
      })),
      
      incrementScans: () => set((state) => ({
        userStats: {
          ...state.userStats,
          totalScans: state.userStats.totalScans + 1,
        },
      })),
      
      trackFeatureUsage: (featureName) => set((state) => {
        const current = state.userStats.favoriteFeatures;
        const existing = current.find((f) => f.name === featureName);
        
        if (existing) {
          return {
            userStats: {
              ...state.userStats,
              favoriteFeatures: current.map((f) =>
                f.name === featureName ? { ...f, count: f.count + 1 } : f
              ),
            },
          };
        }
        
        return {
          userStats: {
            ...state.userStats,
            favoriteFeatures: [
              ...current,
              { name: featureName, count: 1 },
            ],
          },
        };
      }),
      
      startSession: () => set((state) => ({
        userStats: {
          ...state.userStats,
          sessionCount: state.userStats.sessionCount + 1,
          lastSessionDate: new Date().toISOString(),
        },
      })),
      
      updateTimeSpent: (minutes) => set((state) => ({
        userStats: {
          ...state.userStats,
          totalTimeSpent: state.userStats.totalTimeSpent + minutes,
        },
      })),
      
      // Notification helpers
      showSuccess: (message) => {
        const { addNotification } = get();
        addNotification({
          type: 'success',
          title: 'Success',
          message,
          duration: 3000,
        });
      },
      
      showError: (message) => {
        const { addNotification } = get();
        addNotification({
          type: 'error',
          title: 'Error',
          message,
          duration: 5000,
        });
      },
      
      showInfo: (message) => {
        const { addNotification } = get();
        addNotification({
          type: 'info',
          title: 'Info',
          message,
          duration: 4000,
        });
      },
      
      showWarning: (message) => {
        const { addNotification } = get();
        addNotification({
          type: 'warning',
          title: 'Warning',
          message,
          duration: 4000,
        });
      },
      
      // PWA helpers
      promptInstall: async () => {
        const { installPrompt } = get();
        if (installPrompt) {
          const result = await installPrompt.prompt();
          if (result.outcome === 'accepted') {
            set({ isInstalled: true, installPrompt: null });
          }
        }
      },
      
      dismissInstallPrompt: () => set({ installPrompt: null }),
      
      // Feature discovery
      shouldShowFeatureIntro: () => {
        const { newFeatures } = get();
        return newFeatures.some((feature) => feature.isNew && !feature.seen);
      },
      
      // Data export
      exportUserData: () => {
        const state = get();
        return {
          notifications: state.notifications,
          userStats: state.userStats,
          newFeatures: state.newFeatures,
          lastActiveDate: state.lastActiveDate,
          tourCompleted: state.tourCompleted,
          timestamp: new Date().toISOString(),
        };
      },
      
      // Reset
      resetNotifications: () => set({
        notifications: [],
        isFirstVisit: true,
        tourCompleted: false,
        userStats: {
          totalQRsGenerated: 0,
          totalScans: 0,
          favoriteFeatures: [],
          sessionCount: 0,
          totalTimeSpent: 0,
          lastSessionDate: null,
        },
        newFeatures: get().newFeatures.map((feature) => ({
          ...feature,
          seen: false,
        })),
      }),
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        isFirstVisit: state.isFirstVisit,
        tourCompleted: state.tourCompleted,
        lastActiveDate: state.lastActiveDate,
        userStats: state.userStats,
        newFeatures: state.newFeatures,
      }),
    }
  )
);
