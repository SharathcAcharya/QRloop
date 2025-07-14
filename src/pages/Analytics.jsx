import React from 'react';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your QR code performance and usage statistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BarChart3, title: 'Total QR Codes', value: '125', change: '+12%' },
            { icon: Eye, title: 'Total Scans', value: '2,436', change: '+23%' },
            { icon: TrendingUp, title: 'Avg. Scans/QR', value: '19.5', change: '+8%' },
            { icon: Users, title: 'Active Users', value: '89', change: '+15%' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {stat.change}
                    </p>
                  </div>
                  <Icon size={32} className="text-primary-500" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analytics Charts
          </h3>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
            <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Advanced analytics charts will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
