import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  QrCode, 
  ScanLine,
  FolderOpen,
  Palette,
  BarChart3,
  Users,
  Settings,
  Info,
  X
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/generator', icon: QrCode, label: 'QR Generator' },
    { path: '/scanner', icon: ScanLine, label: 'QR Scanner' },
    { path: '/library', icon: FolderOpen, label: 'Library' },
    { path: '/templates', icon: Palette, label: 'Templates' },
    // Only show Analytics to admin users
    ...(isAdmin ? [{ path: '/analytics', icon: BarChart3, label: 'Analytics' }] : []),
    { path: '/collaboration', icon: Users, label: 'Collaboration' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">QRloop</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            QRloop v1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
