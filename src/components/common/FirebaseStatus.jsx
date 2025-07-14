import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import testFirebaseConnection from '../../config/testFirebase';

const FirebaseStatus = () => {
  const [status, setStatus] = useState('testing'); // 'testing', 'connected', 'disconnected'
  const [lastTest, setLastTest] = useState(null);

  useEffect(() => {
    testConnection();
    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    setStatus('testing');
    const result = await testFirebaseConnection();
    setStatus(result.success ? 'connected' : 'disconnected');
    setLastTest(new Date().toLocaleTimeString());
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Firebase Connected';
      case 'disconnected':
        return 'Firebase Disconnected';
      default:
        return 'Testing Connection...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 px-3 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium ${getStatusColor()} z-50`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {lastTest && (
        <span className="text-xs opacity-75">
          {lastTest}
        </span>
      )}
      <button
        onClick={testConnection}
        className="ml-2 text-xs underline hover:no-underline"
      >
        Test
      </button>
    </div>
  );
};

export default FirebaseStatus;
