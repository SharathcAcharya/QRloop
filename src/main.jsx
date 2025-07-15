import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Register service worker (handled by vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register';

// Service Worker registration with error handling
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const updateSW = registerSW({
    onNeedRefresh() {
      // Show update available notification
      console.log('New content available, please refresh.');
    },
    onOfflineReady() {
      // Show offline ready notification
      console.log('App is ready to work offline.');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    }
  });

  // Optional: Auto update
  // updateSW(true);
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
