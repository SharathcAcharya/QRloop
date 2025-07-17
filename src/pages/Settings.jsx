import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, User, Download } from 'lucide-react';

const Settings = () => {
  // Settings state
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(true);
  const [user] = useState({
    name: 'SharathcAcharya',
    email: 'hello@qrloop.com',
    avatar: 'https://avatars.githubusercontent.com/u/10242663?v=4'
  });

  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      document.documentElement.classList.toggle('dark', !prev);
      return !prev;
    });
  };

  const handleNotificationsToggle = () => {
    setNotifications((prev) => !prev);
  };

  const handleExportData = () => {
    // Simulate export
    const data = { user, settings: { darkMode, notifications } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrloop-settings-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-0 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg mb-2">
            <SettingsIcon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 dark:text-indigo-100 tracking-tight drop-shadow-lg">Settings</h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mt-2">
            Customize your QRloop experience and manage your account.
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col md:flex-row items-center gap-6">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-indigo-300 dark:border-indigo-700 shadow-lg" />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-100">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Theme Toggle */}
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sun className={`w-7 h-7 ${!darkMode ? 'text-yellow-400' : 'text-gray-400'}`} />
              <span className="font-semibold text-lg">Light</span>
              <label className="mx-2 relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={darkMode} onChange={handleThemeToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-indigo-600 peer-checked:bg-indigo-600 transition-all"></div>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-indigo-700"></span>
              </label>
              <span className="font-semibold text-lg">Dark</span>
              <Moon className={`w-7 h-7 ${darkMode ? 'text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Switch between light and dark mode for your preferred look.</p>
          </div>

          {/* Notifications Toggle */}
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Bell className={`w-7 h-7 ${notifications ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="font-semibold text-lg">Notifications</span>
              <label className="mx-2 relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifications} onChange={handleNotificationsToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 dark:bg-gray-700 rounded-full peer dark:peer-checked:bg-green-600 peer-checked:bg-green-600 transition-all"></div>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-green-700"></span>
              </label>
              <BellOff className={`w-7 h-7 ${!notifications ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Enable or disable notifications for important updates.</p>
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center gap-4">
          <Download className="w-8 h-8 text-indigo-500 mb-2" />
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-2">Export Settings & Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Download your settings and account info as a backup.</p>
          <button onClick={handleExportData} className="btn-primary px-8 py-3 text-lg">Export Data</button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-12">
          &copy; {new Date().getFullYear()} QRloop. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Settings;
