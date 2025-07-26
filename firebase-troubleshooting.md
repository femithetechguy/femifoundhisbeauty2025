# Firebase Troubleshooting Guide

If you're experiencing issues with the Firebase integration in your EwaFemi2025 wedding website, this guide will help you diagnose and resolve them.

## Common Issues and Solutions

### 1. "Missing or insufficient permissions" Error

This typically means there's an issue with your Firebase security rules or they're not properly deployed.

**Solution:**
- Verify that the security rules displayed in `firebase-rules-test.html` match those in your Firebase console
- If they don't match, update them in the Firebase console to match your local rules

### 2. Firebase Configuration Issues

If your Firebase configuration isn't properly set up, you'll see connection errors.

**Solution:**
- Check that `firebaseConfig` in `firebase/config.js` has the correct values
- Verify the `storageBucket` format is correct (should be `"projectid.appspot.com"`)

### 3. Network/CORS Issues

Sometimes browser security settings can cause issues with Firebase connections.

**Solution:**
- Make sure you're accessing the site via http:// or https:// (not file://)
- Try using a local server like `python3 -m http.server` to serve the site
- Check browser console for CORS errors

## Troubleshooting Tools

This project includes several tools to help diagnose Firebase issues:

1. **firebase-minimal-test.html**
   - A minimal test that checks if Firebase can connect and write data
   - Useful for isolating configuration issues

2. **firebase-rules-test.html**
   - Tests each CRUD operation against your security rules
   - Confirms that your rules are working as expected

3. **simple-rsvp-test.html**
   - A simplified version of the RSVP form
   - Helps isolate issues with the RSVP form functionality

4. **Debug Console in index.html**
   - Check for errors when submitting the RSVP form
   - Look for "Firebase connection test result" in the console

## How to Test

1. Open `firebase-minimal-test.html` in your browser
2. Click "Check SDK" to verify the Firebase SDK is loaded
3. Click "Initialize Firebase" to test configuration
4. Select "rsvps" collection and click "Test Write" to test writing to the RSVP collection
5. If successful, your Firebase rules and configuration are correct

## Deployment Check

- Make sure your Firebase rules are deployed to the Firebase project
- Run `firebase deploy --only firestore:rules` to deploy rules
- Check that the project ID in your config matches the project where rules are deployed

## Need More Help?

If you're still experiencing issues after trying these steps, check:

- Firebase console for any project-wide issues
- Billing status (if applicable)
- Network connectivity to Firebase servers

You can also try creating a new RSVP collection with a different name to see if that helps.
