import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Analytics Service
export class AnalyticsService {
  
  // Track QR Code Generation
  static async trackQRGeneration(qrData) {
    try {
      // Check if database is available
      if (!db) {
        console.warn('Firebase database not available, storing analytics locally');
        this.storeAnalyticsLocally('qr_generation', qrData);
        return { success: true, stored: 'locally' };
      }

      // Filter out undefined values and provide defaults
      const cleanData = {
        text: qrData.text || '',
        qrType: qrData.qrType || qrData.type || 'text',
        size: qrData.size || 256,
        errorCorrectionLevel: qrData.errorCorrectionLevel || 'M',
        userAgent: qrData.userAgent || navigator.userAgent || 'unknown',
        timestamp: serverTimestamp(),
        type: 'generation'
      };
      
      // Track QR generation - debug info would go here in development
      
      const docRef = await addDoc(collection(db, 'qr_generations'), cleanData);
      
      // QR generation tracked successfully - notification would go here
      
      // Update daily stats
      await this.updateDailyStats('generations', 1);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Firebase connection failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Store locally as fallback
      this.storeAnalyticsLocally('qr_generation', qrData);
      return { success: false, error: error.message, stored: 'locally' };
    }
  }

  // Track QR Code Scan
  static async trackQRScan(scanData) {
    try {
      // Check if database is available
      if (!db) {
        console.warn('Firebase database not available, storing analytics locally');
        this.storeAnalyticsLocally('qr_scan', scanData);
        return { success: true, stored: 'locally' };
      }

      // Filter out undefined values and provide defaults
      const cleanData = {
        scannedContent: scanData.scannedContent || scanData.content || '',
        scanMethod: scanData.scanMethod || scanData.method || 'camera',
        userAgent: scanData.userAgent || navigator.userAgent || 'unknown',
        timestamp: serverTimestamp(),
        type: 'scan'
      };
      
      const docRef = await addDoc(collection(db, 'qr_scans'), cleanData);
      
      // Update daily stats
      await this.updateDailyStats('scans', 1);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error tracking QR scan:', error);
      this.storeAnalyticsLocally('qr_scan', scanData);
      return { success: false, error: error.message, stored: 'locally' };
    }
  }

  // Update daily statistics
  static async updateDailyStats(type, increment_value = 1) {
    try {
      if (!db) {
        console.warn('Database not available for updating stats');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const statsRef = doc(db, 'daily_stats', today);
      
      try {
        await updateDoc(statsRef, {
          [type]: increment(increment_value),
          lastUpdated: serverTimestamp()
        });
      } catch (updateError) {
        // If document doesn't exist, create it
        await setDoc(statsRef, {
          [type]: increment_value,
          date: today,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating daily stats:', error);
    }
  }

  // Get analytics data for admin dashboard
  static async getAnalyticsData(timeRange = '30d') {
    try {
      if (!db) {
        console.warn('Database not available, returning local analytics data');
        return this.getLocalAnalyticsData();
      }

      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      
      // Get daily stats
      const dailyStatsQuery = query(
        collection(db, 'daily_stats'),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      );
      
      const dailyStatsSnapshot = await getDocs(dailyStatsQuery);
      const dailyStats = dailyStatsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get recent QR generations
      const generationsQuery = query(
        collection(db, 'qr_generations'),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      
      const generationsSnapshot = await getDocs(generationsQuery);
      const recentGenerations = generationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get recent QR scans
      const scansQuery = query(
        collection(db, 'qr_scans'),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      
      const scansSnapshot = await getDocs(scansQuery);
      const recentScans = scansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        data: {
          dailyStats,
          recentGenerations,
          recentScans,
          summary: this.calculateSummary(dailyStats)
        }
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate summary statistics
  static calculateSummary(dailyStats) {
    const totalGenerations = dailyStats.reduce((sum, day) => sum + (day.generations || 0), 0);
    const totalScans = dailyStats.reduce((sum, day) => sum + (day.scans || 0), 0);
    const avgGenerationsPerDay = totalGenerations / Math.max(dailyStats.length, 1);
    const avgScansPerDay = totalScans / Math.max(dailyStats.length, 1);

    return {
      totalGenerations,
      totalScans,
      avgGenerationsPerDay: Math.round(avgGenerationsPerDay * 100) / 100,
      avgScansPerDay: Math.round(avgScansPerDay * 100) / 100,
      totalUsers: dailyStats.length // Simplified - could be more sophisticated
    };
  }

  // Get user activity data
  static async getUserActivity(limit_count = 50) {
    try {
      if (!db) {
        console.warn('Database not available for user activity');
        return { success: true, data: [] };
      }

      const activityQuery = query(
        collection(db, 'user_activity'),
        orderBy('timestamp', 'desc'),
        limit(limit_count)
      );
      
      const snapshot = await getDocs(activityQuery);
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: activities };
    } catch (error) {
      console.error('Error getting user activity:', error);
      return { success: false, error: error.message };
    }
  }

  // Track user activity
  static async trackUserActivity(activityData) {
    try {
      if (!db) {
        console.warn('Database not available, storing activity locally');
        this.storeAnalyticsLocally('user_activity', activityData);
        return { success: true, stored: 'locally' };
      }

      // Filter out undefined values and provide defaults
      const cleanData = {
        action: activityData.action || 'unknown',
        page: activityData.page || window.location.pathname,
        userAgent: activityData.userAgent || navigator.userAgent || 'unknown',
        timestamp: serverTimestamp()
      };
      
      await addDoc(collection(db, 'user_activity'), cleanData);
      return { success: true };
    } catch (error) {
      console.error('Error tracking user activity:', error);
      this.storeAnalyticsLocally('user_activity', activityData);
      return { success: false, error: error.message, stored: 'locally' };
    }
  }

  // Local storage fallback methods
  static storeAnalyticsLocally(type, data) {
    try {
      const key = `qrloop_analytics_${type}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      });
      
      // Keep only last 100 entries to prevent storage bloat
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Error storing analytics locally:', error);
    }
  }

  static getLocalAnalyticsData() {
    try {
      const generations = JSON.parse(localStorage.getItem('qrloop_analytics_qr_generation') || '[]');
      const scans = JSON.parse(localStorage.getItem('qrloop_analytics_qr_scan') || '[]');
      
      return {
        totalGenerations: generations.length,
        totalScans: scans.length,
        avgGenerationsPerDay: generations.length / 30, // Rough estimate
        avgScansPerDay: scans.length / 30,
        totalUsers: 1, // Local user
        recentGenerations: generations.slice(-10),
        recentScans: scans.slice(-10),
        dailyStats: []
      };
    } catch (error) {
      console.error('Error getting local analytics:', error);
      return {
        totalGenerations: 0,
        totalScans: 0,
        avgGenerationsPerDay: 0,
        avgScansPerDay: 0,
        totalUsers: 0,
        recentGenerations: [],
        recentScans: [],
        dailyStats: []
      };
    }
  }
}

export default AnalyticsService;
