import React, { useState } from 'react';
import { 
  Plus, 
  Zap, 
  Share2, 
  Palette, 
  Download, 
  Eye, 
  Settings, 
  X,
  QrCode,
  Camera,
  Sparkles,
  Grid3x3
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQRStore } from '../../stores/qrStore';
import { useNotificationStore } from '../../stores/notificationStore';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { qrData, qrOptions } = useQRStore();
  const { trackFeatureUsage } = useNotificationStore();

  const actions = [
    {
      id: 'generate',
      label: 'Generate QR',
      icon: QrCode,
      color: 'bg-primary-500 hover:bg-primary-600',
      onClick: () => {
        trackFeatureUsage('quick-generate');
        navigate('/generator');
        setIsOpen(false);
      },
    },
    {
      id: 'scan',
      label: 'Scan QR',
      icon: Camera,
      color: 'bg-secondary-500 hover:bg-secondary-600',
      onClick: () => {
        trackFeatureUsage('quick-scan');
        navigate('/scanner');
        setIsOpen(false);
      },
    },
    {
      id: '3d-preview',
      label: '3D Preview',
      icon: Eye,
      color: 'bg-accent-500 hover:bg-accent-600',
      onClick: () => {
        trackFeatureUsage('3d-preview');
        // Toggle 3D preview
        setIsOpen(false);
      },
    },
    {
      id: 'ai-enhance',
      label: 'AI Enhance',
      icon: Sparkles,
      color: 'bg-purple-500 hover:bg-purple-600',
      badge: 'NEW',
      onClick: () => {
        trackFeatureUsage('ai-enhance');
        // Open AI enhancement modal
        setIsOpen(false);
      },
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: Palette,
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => {
        trackFeatureUsage('quick-templates');
        navigate('/templates');
        setIsOpen(false);
      },
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {
        trackFeatureUsage('quick-share');
        // Open share modal
        setIsOpen(false);
      },
    },
    {
      id: 'batch',
      label: 'Batch Generate',
      icon: Grid3x3,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {
        trackFeatureUsage('batch-generate');
        // Open batch generation modal
        setIsOpen(false);
      },
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        trackFeatureUsage('quick-download');
        // Download current QR
        setIsOpen(false);
      },
    },
  ];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Don't show FAB on certain pages
  const hiddenPaths = ['/settings', '/about'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Action Menu */}
        <div className={`
          flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className={`
                  flex items-center space-x-3 transition-all duration-300
                  ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Action Label */}
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {action.label}
                    </span>
                    {action.badge && (
                      <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full font-medium">
                        {action.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={action.onClick}
                  className={`
                    w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 
                    flex items-center justify-center text-white transform hover:scale-110
                    ${action.color}
                  `}
                >
                  <Icon size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Main FAB */}
        <button
          onClick={toggleOpen}
          className={`
            w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center justify-center text-white transform hover:scale-110
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
            }
          `}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>

        {/* Pulse animation for attention */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-ping opacity-30" />
        )}
      </div>

      {/* Quick Stats Badge */}
      {!isOpen && qrData && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                QR Ready
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span className="text-xs text-gray-500 dark:text-gray-400">+</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
              K
            </kbd>
            <span className="text-xs text-gray-500 dark:text-gray-400">Quick Actions</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingActionButton;
