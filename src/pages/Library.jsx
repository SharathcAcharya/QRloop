import React from 'react';
import { Library, Search, Filter, Grid, List } from 'lucide-react';

const LibraryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Library
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and organize your QR code collection
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your QR Codes
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Filter size={20} />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Grid size={20} />
              </button>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
            <Library size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              QR code library management will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
