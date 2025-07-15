import { createContext, useContext, useEffect, useState } from 'react';

const PWAContext = createContext();

// Custom hook for PWA context
// eslint-disable-next-line react-refresh/only-export-components
export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

const PWAProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  // Replace store functions with simple notifications
  const showSuccess = (_message) => {
    // Success notification would go here
  };
  const showError = (_message) => {
    // Error notification would go here
  };
  const showInfo = (_message) => {
    // Info notification would go here
  };

  // Check if app is already installed
  useEffect(() => {
    const checkInstallation = () => {
      // Check for standalone mode (iOS)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Check for PWA installation (Android)
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone || 
                    document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone || isPWA);
    };

    checkInstallation();
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
      
      showInfo('QRloop can be installed as an app for a better experience!');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsInstallable(false);
      
      showSuccess('QRloop has been installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSuccess('You are back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showInfo('You are now offline. QRloop will continue to work with cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle service worker registration and updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setRegistration(registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              showInfo('A new version of QRloop is available!');
            }
          });
        });
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  // Install the app
  const installApp = async () => {
    if (!installPrompt) return false;

    try {
      const result = await installPrompt.prompt();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        showSuccess('QRloop has been installed!');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
      
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Install failed:', error);
      showError('Installation failed. Please try again.');
      return false;
    }
  };

  // Update the app
  const updateApp = async () => {
    if (!registration || !updateAvailable) return false;

    try {
      const newWorker = registration.waiting;
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error('Update failed:', error);
      showError('Update failed. Please refresh the page.');
      return false;
    }
  };

  // Share functionality
  const shareApp = async (shareData = {}) => {
    const defaultShareData = {
      title: 'QRloop - Advanced QR Code Generator',
      text: 'Create stunning QR codes with 3D visualization and AI enhancement!',
      url: window.location.origin,
    };

    const dataToShare = { ...defaultShareData, ...shareData };

    try {
      if (navigator.share) {
        await navigator.share(dataToShare);
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(dataToShare.url);
        showSuccess('Link copied to clipboard!');
        return true;
      }
    } catch (error) {
      console.error('Share failed:', error);
      showError('Sharing failed. Please try again.');
      return false;
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showSuccess('Notifications enabled!');
        return true;
      }
    }
    return false;
  };

  // Show notification
  const showNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'qrloop-notification',
        ...options,
      });

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  };

  // Get app info
  const getAppInfo = () => ({
    isOnline,
    isInstallable,
    isInstalled,
    updateAvailable,
    supportsShare: 'share' in navigator,
    supportsNotifications: 'Notification' in window,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
  });

  const value = {
    isOnline,
    isInstallable,
    isInstalled,
    updateAvailable,
    installApp,
    updateApp,
    shareApp,
    requestNotificationPermission,
    showNotification,
    getAppInfo,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export default PWAProvider;
