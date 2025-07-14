import { useEffect } from 'react';
import AnalyticsService from '../services/analyticsService';
import testFirebaseConnection from '../config/testFirebase';

export const useAnalytics = () => {
  
  const trackQRGeneration = async (qrData = {}) => {
    try {
      await AnalyticsService.trackQRGeneration({
        text: qrData.text || '',
        qrType: qrData.type || qrData.qrType || 'text',
        size: qrData.size || 256,
        errorCorrectionLevel: qrData.errorCorrectionLevel || 'M',
        userAgent: navigator.userAgent || 'unknown'
      });
    } catch (error) {
      console.error('Failed to track QR generation:', error);
    }
  };

  const trackQRScan = async (scanData = {}) => {
    try {
      await AnalyticsService.trackQRScan({
        scannedContent: scanData.content || scanData.scannedContent || '',
        scanMethod: scanData.method || scanData.scanMethod || 'camera',
        userAgent: navigator.userAgent || 'unknown'
      });
    } catch (error) {
      console.error('Failed to track QR scan:', error);
    }
  };

  const trackUserActivity = async (activity = {}) => {
    try {
      await AnalyticsService.trackUserActivity({
        action: activity.action || 'unknown',
        page: activity.page || window.location.pathname,
        userAgent: navigator.userAgent || 'unknown'
      });
    } catch (error) {
      console.error('Failed to track user activity:', error);
    }
  };

  // Test Firebase connectivity
  const testConnection = async () => {
    console.log('Testing Firebase connection...');
    const result = await testFirebaseConnection();
    console.log('Connection test result:', result);
    return result;
  };

  // Track page views with error handling
  useEffect(() => {
    // Always try to track page views, even if connection test fails
    // because QR generation tracking seems to work
    trackUserActivity({
      action: 'page_view',
      page: window.location.pathname
    }).catch(error => {
      console.warn('Page view tracking failed:', error.message);
    });
  }, []);

  return {
    trackQRGeneration,
    trackQRScan,
    trackUserActivity,
    testConnection
  };
};

export default useAnalytics;
