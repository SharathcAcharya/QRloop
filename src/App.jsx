import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useQRStore } from './stores/qrStore';
import { useThemeStore } from './stores/themeStore';
import { useNotificationStore } from './stores/notificationStore';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import FloatingActionButton from './components/layout/FloatingActionButton';
import OnboardingTour from './components/onboarding/OnboardingTour';
import LoadingScreen from './components/common/LoadingScreen';

// Pages
import Home from './pages/Home';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import Analytics from './pages/Analytics';
import Library from './pages/Library';
import Templates from './pages/Templates';
import Collaboration from './pages/Collaboration';
import Settings from './pages/Settings';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { PWAProvider } from './contexts/PWAContext';

function App() {
  const { isDarkMode } = useThemeStore();
  const { isFirstVisit, setFirstVisit } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      try {
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <PWAProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {/* Navigation */}
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Main Content */}
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<QRGenerator />} />
              <Route path="/scanner" element={<QRScanner />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/library" element={<Library />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
          
          {/* Floating Action Button */}
          <FloatingActionButton />
          
          {/* Onboarding Tour */}
          {isFirstVisit && (
            <OnboardingTour onComplete={() => setFirstVisit(false)} />
          )}
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
                border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
              },
            }}
          />
        </div>
      </PWAProvider>
    </AuthProvider>
  );
}

export default App;
