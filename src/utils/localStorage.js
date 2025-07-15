// Utility functions for localStorage with error handling

const STORAGE_KEYS = {
  QR_HISTORY: 'qrloop_qr_history',
  USER_PREFERENCES: 'qrloop_user_preferences',
  OFFLINE_DATA: 'qrloop_offline_data'
};

// Safe localStorage wrapper with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};

// QR Code history management
export const qrHistory = {
  add: (qrData) => {
    const history = storage.get(STORAGE_KEYS.QR_HISTORY, []);
    const newEntry = {
      id: Date.now(),
      data: qrData.data,
      options: qrData.options,
      timestamp: new Date().toISOString(),
      name: qrData.name || `QR Code ${history.length + 1}`
    };
    
    // Keep only last 50 entries
    const updatedHistory = [newEntry, ...history.slice(0, 49)];
    storage.set(STORAGE_KEYS.QR_HISTORY, updatedHistory);
    return newEntry;
  },

  getAll: () => {
    return storage.get(STORAGE_KEYS.QR_HISTORY, []);
  },

  remove: (id) => {
    const history = storage.get(STORAGE_KEYS.QR_HISTORY, []);
    const filtered = history.filter(item => item.id !== id);
    storage.set(STORAGE_KEYS.QR_HISTORY, filtered);
    return filtered;
  },

  clear: () => {
    storage.set(STORAGE_KEYS.QR_HISTORY, []);
  }
};

// User preferences
export const userPreferences = {
  get: () => {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'system',
      defaultQRSize: 300,
      defaultErrorCorrection: 'M',
      showAdvancedByDefault: false
    });
  },

  set: (preferences) => {
    const current = userPreferences.get();
    const updated = { ...current, ...preferences };
    storage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
    return updated;
  }
};

// Offline data management
export const offlineData = {
  saveQRGeneration: (data) => {
    const offline = storage.get(STORAGE_KEYS.OFFLINE_DATA, { qrGenerations: [], analytics: [] });
    offline.qrGenerations.push({
      ...data,
      timestamp: new Date().toISOString(),
      synced: false
    });
    storage.set(STORAGE_KEYS.OFFLINE_DATA, offline);
  },

  saveAnalytics: (event) => {
    const offline = storage.get(STORAGE_KEYS.OFFLINE_DATA, { qrGenerations: [], analytics: [] });
    offline.analytics.push({
      ...event,
      timestamp: new Date().toISOString(),
      synced: false
    });
    storage.set(STORAGE_KEYS.OFFLINE_DATA, offline);
  },

  getPendingSync: () => {
    return storage.get(STORAGE_KEYS.OFFLINE_DATA, { qrGenerations: [], analytics: [] });
  },

  markSynced: (type, timestamps) => {
    const offline = storage.get(STORAGE_KEYS.OFFLINE_DATA, { qrGenerations: [], analytics: [] });
    if (type === 'qrGenerations') {
      offline.qrGenerations = offline.qrGenerations.map(item => 
        timestamps.includes(item.timestamp) ? { ...item, synced: true } : item
      );
    } else if (type === 'analytics') {
      offline.analytics = offline.analytics.map(item => 
        timestamps.includes(item.timestamp) ? { ...item, synced: true } : item
      );
    }
    storage.set(STORAGE_KEYS.OFFLINE_DATA, offline);
  },

  clearSynced: () => {
    const offline = storage.get(STORAGE_KEYS.OFFLINE_DATA, { qrGenerations: [], analytics: [] });
    offline.qrGenerations = offline.qrGenerations.filter(item => !item.synced);
    offline.analytics = offline.analytics.filter(item => !item.synced);
    storage.set(STORAGE_KEYS.OFFLINE_DATA, offline);
  }
};

export default storage;
