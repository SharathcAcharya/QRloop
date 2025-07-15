import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork, collection, query, limit } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using environment variables with fallback validation
const getEnvVar = (key, fallback = null) => {
  const value = import.meta.env[key];
  if (!value || value === 'undefined' || value.includes('your-')) {
    console.warn(`Environment variable ${key} is missing or invalid:`, value);
    return fallback;
  }
  return value;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  databaseURL: getEnvVar('VITE_FIREBASE_DATABASE_URL'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID')
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !getEnvVar(varName));

if (missingVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingVars);
  console.error('Please check your .env.local file and ensure all required variables are set.');
  console.error('Current config:', firebaseConfig);
}

// Log configuration for debugging (without sensitive data)
console.log('Firebase config loaded:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId
});

// Initialize Firebase with enhanced error handling
let app;
try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Critical Firebase configuration missing');
  }
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // Create a minimal mock app for offline mode
  app = null;
}

// Initialize Firebase services with error handling
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

// Configure Firestore settings if available
if (db) {
  try {
    // Set offline persistence and connection settings
    // This helps prevent endless reconnection attempts
  } catch (error) {
    console.warn('Failed to configure Firestore settings:', error);
  }
}

// Initialize analytics only if supported and not blocked
let analytics = null;

// Safely initialize analytics
const initializeAnalytics = async () => {
  if (!app) {
    console.log('Analytics not initialized - Firebase app not available');
    return;
  }
  
  try {
    // Check if analytics is supported and not blocked
    const supported = await isSupported();
    if (!supported) {
      console.log('Analytics not supported in this environment');
      return;
    }
    
    if (navigator.userAgent.includes('Prerender') || navigator.userAgent.includes('bot')) {
      console.log('Analytics not initialized - prerendering or bot detected');
      return;
    }
    
    // Try to initialize analytics with error handling
    analytics = getAnalytics(app);
    console.log('Analytics initialized successfully');
  } catch (error) {
    console.warn('Analytics initialization failed:', error.message);
    // Don't throw error, just continue without analytics
    analytics = null;
  }
};

// Initialize analytics asynchronously only if Firebase is available
if (app) {
  initializeAnalytics();
}

export { analytics };

// Connection status tracking
let isFirebaseConnected = true;
let connectionListeners = [];

// Test Firebase connection
export const testFirebaseConnection = async () => {
  if (!db) {
    return { 
      success: false, 
      error: 'Firebase not initialized - check environment variables',
      suggestion: 'Ensure all Firebase environment variables are properly set'
    };
  }
  
  try {
    // Try a simple operation first
    await enableNetwork(db);
    
    // Test actual Firestore access with a lightweight operation
    const testCollection = collection(db, 'connection_test');
    // Just check if we can create a query (doesn't actually execute)
    query(testCollection, limit(1));
    
    isFirebaseConnected = true;
    notifyConnectionListeners(true);
    return { success: true, message: 'Firebase connection successful' };
  } catch (error) {
    console.warn('Firebase connection issues:', error);
    isFirebaseConnected = false;
    notifyConnectionListeners(false);
    
    // Check for various types of connection issues
    if (error.message?.includes('blocked') || 
        error.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
        error.code === 'resource-exhausted' ||
        error.message?.includes('missing stream token')) {
      return { 
        success: false, 
        error: 'Connection blocked by browser extension, ad blocker, or network restriction',
        suggestion: 'Please disable ad blocker for this site, try incognito mode, or use offline mode'
      };
    }
    
    if (error.code === 'permission-denied') {
      return {
        success: false,
        error: 'Firebase access denied - check security rules',
        suggestion: 'Verify Firebase security rules allow access to the required collections'
      };
    }
    
    if (error.code === 'unavailable') {
      return {
        success: false,
        error: 'Firebase service temporarily unavailable',
        suggestion: 'Check your internet connection and try again later'
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Unknown connection error',
      suggestion: 'Check your internet connection and Firebase configuration'
    };
  }
};

// Add connection listener
export const addConnectionListener = (callback) => {
  connectionListeners.push(callback);
  // Immediately call with current status
  callback(isFirebaseConnected);
};

// Remove connection listener
export const removeConnectionListener = (callback) => {
  connectionListeners = connectionListeners.filter(listener => listener !== callback);
};

// Notify all listeners of connection status change
const notifyConnectionListeners = (connected) => {
  connectionListeners.forEach(listener => listener(connected));
};

// Get connection status
export const isConnected = () => isFirebaseConnected;

// Force offline mode
export const goOffline = async () => {
  if (!db) {
    console.warn('Cannot go offline - Firebase not initialized');
    return false;
  }
  
  try {
    await disableNetwork(db);
    isFirebaseConnected = false;
    notifyConnectionListeners(false);
    return true;
  } catch (error) {
    console.error('Error going offline:', error);
    return false;
  }
};

// Force online mode
export const goOnline = async () => {
  if (!db) {
    console.warn('Cannot go online - Firebase not initialized');
    return false;
  }
  
  try {
    await enableNetwork(db);
    isFirebaseConnected = true;
    notifyConnectionListeners(true);
    return true;
  } catch (error) {
    console.error('Error going online:', error);
    isFirebaseConnected = false;
    notifyConnectionListeners(false);
    return false;
  }
};

// Initialize connection test only if Firebase is available
if (app && db) {
  testFirebaseConnection();
}

export default app;
