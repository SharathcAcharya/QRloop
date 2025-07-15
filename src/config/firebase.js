import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingVars);
  console.error('Please check your .env.local file and ensure all required variables are set.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with error handling
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics only if supported and not blocked
let analytics = null;

// Safely initialize analytics
const initializeAnalytics = async () => {
  try {
    const supported = await isSupported();
    if (supported && !navigator.userAgent.includes('Prerender')) {
      analytics = getAnalytics(app);
      console.log('Analytics initialized successfully');
    } else {
      console.log('Analytics not supported or prerendering detected');
    }
  } catch (error) {
    console.warn('Analytics initialization failed:', error.message);
    analytics = null;
  }
};

// Initialize analytics asynchronously
initializeAnalytics();

export { analytics };

// Connection status tracking
let isFirebaseConnected = true;
let connectionListeners = [];

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Try to enable network (this will fail if blocked)
    await enableNetwork(db);
    isFirebaseConnected = true;
    notifyConnectionListeners(true);
    return { success: true, message: 'Firebase connection successful' };
  } catch (error) {
    console.warn('Firebase connection issues:', error);
    isFirebaseConnected = false;
    notifyConnectionListeners(false);
    
    if (error.code === 'failed-precondition' || error.message.includes('blocked')) {
      return { 
        success: false, 
        error: 'Connection blocked by browser extension or ad blocker',
        suggestion: 'Please disable ad blocker for this site or use offline mode'
      };
    }
    
    return { 
      success: false, 
      error: error.message,
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

// Initialize connection test
testFirebaseConnection();

export default app;
