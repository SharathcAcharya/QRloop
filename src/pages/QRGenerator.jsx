import { useState, useEffect, useRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { testFirebaseConnection, addConnectionListener, removeConnectionListener, goOffline, goOnline, isConnected } from '../config/firebase';
import { qrHistory, offlineData } from '../utils/localStorage';
import { 
  Type, 
  Link2, 
  Download, 
  Eye, 
  Zap, 
  Save,
  Share2,
  RefreshCw,
  Copy,
  Check,
  X,
  WifiOff,
  Wifi
} from 'lucide-react';

const QRGenerator = () => {
  // Local state to replace store
  const [qrData, setQRData] = useState('https://qrloop.com');
  const [qrOptions, setQROptions] = useState({
    width: 300,
    height: 300,
    margin: 10,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: 'H',
    dotsOptions: {
      color: '#000000',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'dot'
    },
    logoImage: null,
    logoMargin: 5,
    logoSize: 0.5
  });
  
  const [logoPreview, setLogoPreview] = useState(null);
  
  const showSuccess = (_message) => {
    // Success notification would go here
  };
  
  const showError = (_message) => {
    // Error notification would go here  
  };
  
  const incrementQRGenerated = () => {
    // QR generation analytics - save offline if Firebase is blocked
    if (firebaseConnected) {
      // Online: send to Firebase (implementation would go here)
      console.log('Incrementing QR generated count in Firebase');
    } else {
      // Offline: save to localStorage
      offlineData.saveAnalytics({
        type: 'qr_generated',
        timestamp: new Date().toISOString()
      });
      console.log('Saved QR generation to offline storage');
    }
  };
  
  const trackFeatureUsage = (feature) => {
    // Feature tracking - save offline if Firebase is blocked
    if (firebaseConnected) {
      // Online: send to Firebase (implementation would go here)
      console.log(`Tracking feature usage: ${feature} in Firebase`);
    } else {
      // Offline: save to localStorage
      offlineData.saveAnalytics({
        type: 'feature_usage',
        feature,
        timestamp: new Date().toISOString()
      });
      console.log(`Saved feature usage (${feature}) to offline storage`);
    }
  };
  
  const trackQRGeneration = async (data) => {
    // QR generation analytics - save offline if Firebase is blocked
    if (firebaseConnected) {
      // Online: send to Firebase (implementation would go here)
      console.log('Tracking QR generation in Firebase:', data);
    } else {
      // Offline: save to localStorage
      offlineData.saveQRGeneration({
        type: 'qr_generation',
        data,
        timestamp: new Date().toISOString()
      });
      console.log('Saved QR generation data to offline storage:', data);
    }
  };
  
  const testConnection = async () => {
    const result = await testFirebaseConnection();
    setConnectionStatus(result.success ? 'connected' : 'blocked');
    return result;
  };

  const toggleConnectionMode = async () => {
    if (firebaseConnected) {
      const success = await goOffline();
      if (success) {
        setConnectionStatus('offline');
        showSuccess('Switched to offline mode');
      }
    } else {
      const success = await goOnline();
      if (success) {
        setConnectionStatus('connected');
        showSuccess('Connected to Firebase');
      } else {
        setConnectionStatus('blocked');
        showError('Connection blocked. Please check your browser settings.');
      }
    }
  };

  // Firebase connection listener
  useEffect(() => {
    const handleConnectionChange = (connected) => {
      setFirebaseConnected(connected);
      if (!connected && connectionStatus === 'connected') {
        setConnectionStatus('blocked');
      }
    };

    addConnectionListener(handleConnectionChange);
    return () => removeConnectionListener(handleConnectionChange);
  }, [connectionStatus]);

  // Logo image handling
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setLogoPreview(imageDataUrl);
        setQROptions(prev => ({ 
          ...prev, 
          logoImage: imageDataUrl 
        }));
        showSuccess('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setQROptions(prev => ({ 
      ...prev, 
      logoImage: null 
    }));
    showSuccess('Logo removed successfully!');
  };
  
  const [activeTab, setActiveTab] = useState('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [generated, setGenerated] = useState(false);

  const dataTypes = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'url', label: 'URL', icon: Link2 },
    { id: 'email', label: 'Email', icon: '@' },
    { id: 'phone', label: 'Phone', icon: '📱' },
    { id: 'sms', label: 'SMS', icon: '💬' },
    { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { id: 'vcard', label: 'Contact', icon: '👤' },
  ];

  // Initialize QR Code Styling
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: qrOptions.width,
      height: qrOptions.height,
      type: "svg",
      data: qrData || "QRloop - Advanced QR Code Generator",
      image: qrOptions.logoImage,
      dotsOptions: {
        color: qrOptions.dotsOptions?.color || qrOptions.colorDark || '#000000',
        type: qrOptions.dotsOptions?.type || "square"
      },
      backgroundOptions: {
        color: qrOptions.backgroundOptions?.color || qrOptions.colorLight || '#ffffff',
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: qrOptions.logoMargin || 5,
        imageSize: qrOptions.logoSize || 0.5
      },
      cornersSquareOptions: {
        color: qrOptions.cornersSquareOptions?.color || qrOptions.colorDark || '#000000',
        type: qrOptions.cornersSquareOptions?.type || "square"
      },
      cornersDotOptions: {
        color: qrOptions.cornersDotOptions?.color || qrOptions.colorDark || '#000000',
        type: qrOptions.cornersDotOptions?.type || "square"
      },
      qrOptions: {
        errorCorrectionLevel: qrOptions.correctLevel || "H"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize QR options to prevent unnecessary re-renders
  const memoizedQROptions = useMemo(() => ({
    width: qrOptions.width,
    height: qrOptions.height,
    data: qrData || "QRloop - Advanced QR Code Generator",
    image: qrOptions.logoImage,
    dotsOptions: {
      color: qrOptions.dotsOptions?.color || qrOptions.colorDark || '#000000',
      type: qrOptions.dotsOptions?.type || qrOptions.dotOptions?.type || "square"
    },
    backgroundOptions: {
      color: qrOptions.backgroundOptions?.color || qrOptions.colorLight || '#ffffff',
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: Math.max(0, qrOptions.logoMargin || 5),
      imageSize: Math.min(0.8, Math.max(0.2, qrOptions.logoSize || 0.5))
    },
    cornersSquareOptions: {
      color: qrOptions.cornersSquareOptions?.color || qrOptions.cornerSquareOptions?.color || qrOptions.colorDark || '#000000',
      type: qrOptions.cornersSquareOptions?.type || qrOptions.cornerSquareOptions?.type || "square"
    },
    cornersDotOptions: {
      color: qrOptions.cornersDotOptions?.color || qrOptions.cornerDotOptions?.color || qrOptions.colorDark || '#000000',
      type: qrOptions.cornersDotOptions?.type || qrOptions.cornerDotOptions?.type || "square"
    },
    qrOptions: {
      errorCorrectionLevel: qrOptions.correctLevel || "H"
    }
  }), [
    qrData, 
    qrOptions.width, 
    qrOptions.height, 
    qrOptions.colorDark, 
    qrOptions.colorLight,
    qrOptions.dotsOptions?.color,
    qrOptions.dotsOptions?.type,
    qrOptions.dotOptions?.type,
    qrOptions.backgroundOptions?.color,
    qrOptions.cornersSquareOptions?.color,
    qrOptions.cornersSquareOptions?.type,
    qrOptions.cornerSquareOptions?.color,
    qrOptions.cornerSquareOptions?.type,
    qrOptions.cornersDotOptions?.color,
    qrOptions.cornersDotOptions?.type,
    qrOptions.cornerDotOptions?.color,
    qrOptions.cornerDotOptions?.type,
    qrOptions.correctLevel,
    qrOptions.logoImage,
    qrOptions.logoMargin,
    qrOptions.logoSize
  ]);

  // Update QR code when options change
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update(memoizedQROptions);
    }
  }, [memoizedQROptions]);

  const generateQR = async () => {
    if (!qrData.trim()) {
      showError('Please enter some data to generate QR code');
      return;
    }

    setIsGenerating(true);
    trackFeatureUsage('generate-qr');

    try {
      // Update QR code with new data
      if (qrCodeRef.current) {
        qrCodeRef.current.update({
          data: qrData
        });
        
        // Render to canvas
        if (canvasRef.current) {
          await qrCodeRef.current.getRawData("png").then(blob => {
            if (blob) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              const img = new Image();
              
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setGenerated(true);
              };
              
              img.src = URL.createObjectURL(blob);
            }
          });
        }
      }
      
      // Add to history - save to localStorage
      const historyEntry = qrHistory.add({
        data: qrData,
        options: qrOptions,
        name: `QR Code ${Date.now()}`,
      });
      
      // Track analytics
      await trackQRGeneration({
        text: qrData,
        type: activeTab,
        size: qrOptions.width,
        errorCorrectionLevel: qrOptions.correctLevel
      });
      
      incrementQRGenerated();
      showSuccess('QR code generated successfully!');
    } catch (error) {
      console.error('QR Generation Error:', error);
      showError('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format = 'png') => {
    if (!generated || !qrCodeRef.current) {
      showError('Please generate a QR code first');
      return;
    }

    trackFeatureUsage('download-qr');
    
    try {
      if (format === 'svg') {
        qrCodeRef.current.download({ 
          name: `qrcode-${Date.now()}`, 
          extension: 'svg' 
        });
      } else if (format === 'png') {
        qrCodeRef.current.download({ 
          name: `qrcode-${Date.now()}`, 
          extension: 'png' 
        });
      } else if (format === 'pdf') {
        // Create PDF with jsPDF
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF();
        
        const blob = await qrCodeRef.current.getRawData('png');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 20, 20, 170, 170);
          pdf.save(`qrcode-${Date.now()}.pdf`);
        };
        
        img.src = URL.createObjectURL(blob);
      }
      
      showSuccess(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Download Error:', error);
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

  const handle3DView = () => {
    setShow3D(!show3D);
    trackFeatureUsage('3d-preview');
    
    if (!show3D) {
      showSuccess('3D view enabled! Use your mouse to rotate the QR code.');
    } else {
      showSuccess('3D view disabled.');
    }
  };

  const handleAIEnhance = async () => {
    if (!qrData.trim()) {
      showError('Please enter some data first');
      return;
    }

    setIsEnhancing(true);
    trackFeatureUsage('ai-enhance');
    
    try {
      // Simulate AI enhancement with improved settings
      const enhancedOptions = {
        ...qrOptions,
        // AI enhancement: Optimize for better scanning
        correctLevel: 'H', // High error correction for better reliability
        width: Math.max(400, qrOptions.width), // Minimum 400px for better scanning
        height: Math.max(400, qrOptions.height),
        // Enhanced visual appeal
        dotsOptions: {
          ...qrOptions.dotsOptions,
          type: 'rounded' // Rounded dots are more aesthetically pleasing
        },
        cornersSquareOptions: {
          ...qrOptions.cornersSquareOptions,
          type: 'extra-rounded' // Rounded corners for modern look
        },
        cornersDotOptions: {
          ...qrOptions.cornersDotOptions,
          type: 'dot' // Circular corner dots
        }
      };

      // Apply AI-enhanced settings
      setQROptions(enhancedOptions);
      
      // Auto-generate with enhanced settings
      setTimeout(() => {
        generateQR();
        setIsEnhancing(false);
        showSuccess('QR Code enhanced with AI optimization for better scanning and visual appeal!');
      }, 1500); // Simulate AI processing time
      
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      showError('Failed to enhance QR code');
      setIsEnhancing(false);
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
          {/* Connection Issue Banner */}
          {connectionStatus === 'blocked' && (
            <div className="lg:col-span-3 mb-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Firebase Connection Blocked
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Your browser or an extension is blocking Firebase requests. The app will work in offline mode, but some features may be limited.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          showSuccess('Try disabling ad blockers, privacy extensions, or adding this site to your allowlist.');
                        }}
                        className="text-xs bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-1 rounded hover:bg-amber-200 dark:hover:bg-amber-700"
                      >
                        Show Solutions
                      </button>
                      <button
                        onClick={toggleConnectionMode}
                        className="text-xs bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-1 rounded hover:bg-amber-200 dark:hover:bg-amber-700"
                      >
                        Switch to Offline Mode
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setConnectionStatus('dismissed')}
                    className="text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    onChange={(e) => setQROptions(prev => ({ 
                      ...prev, 
                      width: parseInt(e.target.value), 
                      height: parseInt(e.target.value) 
                    }))}
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
                      onChange={(e) => setQROptions(prev => ({ 
                        ...prev, 
                        colorDark: e.target.value,
                        dotsOptions: { ...prev.dotsOptions, color: e.target.value },
                        cornersSquareOptions: { ...prev.cornersSquareOptions, color: e.target.value },
                        cornersDotOptions: { ...prev.cornersDotOptions, color: e.target.value }
                      }))}
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
                      onChange={(e) => setQROptions(prev => ({ 
                        ...prev, 
                        colorLight: e.target.value,
                        backgroundOptions: { ...prev.backgroundOptions, color: e.target.value }
                      }))}
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
                        onClick={() => setQROptions(prev => ({ 
                          ...prev, 
                          ...preset.options,
                          dotsOptions: { ...prev.dotsOptions, ...preset.options.dotOptions },
                          backgroundOptions: { ...prev.backgroundOptions, color: preset.options.colorLight },
                          cornersSquareOptions: { ...prev.cornersSquareOptions, color: preset.options.colorDark },
                          cornersDotOptions: { ...prev.cornersDotOptions, color: preset.options.colorDark }
                        }))}
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
                        onChange={(e) => setQROptions(prev => ({ ...prev, correctLevel: e.target.value }))}
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
                        onChange={(e) => setQROptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dot Style
                      </label>
                      <select
                        value={qrOptions.dotsOptions?.type || 'square'}
                        onChange={(e) => setQROptions(prev => ({ 
                          ...prev,
                          dotsOptions: { ...prev.dotsOptions, type: e.target.value } 
                        }))}
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

            {/* Logo Upload Section */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Logo/Image
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900 dark:file:text-purple-200"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, SVG up to 5MB</p>
                </div>

                {logoPreview && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Logo Preview
                      </label>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-12 h-12 object-contain border border-gray-200 dark:border-gray-600 rounded bg-white"
                        />
                        <button
                          onClick={removeLogo}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Logo Size: {Math.round(qrOptions.logoSize * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.2"
                        max="0.8"
                        step="0.05"
                        value={qrOptions.logoSize}
                        onChange={(e) => setQROptions(prev => ({
                          ...prev,
                          logoSize: parseFloat(e.target.value)
                        }))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>20%</span>
                        <span>50%</span>
                        <span>80%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Logo Margin: {qrOptions.logoMargin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={qrOptions.logoMargin}
                        onChange={(e) => setQROptions(prev => ({
                          ...prev,
                          logoMargin: parseInt(e.target.value)
                        }))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>0px</span>
                        <span>10px</span>
                        <span>20px</span>
                      </div>
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

                <div className="grid grid-cols-3 gap-3">
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
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download size={16} />
                    <span>PDF</span>
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
                    onClick={() => {
                      if (qrData && generated) {
                        const saved = qrHistory.add({
                          data: qrData,
                          options: qrOptions,
                          name: `QR Code ${new Date().toLocaleString()}`,
                        });
                        trackFeatureUsage('save-qr');
                        showSuccess(`QR Code saved to history as "${saved.name}"`);
                      } else {
                        showError('Please generate a QR code first');
                      }
                    }}
                    className="btn-outline flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>

                {/* Firebase Connection Status & Controls */}
                <div className="space-y-2">
                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    connectionStatus === 'connected' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                    connectionStatus === 'blocked' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {connectionStatus === 'connected' ? (
                        <Wifi size={16} className="text-green-600 dark:text-green-400" />
                      ) : (
                        <WifiOff size={16} className="text-red-600 dark:text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        connectionStatus === 'connected' ? 'text-green-700 dark:text-green-300' :
                        connectionStatus === 'blocked' ? 'text-red-700 dark:text-red-300' :
                        'text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {connectionStatus === 'connected' ? 'Online' :
                         connectionStatus === 'blocked' ? 'Blocked' : 'Offline'}
                      </span>
                    </div>
                    <button
                      onClick={toggleConnectionMode}
                      className={`text-xs px-2 py-1 rounded ${
                        connectionStatus === 'connected' ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' :
                        'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {firebaseConnected ? 'Go Offline' : 'Reconnect'}
                    </button>
                  </div>

                  <button
                    onClick={async () => {
                      const result = await testConnection();
                      if (result.success) {
                        showSuccess('Firebase connection successful!');
                      } else {
                        showError(result.suggestion || result.error);
                      }
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Test Firebase Connection
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
                    onClick={handle3DView}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      show3D 
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                        : 'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-800'
                    }`}
                  >
                    <Eye size={16} />
                    <span>{show3D ? '3D Active' : '3D View'}</span>
                  </button>
                  <button
                    onClick={handleAIEnhance}
                    disabled={isEnhancing}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnhancing ? (
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap size={16} />
                    )}
                    <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-96">
                {qrData ? (
                  <div 
                    className={`bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg transition-all duration-500 relative ${
                      show3D ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                    style={{
                      transformStyle: show3D ? 'preserve-3d' : 'flat',
                      perspective: show3D ? '1000px' : 'none',
                      transform: show3D ? 'rotateX(5deg) rotateY(-5deg)' : 'none',
                      boxShadow: show3D ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'
                    }}
                    onMouseMove={(e) => {
                      if (show3D) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width;
                        const y = (e.clientY - rect.top) / rect.height;
                        const rotateY = (x - 0.5) * 20;
                        const rotateX = (y - 0.5) * -20;
                        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (show3D) {
                        e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1)';
                      }
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      width={qrOptions.width}
                      height={qrOptions.height}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300"
                    />
                    {show3D && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        3D
                      </div>
                    )}
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

              {/* 3D Instructions */}
              {show3D && qrData && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <Eye size={16} />
                    <span className="text-sm font-medium">3D Mode Active</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Move your mouse over the QR code to rotate it in 3D space!
                  </p>
                </div>
              )}

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
                        {qrOptions.correctLevel === 'H' && (
                          <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1 rounded">
                            AI Optimized
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900 dark:text-blue-300">Data Length:</span>
                      <span className="text-blue-800 dark:text-blue-200 ml-2">
                        {qrData.length} chars
                      </span>
                    </div>
                  </div>
                  
                  {/* AI Enhancement Status */}
                  {(qrOptions.width >= 400 && qrOptions.correctLevel === 'H' && 
                    qrOptions.dotsOptions?.type === 'rounded' && 
                    qrOptions.cornersSquareOptions?.type === 'extra-rounded') && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                        <Zap size={14} />
                        <span className="text-xs font-medium">AI Enhanced for optimal scanning and visual appeal</span>
                      </div>
                    </div>
                  )}
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
