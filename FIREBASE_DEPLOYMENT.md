# Firebase Production Deployment Guide

## Environment Setup

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in your Firebase configuration:

```bash
cp .env.example .env.local
```

### 2. Firebase Configuration
Your Firebase config values can be found in the Firebase Console:
- Go to Project Settings → General → Your apps
- Select your web app
- Copy the configuration values

### 3. Production Environment
For production deployment, set these environment variables in your hosting platform:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Security Configuration

### 1. Firestore Security Rules
Update your Firestore rules in Firebase Console:

#### Development Rules (for testing)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Production Rules (recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics data - allow read/write for authenticated users
    match /analytics/{document} {
      allow read, write: if request.auth != null;
    }
    
    // QR codes - allow read/write for all users
    match /qr_codes/{document} {
      allow read, write: if true;
    }
    
    // Admin users - only allow admin access
    match /admin_users/{document} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    // Default: deny access to all other documents
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2. Firebase Authentication
Configure authentication providers in Firebase Console:
- Go to Authentication → Sign-in method
- Enable Email/Password provider for admin login

### 3. Firebase App Check (Recommended for production)
Enable App Check to protect your Firebase resources:
- Go to Project Settings → App Check
- Register your app with reCAPTCHA v3
- Enforce App Check for Firestore and other services

## Deployment Steps

### 1. Build for Production
```bash
npm run build
```

### 2. Test Locally
```bash
npm run preview
```

### 3. Deploy to Hosting Platform

#### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

#### Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Testing Checklist

- [ ] Environment variables are properly set
- [ ] Firebase connection is successful
- [ ] QR code generation works
- [ ] Analytics tracking is functional
- [ ] Admin login works
- [ ] Admin dashboard displays data
- [ ] Firestore security rules are applied
- [ ] No console errors in production

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Restart development server after adding variables
   - Check `.env.local` file is in project root

2. **Firebase Permission Errors**
   - Check Firestore security rules
   - Verify authentication is working
   - Ensure user has proper permissions

3. **Analytics Not Tracking**
   - Check if Analytics is enabled in Firebase Console
   - Verify measurement ID is correct
   - Check browser console for errors

4. **Build Errors**
   - Ensure all environment variables are available during build
   - Check for TypeScript/ESLint errors
   - Verify all imports are correct

## Monitoring

After deployment, monitor your application:
- Firebase Console → Analytics for usage data
- Firebase Console → Firestore for database activity
- Firebase Console → Authentication for user activity
- Browser console for any runtime errors

## Security Best Practices

1. **Never commit sensitive data**
   - Keep `.env.local` in `.gitignore`
   - Use environment variables for all secrets

2. **Implement proper security rules**
   - Use production Firestore rules
   - Enable App Check for additional security

3. **Monitor usage**
   - Set up Firebase billing alerts
   - Monitor for unusual activity

4. **Regular updates**
   - Keep Firebase SDK updated
   - Update security rules as needed
   - Review access permissions regularly
