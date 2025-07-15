import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Search, History, Check, Download, Copy } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const QRScanner = () => {
  const [scanMode, setScanMode] = useState('camera');
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const showSuccess = useCallback((_message) => {
    // Success notification would go here
  }, []);
  
  const showError = useCallback((_message) => {
    // Error notification would go here
  }, []);
  
  const trackFeatureUsage = useCallback((_feature) => {
    // Feature tracking would go here
  }, []);
  
  const trackQRScan = useCallback((_data) => {
    // QR scan analytics would go here
  }, []);

  const detectQRType = (data) => {
    if (data.startsWith('http') || data.startsWith('https')) return 'URL';
    if (data.includes('@') && data.includes('.')) return 'Email';
    if (data.startsWith('tel:')) return 'Phone';
    if (data.startsWith('WIFI:')) return 'WiFi';
    if (data.startsWith('BEGIN:VCARD')) return 'vCard';
    return 'Text';
  };

  // Initialize camera stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, [stream]);

  // Scan QR code from video
  const scanFromVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const { default: jsQR } = await import('jsqr');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data !== scannedData?.text) {
          const scanResult = {
            id: Date.now().toString(),
            text: code.data,
            timestamp: new Date().toISOString(),
            method: 'camera',
            type: detectQRType(code.data)
          };

          setScannedData(scanResult);
          setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
          
          await trackQRScan({
            scannedContent: code.data,
            scanMethod: 'camera'
          });
          
          trackFeatureUsage('qr-scan');
          showSuccess('QR code scanned successfully!');
          stopCamera();
        }
      } catch (error) {
        console.error('QR scan error:', error);
      }
    }
  }, [isScanning, scannedData?.text, trackQRScan, trackFeatureUsage, showSuccess, stopCamera]);

  // Start scanning interval
  useEffect(() => {
    if (isScanning && scanMode === 'camera') {
      scanIntervalRef.current = setInterval(scanFromVideo, 100);
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, scanMode, scannedData, scanFromVideo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleFileUpload = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    trackFeatureUsage('qr-upload-scan');
    
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const { default: jsQR } = await import('jsqr');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          const scanResult = {
            id: Date.now().toString(),
            text: code.data,
            timestamp: new Date().toISOString(),
            method: 'upload',
            type: detectQRType(code.data)
          };

          setScannedData(scanResult);
          setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
          
          await trackQRScan({
            scannedContent: code.data,
            scanMethod: 'upload'
          });
          
          showSuccess('QR code decoded from image!');
        } else {
          showError('No QR code found in the uploaded image');
        }
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('File scan error:', error);
      showError('Failed to scan uploaded image');
    }
  }, [trackFeatureUsage, trackQRScan, showSuccess, showError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showSuccess('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showError('Failed to copy to clipboard');
    }
  };

  const handleAction = (data) => {
    const type = detectQRType(data);
    
    switch (type) {
      case 'URL':
        window.open(data, '_blank');
        break;
      case 'Email':
        window.location.href = `mailto:${data}`;
        break;
      case 'Phone':
        window.location.href = data;
        break;
      default:
        handleCopy(data);
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
    showSuccess('Scan history cleared');
  };

  const toggleScanning = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Code Scanner
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Scan QR codes from your camera or upload an image
          </p>
        </div>

        {/* Scan Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => {
                setScanMode('camera');
                if (isScanning) stopCamera();
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                scanMode === 'camera'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Camera size={16} className="inline mr-2" />
              Camera
            </button>
            <button
              onClick={() => {
                setScanMode('upload');
                if (isScanning) stopCamera();
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                scanMode === 'upload'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Upload size={16} className="inline mr-2" />
              Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {scanMode === 'camera' ? 'Camera Scanner' : 'Upload Image'}
              </h3>
              
              {scanMode === 'camera' ? (
                <div className="relative">
                  {cameraError ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
                      <Camera size={48} className="mx-auto text-red-400 mb-4" />
                      <p className="text-red-600 dark:text-red-400 mb-4">
                        {cameraError}
                      </p>
                      <button
                        onClick={() => {
                          setCameraError(null);
                          startCamera();
                        }}
                        className="btn-primary"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-lg bg-black"
                        style={{ aspectRatio: '16/9' }}
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                      <div className="absolute top-4 right-4 space-x-2">
                        <button
                          onClick={toggleScanning}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            isScanning
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {isScanning ? 'Stop' : 'Start'}
                        </button>
                      </div>
                      {!stream && !cameraError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <button
                            onClick={startCamera}
                            className="btn-primary flex items-center space-x-2"
                          >
                            <Camera size={20} />
                            <span>Start Camera</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-primary-600 dark:text-primary-400">
                      Drop the image here...
                    </p>
                  ) : (
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Supports PNG, JPG, GIF, BMP, WebP
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Scanned Result */}
              {scannedData && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                          QR Code Detected ({scannedData.type})
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {new Date(scannedData.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-green-700 dark:text-green-200 break-all mb-3">
                        {scannedData.text}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(scannedData.text)}
                          className="btn-primary text-sm"
                        >
                          {scannedData.type === 'URL' ? 'Open' : 
                           scannedData.type === 'Email' ? 'Send Email' :
                           scannedData.type === 'Phone' ? 'Call' : 'Copy'}
                        </button>
                        <button
                          onClick={() => handleCopy(scannedData.text)}
                          className="btn-secondary text-sm flex items-center space-x-1"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scan History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Scan History
              </h3>
              {scanHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {scanHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No scans yet
                  </p>
                </div>
              ) : (
                scanHistory.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setScannedData(scan)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        {scan.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {scan.text}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {scan.method === 'camera' ? (
                        <Camera size={12} className="mr-1" />
                      ) : (
                        <Upload size={12} className="mr-1" />
                      )}
                      {scan.method}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <Search size={14} className="inline mr-2" />
                  Search in history
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <Download size={14} className="inline mr-2" />
                  Export history
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
