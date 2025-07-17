import React, { useState } from 'react';
import { Cloud, RefreshCw, CheckCircle, AlertTriangle, UploadCloud, DownloadCloud } from 'lucide-react';

const CloudSynk = () => {
  const [status, setStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState('');

  const handleSync = async () => {
    setStatus('syncing');
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      setStatus('success');
      setLastSync(new Date().toLocaleString());
    } catch (e) {
      setStatus('error');
      setError('Failed to sync with cloud. Please try again.');
    }
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        {/* Floating Animation Backgrounds */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-indigo-300/30 dark:bg-indigo-800 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-300/30 dark:bg-purple-800 rounded-full blur-3xl animate-pulse" />

        {/* Header */}
        <div className="relative flex flex-col items-center text-center z-10">
          <Cloud className="w-14 h-14 text-indigo-600 dark:text-indigo-300 animate-bounce mb-2" />
          <h1 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-100">Cloud Synk</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mt-2">
            Securely sync your QR data and configuration with the cloud. Reliable backups, easy recovery, and seamless access across devices.
          </p>
        </div>

        {/* Action */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <button
            onClick={handleSync}
            disabled={status === 'syncing'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow flex items-center gap-2 disabled:opacity-50 transition duration-300"
          >
            <RefreshCw className={status === 'syncing' ? 'animate-spin' : ''} />
            {status === 'syncing' ? 'Syncing...' : 'Sync Now'}
          </button>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="w-5 h-5" />
              Synced successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Upload / Restore Features */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-8">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl text-center flex flex-col items-center shadow hover:shadow-lg transition">
            <UploadCloud className="w-10 h-10 text-indigo-500 dark:text-indigo-300 mb-2" />
            <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-200">Upload Backup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Securely upload your QR data and settings to the cloud.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl text-center flex flex-col items-center shadow hover:shadow-lg transition">
            <DownloadCloud className="w-10 h-10 text-purple-500 dark:text-purple-300 mb-2" />
            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-200">Restore Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Download your saved settings and QR library anytime.</p>
          </div>
        </div>

        {/* Sync Info */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 relative z-10">
          {lastSync ? (
            <>Last synced: <span className="font-semibold text-indigo-700 dark:text-indigo-300">{lastSync}</span></>
          ) : (
            <>No sync has been performed yet.</>
          )}
        </div>

        {/* Future Features */}
        <div className="mt-8 text-xs text-center text-gray-400 dark:text-gray-500 relative z-10">
          Coming Soon: Selective sync · Auto-backup · Multi-device support · Conflict resolution
        </div>
      </div>
    </div>
  );
};

export default CloudSynk;
