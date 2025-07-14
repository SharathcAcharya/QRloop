import React from 'react';
import { Settings as SettingsIcon, User, Palette, Bell, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your QRloop experience
          </p>
        </div>

        <div className="card">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
            <SettingsIcon size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Settings panel will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
