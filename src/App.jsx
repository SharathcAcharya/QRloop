import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
// import FloatingActionButton from './components/layout/FloatingActionButton';
import OnboardingTour from './components/onboarding/OnboardingTour';
import LoadingScreen from './components/common/LoadingScreen';
import FirebaseStatus from './components/common/FirebaseStatus';
import ConnectionStatus from './components/common/ConnectionStatus';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';

// Immediately loaded pages (most critical)
import Home from './pages/Home';

// Lazy loaded pages (code splitting)
const QRGenerator = lazy(() => import('./pages/QRGenerator'));
const QRScanner = lazy(() => import('./pages/QRScanner'));
const LibraryPage = lazy(() => import('./pages/Library'));
const Templates = lazy(() => import('./pages/Templates'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Collaboration = lazy(() => import('./pages/Collaboration'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminSetup = lazy(() => import('./pages/AdminSetup'));

// Context Providers
import AuthProvider from './contexts/AuthContext';
import PWAProvider from './contexts/PWAContext';
import AdminProvider from './contexts/AdminContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      try {
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        // App initialization error occurred
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Loading fallback component for lazy-loaded routes
  const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  );

  return (
    <AuthProvider>
      <PWAProvider>
        <AdminProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              {/* Admin Routes */}
              <Route 
                path="/admin/setup" 
                element={(
                  <Suspense fallback={<PageLoader />}>
                    <AdminSetup />
                  </Suspense>
                )} 
              />
              <Route 
                path="/admin/login" 
                element={(
                  <Suspense fallback={<PageLoader />}>
                    <AdminLogin />
                  </Suspense>
                )} 
              />
              <Route 
                path="/admin/dashboard" 
                element={(
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                )} 
              />
              
              {/* Main App Routes */}
              <Route 
                path="/*" 
                element={(
                  <>
                    {/* Navigation */}
                    <Navbar 
                      onMenuClick={() => setSidebarOpen(true)} 
                      isDarkMode={isDarkMode}
                      toggleDarkMode={() => setIsDarkMode(prev => !prev)}
                    />
                    
                    {/* Sidebar */}
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    
                    {/* Main Content */}
                    <main className="pt-16">
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/generator" element={<QRGenerator />} />
                          <Route path="/scanner" element={<QRScanner />} />
                          <Route path="/library" element={<LibraryPage />} />
                          <Route path="/templates" element={<Templates />} />
                          <Route path="/analytics" 
                            element={(
                              <AdminProtectedRoute>
                                <Analytics />
                              </AdminProtectedRoute>
                            )} 
                          />
                          <Route path="/collaboration" element={<Collaboration />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/404" element={<NotFound />} />
                          <Route path="*" element={<Navigate to="/404" replace />} />
                        </Routes>
                      </Suspense>
                    </main>
                  
                    {/* Footer */}
                    <Footer />
                  
                    {/* Floating Action Button - Temporarily disabled */}
                    {/* <FloatingActionButton /> */}
                  
                    {/* Onboarding Tour */}
                    {isFirstVisit && (
                    <OnboardingTour onComplete={() => setIsFirstVisit(false)} />
                  )}
                  </>
                )}
              />
            </Routes>
            
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
            
            {/* Firebase Status Indicator */}
            <FirebaseStatus />
          </div>
        </AdminProvider>
      </PWAProvider>
    </AuthProvider>
  );
}

export default App;
