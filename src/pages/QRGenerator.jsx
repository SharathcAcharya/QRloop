import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, 
  Link2, 
  Palette, 
  Download, 
  Eye, 
  Zap, 
  RotateCcw,
  Save,
  Share2,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  Copy,
  Check,
  Upload,
  X
} from 'lucide-react';
import { useQRStore } from '../stores/qrStore';
import { useNotificationStore } from '../stores/notificationStore';

const QRGenerator = () => {
  const { 
    qrData, 
    qrOptions, 
    setQRData, 
    setQROptions, 
    addToHistory, 
    visualization3D 
  } = useQRStore();
  const { showSuccess, showError, incrementQRGenerated, trackFeatureUsage } = useNotificationStore();
  
  const [activeTab, setActiveTab] = useState('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const canvasRef = useRef(null);

  const dataTypes = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'url', label: 'URL', icon: Link2 },
    { id: 'email', label: 'Email', icon: '@' },
    { id: 'phone', label: 'Phone', icon: '📱' },
    { id: 'sms', label: 'SMS', icon: '💬' },
    { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { id: 'vcard', label: 'Contact', icon: '👤' },
  ];

  const generateQR = async () => {
    if (!qrData.trim()) {
      showError('Please enter some data to generate QR code');
      return;
    }

    setIsGenerating(true);
    trackFeatureUsage('generate-qr');

    try {
      // Here you would integrate with qr-code-styling library
      // For now, we'll simulate the generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to history
      addToHistory({
        data: qrData,
        options: qrOptions,
        name: `QR Code ${Date.now()}`,
      });
      
      incrementQRGenerated();
      showSuccess('QR code generated successfully!');
    } catch (error) {
      showError('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format = 'png') => {
    trackFeatureUsage('download-qr');
    
    try {
      // Here you would implement actual download logic
      showSuccess(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      showError('Failed to download QR code');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      showSuccess('Data copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showError('Failed to copy data');
    }
  };

  const handleShare = async () => {
    trackFeatureUsage('share-qr');
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code from QRloop',
          text: qrData,
          url: window.location.href,
        });
      } else {
        handleCopy();
      }
    } catch (error) {
      showError('Failed to share QR code');
    }
  };

  const presets = [
    {
      name: 'Default',
      options: {
        colorDark: '#000000',
        colorLight: '#ffffff',
        dotOptions: { type: 'square' },
      },
    },
    {
      name: 'Rounded',
      options: {
        colorDark: '#1f2937',
        colorLight: '#ffffff',
        dotOptions: { type: 'rounded' },
      },
    },
    {
      name: 'Dots',
      options: {
        colorDark: '#3b82f6',
        colorLight: '#ffffff',
        dotOptions: { type: 'dots' },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create professional QR codes with advanced customization options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Data Type Selection */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {dataTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === type.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{typeof type.icon === 'string' ? type.icon : '📝'}</span>
                      <span>{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Input */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {activeTab === 'text' && 'Enter your text'}
                    {activeTab === 'url' && 'Enter URL'}
                    {activeTab === 'email' && 'Enter email address'}
                    {activeTab === 'phone' && 'Enter phone number'}
                    {activeTab === 'sms' && 'Enter SMS message'}
                    {activeTab === 'wifi' && 'Wi-Fi Network Name'}
                    {activeTab === 'vcard' && 'Contact Information'}
                  </label>
                  <textarea
                    value={qrData}
                    onChange={(e) => setQRData(e.target.value)}
                    placeholder={
                      activeTab === 'text' ? 'Enter your text here...' :
                      activeTab === 'url' ? 'https://example.com' :
                      activeTab === 'email' ? 'user@example.com' :
                      activeTab === 'phone' ? '+1234567890' :
                      'Enter content...'
                    }
                    className="input-field h-32 resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setQRData('')}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Customization */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customization
                </h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                >
                  {showAdvanced ? 'Basic' : 'Advanced'}
                </button>
              </div>

              <div className="space-y-4">
                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size: {qrOptions.width}px
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    value={qrOptions.width}
                    onChange={(e) => setQROptions({ width: parseInt(e.target.value), height: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Foreground
                    </label>
                    <input
                      type="color"
                      value={qrOptions.colorDark}
                      onChange={(e) => setQROptions({ colorDark: e.target.value })}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background
                    </label>
                    <input
                      type="color"
                      value={qrOptions.colorLight}
                      onChange={(e) => setQROptions({ colorLight: e.target.value })}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setQROptions({ ...qrOptions, ...preset.options })}
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Error Correction Level
                      </label>
                      <select
                        value={qrOptions.correctLevel}
                        onChange={(e) => setQROptions({ correctLevel: e.target.value })}
                        className="input-field"
                      >
                        <option value="L">Low (~7%)</option>
                        <option value="M">Medium (~15%)</option>
                        <option value="Q">Quartile (~25%)</option>
                        <option value="H">High (~30%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Margin: {qrOptions.margin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={qrOptions.margin}
                        onChange={(e) => setQROptions({ margin: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dot Style
                      </label>
                      <select
                        value={qrOptions.dotOptions?.type || 'square'}
                        onChange={(e) => setQROptions({ 
                          dotOptions: { ...qrOptions.dotOptions, type: e.target.value } 
                        })}
                        className="input-field"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="dots">Dots</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={generateQR}
                  disabled={isGenerating || !qrData.trim()}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <div className="loading-spinner" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  <span>{isGenerating ? 'Generating...' : 'Generate QR Code'}</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownload('png')}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => handleDownload('svg')}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>SVG</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleShare}
                    className="btn-outline flex items-center justify-center space-x-2"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => trackFeatureUsage('save-qr')}
                    className="btn-outline flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => trackFeatureUsage('3d-preview')}
                    className="flex items-center space-x-2 px-3 py-2 bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-800 transition-colors"
                  >
                    <Eye size={16} />
                    <span>3D View</span>
                  </button>
                  <button
                    onClick={() => trackFeatureUsage('ai-enhance')}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    <Zap size={16} />
                    <span>AI Enhance</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-96">
                {qrData ? (
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                    <canvas
                      ref={canvasRef}
                      width={qrOptions.width}
                      height={qrOptions.height}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Type size={32} />
                    </div>
                    <p className="text-lg font-medium mb-2">No QR Code Yet</p>
                    <p className="text-sm">Enter some content to generate your QR code</p>
                  </div>
                )}
              </div>

              {/* QR Code Info */}
              {qrData && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-300">Size:</span>
                      <span className="text-blue-800 dark:text-blue-200 ml-2">
                        {qrOptions.width}x{qrOptions.height}px
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-300">Error Correction:</span>
                      <span className="text-blue-800 dark:text-blue-200 ml-2">
                        {qrOptions.correctLevel}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-300">Data Length:</span>
                      <span className="text-blue-800 dark:text-blue-200 ml-2">
                        {qrData.length} chars
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
