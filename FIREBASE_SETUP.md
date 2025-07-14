# QRloop Firebase Admin Setup

## 🔥 Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "qrloop-project"
3. Enable Authentication, Firestore, and Analytics

### 2. Configure Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. **Enable "Anonymous" provider** (for analytics tracking)
4. (Optional) Enable other providers as needed

### 3. Configure Firestore Database
1. Go to Firestore Database
2. Create database in production mode
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin access - only authenticated admins
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Analytics data - allow public write, admin read
    match /qr_generations/{docId} {
      allow create: if true; // Allow anonymous QR generation tracking
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /qr_scans/{docId} {
      allow create: if true; // Allow anonymous scan tracking  
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /daily_stats/{docId} {
      allow read, write: if true; // Allow public access for stats
    }
    
    match /user_activity/{docId} {
      allow create: if true; // Allow activity tracking
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Fallback for development - remove in production
    match /{document=**} {
      allow read, write: if false; // Explicitly deny all other access
    }
  }
}
```

### 3a. Development Rules (Temporary)
For development and testing, you can use these more permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all operations for development - REMOVE IN PRODUCTION
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING**: These rules allow public read/write access. Only use for development!

### 3b. Production Rules (Secure)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin access - only authenticated admins
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Analytics data - allow public write, admin read
    match /qr_generations/{docId} {
      allow create: if true; // Allow anonymous QR generation tracking
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /qr_scans/{docId} {
      allow create: if true; // Allow anonymous scan tracking  
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /daily_stats/{docId} {
      allow read, write: if true; // Allow public access for stats
    }
    
    match /user_activity/{docId} {
      allow create: if true; // Allow activity tracking
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Fallback for development - remove in production
    match /{document=**} {
      allow read, write: if false; // Explicitly deny all other access
    }
  }
}
```

### 4. Get Firebase Configuration
1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Add a web app or select existing
4. Copy the configuration object

### 5. Update Firebase Config
Replace the config in `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};
```

## 👨‍💼 Admin Setup

### First Time Setup
1. Start the application: `npm run dev`
2. Navigate to `http://localhost:3000/admin/setup`
3. Create your first admin user
4. Go to `http://localhost:3000/admin/login` to access the dashboard

### Admin Features
- **Analytics Dashboard**: View QR generation and scan statistics
- **User Activity Tracking**: Monitor user behavior and app usage
- **Real-time Data**: Live updates of QR code activity
- **Export Data**: Download analytics reports
- **System Monitoring**: Track app performance and usage patterns

## 📊 Analytics Features

### Tracked Events
- **QR Code Generation**: Content type, size, options used
- **QR Code Scanning**: Scanned content, scan method
- **User Activity**: Page views, feature usage, session data
- **Daily Statistics**: Aggregated daily metrics

### Dashboard Metrics
- Total QR generations
- Total QR scans  
- Average daily activity
- User engagement metrics
- Popular QR types and features

### Data Structure

#### QR Generations Collection
```javascript
{
  text: "QR content",
  qrType: "text|url|email|phone|sms|wifi|vcard",
  size: 256,
  errorCorrectionLevel: "M",
  userAgent: "browser info",
  timestamp: "2025-07-14T..."
}
```

#### QR Scans Collection
```javascript
{
  scannedContent: "scanned data",
  scanMethod: "camera|upload",
  userAgent: "browser info", 
  timestamp: "2025-07-14T..."
}
```

#### Daily Stats Collection
```javascript
{
  date: "2025-07-14",
  generations: 45,
  scans: 32,
  createdAt: "timestamp",
  lastUpdated: "timestamp"
}
```

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`  
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Security Checklist
- [ ] Configure proper Firestore security rules
- [ ] Enable Firebase App Check for production
- [ ] Set up Firebase hosting rules
- [ ] Configure authentication domain restrictions
- [ ] Enable audit logging for admin actions
- [ ] Set up backup and disaster recovery

## 🔒 Security Notes

- Admin routes are protected and require authentication
- Firebase security rules prevent unauthorized data access
- Analytics data is anonymized and aggregated
- Admin dashboard requires valid Firebase Authentication
- All sensitive operations are logged and auditable

## 📈 Scaling Considerations

- Firestore automatically scales with usage
- Consider implementing data archival for old analytics
- Monitor Firebase quotas and billing
- Implement caching for frequently accessed data
- Consider Cloud Functions for heavy analytics processing

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Missing or insufficient permissions" Error
**Symptoms**: 400 Bad Request, permission denied errors
**Solutions**:
1. **Update Firestore Rules**: Use the development rules from section 3a
2. **Enable Anonymous Auth**: Go to Authentication > Sign-in method > Enable Anonymous
3. **Check Project ID**: Ensure `projectId` in firebase config matches your Firebase project

#### 2. Firebase Connection Test Fails
**Steps to resolve**:
1. Open browser DevTools > Console
2. Look for specific error messages
3. Common fixes:
   - Wrong project configuration
   - Restrictive Firestore rules
   - Missing authentication setup

#### 3. Analytics Not Working
**Checklist**:
- [ ] Firebase config is correct
- [ ] Anonymous authentication enabled
- [ ] Development Firestore rules applied
- [ ] No console errors during QR generation

#### 4. Admin Dashboard Access Issues
**Requirements**:
- Admin user must be created via `/admin/setup`
- Email/Password authentication must be enabled
- Admin document must exist in `admins` collection

### Current Status Indicators
- ✅ **QR generation tracked successfully**: Analytics working
- ❌ **Firebase connection failed**: Check rules and authentication
- ⚠️ **Skipping analytics**: Connection issues detected

### Quick Fix for Development
If you're still getting permission errors, temporarily use these rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For more detailed Firebase documentation, visit: https://firebase.google.com/docs
