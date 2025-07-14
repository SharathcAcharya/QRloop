import React from 'react';
import { Info, Heart, Star, Github, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About QRloop
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Learn more about our advanced QR code generator
          </p>
        </div>

        <div className="card">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
            <Info size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              About page content will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
