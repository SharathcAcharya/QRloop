import { QrCode, Sparkles, Zap } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-2xl shadow-2xl animate-pulse">
            <QrCode size={48} className="text-white" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-2 -right-2 bg-accent-500 p-2 rounded-full shadow-lg animate-bounce">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-secondary-500 p-2 rounded-full shadow-lg animate-pulse">
            <Zap size={16} className="text-white" />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold gradient-text mb-4">QRloop</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Loading your advanced QR code generator...
        </p>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto mb-8">
          <div className="progress-bar">
            <div className="progress-fill w-full animate-pulse" />
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span>Initializing QR engine...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
            <span>Loading 3D visualization...</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span>Preparing AI enhancement...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
