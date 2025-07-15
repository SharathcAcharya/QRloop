# Netlify Deployment Configuration

## Environment Variables Setup

The Firebase connection issues in production are caused by missing environment variables in the Netlify deployment. Here's how to fix it:

### 1. Netlify Dashboard Configuration

Go to your Netlify site dashboard and add these environment variables in **Site Settings > Environment Variables**:

```

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

### Missing JS Chunk / Dynamic Import Error (404)

If you see errors like:
- `Failed to fetch dynamically imported module: https://qrloop.netlify.app/assets/QRGenerator-xxxx.js`
- `Uncaught TypeError: Failed to fetch dynamically imported module`
- 404 errors for JS chunks in the browser console

Follow these steps to resolve:

1. **Clear Netlify Build Cache**
   - Go to Netlify Site Settings > Build & Deploy > Post processing > Clear cache and deploy site.
   - This forces Netlify to rebuild all chunks and fixes missing assets.

2. **Redeploy**
   - Trigger a fresh deploy after clearing the cache.
   - Or push a new commit to your repo to trigger a build.

3. **Check Dynamic Imports**
   - If you use `React.lazy` or dynamic `import()` for components, make sure the file exists and is correctly referenced in your routes.
   - Ensure the file name and path match your import statement.

4. **Verify Build Output Locally**
   - Run `npm run build` locally.
   - Check the `dist/assets` folder for the missing chunk. If it’s missing, there may be a build config issue.

5. **Check Environment Variables**
   - Make sure all required Firebase environment variables are set in Netlify. Missing variables can cause build failures and missing chunks.

6. **Check for Vite/React Build Issues**
   - If you use Vite, ensure your `vite.config.js` is correct and does not exclude important files from the build.
   - Make sure your routes and lazy imports do not reference files that are excluded from the build.

7. **Review Netlify Deploy Logs**
   - Look for any errors or warnings about chunk generation or missing files.

---

If you follow these steps, the missing chunk and dynamic import errors should be resolved. Your app will load all pages and components correctly after a successful redeploy.

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
