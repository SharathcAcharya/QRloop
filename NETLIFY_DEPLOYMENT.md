# Netlify Deployment Configuration

## Environment Variables Setup

The Firebase connection issues in production are caused by missing environment variables in the Netlify deployment. Here's how to fix it:

### 1. Netlify Dashboard Configuration

Go to your Netlify site dashboard and add these environment variables in **Site Settings > Environment Variables**:

```
VITE_FIREBASE_API_KEY=AIzaSyD_u9B6RFKlIvujMp--kt_jiIBeZIeNVyg
VITE_FIREBASE_AUTH_DOMAIN=qrloop-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=qrloop-project
VITE_FIREBASE_STORAGE_BUCKET=qrloop-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=507070415403
VITE_FIREBASE_APP_ID=1:507070415403:web:276a394bd823a118cf206e
VITE_FIREBASE_MEASUREMENT_ID=G-8TDP69XX8Y
VITE_FIREBASE_DATABASE_URL=https://qrloop-project-default-rtdb.asia-southeast1.firebasedatabase.app
```

### 2. Build Settings

Make sure your Netlify build settings are configured as:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 or later

### 3. Redeploy

After adding the environment variables, trigger a new deployment by:

1. Going to **Deploys** tab
2. Click **Trigger deploy** > **Deploy site**

Or push a new commit to trigger automatic deployment.

### 4. Verification

After deployment, check the browser console. You should see:
- `Firebase config loaded: {projectId: "qrloop-project", authDomain: "qrloop-project.firebaseapp.com", hasApiKey: true, hasAppId: true}`
- No more "Firebase configuration missing" errors

## Troubleshooting

### If Environment Variables Don't Work

1. **Check Variable Names**: Ensure all variables start with `VITE_`
2. **No Quotes**: Don't wrap values in quotes in Netlify dashboard
3. **Clear Deploy Cache**: In Netlify, go to Site Settings > Build & Deploy > Post processing > Clear cache and deploy site
4. **Check Logs**: Review the deploy logs in Netlify for any build errors

### If Firebase Still Shows Errors

The app now includes comprehensive offline support, so even if Firebase connection fails:
- QR code generation and scanning will work
- Data will be stored locally
- Analytics will be tracked offline
- All features remain functional

### Security Note

The Firebase configuration values in this file are safe to be public as they're client-side configuration. However, ensure your Firebase security rules are properly configured to protect your data.

## Firebase Security Rules

Make sure your Firestore rules allow the appropriate access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read/write to analytics collections
    match /qr_generations/{document} {
      allow read, write: if true;
    }
    
    match /qr_scans/{document} {
      allow read, write: if true;
    }
    
    match /user_activity/{document} {
      allow read, write: if true;
    }
    
    match /daily_stats/{document} {
      allow read, write: if true;
    }
    
    // Admin-only access
    match /admins/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Next Steps

1. Add environment variables to Netlify
2. Redeploy the site
3. Test the connection
4. Monitor the browser console for any remaining issues

The app is now resilient to Firebase connection issues and will work in offline mode if needed.
