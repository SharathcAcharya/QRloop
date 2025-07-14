import React from 'react';
import { Camera, Upload, Search, History, FileText, Check, X } from 'lucide-react';

const QRScanner = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Code Scanner
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Scan QR codes from your camera or upload an image
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Live Scanner
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Camera scanner will be implemented here
              </p>
            </div>
          </div>

          {/* Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Image
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Image upload scanner will be implemented here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
