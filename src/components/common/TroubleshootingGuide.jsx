import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, HelpCircle, ExternalLink } from 'lucide-react';

const TroubleshootingGuide = ({ isVisible, onClose }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const troubleshootingSteps = [
    {
      id: 'network',
      title: 'Network Connection Issues',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      description: 'Problems with internet connectivity or network restrictions',
      steps: [
        'Check your internet connection',
        'Try accessing other websites to confirm connectivity',
        'If using corporate/school network, contact IT support',
        'Try using mobile data or different WiFi network'
      ]
    },
    {
      id: 'browser',
      title: 'Browser Extension Conflicts',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      description: 'Ad blockers or privacy extensions blocking Firebase',
      steps: [
        'Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)',
        'Disable privacy extensions (Privacy Badger, Ghostery, etc.)',
        'Try incognito/private browsing mode',
        'Whitelist this website in your extensions',
        'Check browser console for blocked requests'
      ]
    },
    {
      id: 'firebase',
      title: 'Firebase Configuration',
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      description: 'Issues with Firebase project settings or API keys',
      steps: [
        'Verify Firebase project is active and billing is set up',
        'Check if API keys are valid and not expired',
        'Ensure Firestore and Authentication are enabled',
        'Verify domain is authorized in Firebase Console',
        'Check Firebase project quotas and limits'
      ]
    },
    {
      id: 'cache',
      title: 'Browser Cache and Storage',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      description: 'Clear cached data that might be causing conflicts',
      steps: [
        'Clear browser cache and cookies',
        'Clear localStorage and sessionStorage',
        'Disable browser cache (in DevTools)',
        'Try a different browser',
        'Update your browser to the latest version'
      ]
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Firebase Connection Troubleshooting
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Current Status
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              If you're seeing connection errors, try the solutions below in order. 
              Most issues are caused by browser extensions or network restrictions.
            </p>
          </div>

          <div className="space-y-4">
            {troubleshootingSteps.map((step) => (
              <div key={step.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => toggleSection(step.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {step.icon}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className={`transform transition-transform ${
                    expandedSection === step.id ? 'rotate-180' : ''
                  }`}>
                    ↓
                  </div>
                </button>
                
                {expandedSection === step.id && (
                  <div className="p-4 pt-0">
                    <ol className="space-y-2">
                      {step.steps.map((stepText, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {stepText}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Still Having Issues?
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mb-3">
              The app includes offline functionality, so you can still use most features without a Firebase connection.
            </p>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200">
                <ExternalLink className="w-4 h-4" />
                <span>Firebase Status Page</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200">
                <ExternalLink className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingGuide;
