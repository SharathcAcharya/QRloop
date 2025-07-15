import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { testFirebaseConnection, addConnectionListener, removeConnectionListener, goOffline, goOnline } from '../../config/firebase';

const ConnectionStatus = ({ className = '' }) => {
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    isLoading: true,
    error: null,
    message: ''
  });

  useEffect(() => {
    let isMounted = true;

    // Test initial connection
    const checkConnection = async () => {
      try {
        const result = await testFirebaseConnection();
        if (isMounted) {
          setConnectionState({
            isConnected: result.success,
            isLoading: false,
            error: result.success ? null : result.error,
            message: result.success ? result.message : result.suggestion
          });
        }
      } catch (error) {
        if (isMounted) {
          setConnectionState({
            isConnected: false,
            isLoading: false,
            error: error.message,
            message: 'Failed to test connection'
          });
        }
      }
    };

    // Listen for connection changes
    const handleConnectionChange = (connected) => {
      if (isMounted) {
        setConnectionState(prev => ({
          ...prev,
          isConnected: connected,
          isLoading: false
        }));
      }
    };

    addConnectionListener(handleConnectionChange);
    checkConnection();

    return () => {
      isMounted = false;
      removeConnectionListener(handleConnectionChange);
    };
  }, []);

  const handleToggleConnection = async () => {
    setConnectionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (connectionState.isConnected) {
        await goOffline();
      } else {
        await goOnline();
      }
    } catch (error) {
      console.error('Failed to toggle connection:', error);
    }
    
    setConnectionState(prev => ({ ...prev, isLoading: false }));
  };

  if (connectionState.isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Checking connection...</span>
      </div>
    );
  }

  const statusIcon = connectionState.isConnected ? (
    <CheckCircle className="w-4 h-4 text-green-500" />
  ) : connectionState.error ? (
    <AlertTriangle className="w-4 h-4 text-yellow-500" />
  ) : (
    <WifiOff className="w-4 h-4 text-red-500" />
  );

  const statusText = connectionState.isConnected 
    ? 'Connected' 
    : connectionState.error 
    ? 'Limited' 
    : 'Offline';

  const statusColor = connectionState.isConnected 
    ? 'text-green-600' 
    : connectionState.error 
    ? 'text-yellow-600' 
    : 'text-red-600';

  return (
    <div className={`group relative ${className}`}>
      <div className="flex items-center space-x-2">
        {statusIcon}
        <span className={`text-sm font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>

      {/* Tooltip with detailed information */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {connectionState.isConnected ? (
          <div>
            <div className="font-medium">Firebase Connected</div>
            <div>All features available</div>
          </div>
        ) : connectionState.error ? (
          <div>
            <div className="font-medium">Limited Connection</div>
            <div className="max-w-xs">{connectionState.message}</div>
          </div>
        ) : (
          <div>
            <div className="font-medium">Offline Mode</div>
            <div>Some features may be limited</div>
          </div>
        )}
        
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && connectionState.error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 max-w-xs z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="font-medium">Debug Info:</div>
          <div>{connectionState.error}</div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
