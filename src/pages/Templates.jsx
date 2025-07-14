import React from 'react';
import { Template, Palette, Star, Download } from 'lucide-react';

const Templates = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose from professional QR code templates
          </p>
        </div>

        <div className="card">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
            <Template size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Professional QR code templates will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
