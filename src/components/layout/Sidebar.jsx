import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  Home, 
  QrCode, 
  ScanLine, 
  BarChart3, 
  Library, 
  Layout, 
  Users, 
  Settings,
  Info,
  History,
  Heart,
  Zap,
  Palette,
  Download,
  Share2
} from 'lucide-react';
import { useQRStore } from '../../stores/qrStore';
import { useThemeStore } from '../../stores/themeStore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const { qrHistory, favorites } = useQRStore();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/generator', label: 'QR Generator', icon: QrCode },
    { path: '/scanner', label: 'QR Scanner', icon: ScanLine },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/templates', label: 'Templates', icon: Layout },
    { path: '/collaboration', label: 'Collaborate', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/about', label: 'About', icon: Info },
  ];

  const quickActions = [
    { label: 'Recent QRs', icon: History, count: qrHistory.length },
    { label: 'Favorites', icon: Heart, count: favorites.length },
    { label: 'AI Enhance', icon: Zap, badge: 'NEW' },
    { label: 'Templates', icon: Palette, count: 12 },
    { label: 'Export', icon: Download },
    { label: 'Share', icon: Share2 },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <QrCode size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">QRloop</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Advanced QR Generator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Navigation
              </h2>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-lg' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  
                  return (
                    <button
                      key={action.label}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={18} />
                        <span className="font-medium">{action.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {action.badge && (
                          <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full font-medium">
                            {action.badge}
                          </span>
                        )}
                        {action.count !== undefined && (
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium">
                            {action.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {qrHistory.slice(0, 3).map((qr) => (
                  <div key={qr.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <QrCode size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {qr.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(qr.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {qrHistory.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent QR codes
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
                <h3 className="text-sm font-semibold mb-2">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{qrHistory.length}</p>
                    <p className="text-xs opacity-90">QR Codes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{favorites.length}</p>
                    <p className="text-xs opacity-90">Favorites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">U</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                </div>
              </div>
              <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
