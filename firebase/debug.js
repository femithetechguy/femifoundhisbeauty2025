// Firebase Debug Utility
// This file helps test Firebase connectivity

// Test Firebase connection
const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK is not loaded');
      return { success: false, error: 'Firebase SDK not loaded' };
    }
    
    console.log('Firebase SDK is loaded');
    
    // Initialize Firebase
    const app = initFirebase();
    if (!app) {
      console.error('Firebase initialization failed');
      return { success: false, error: 'Firebase initialization failed' };
    }
    
    console.log('Firebase initialized successfully');
    
    // Test Firestore
    const db = app.firestore();
    if (!db) {
      console.error('Firestore initialization failed');
      return { success: false, error: 'Firestore initialization failed' };
    }
    
    console.log('Firestore initialized successfully');
    
    // Try writing a test document
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test'
    };
    
    console.log('Attempting to write test document to Firestore');
    const docRef = await db.collection('_debug_tests').add(testDoc);
    console.log('Test document written with ID:', docRef.id);
    
    // Clean up - delete the test document
    await docRef.delete();
    console.log('Test document deleted successfully');
    
    return { success: true, message: 'Firebase connection is working correctly' };
    
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test Firebase write permission specifically for RSVPs
const testRSVPWritePermission = async () => {
  try {
    console.log('Testing RSVP write permission...');
    
    // Initialize Firebase
    const app = initFirebase();
    if (!app) {
      throw new Error('Firebase initialization failed');
    }
    
    // Get Firestore
    const db = app.firestore();
    
    // Create a test RSVP
    const testRSVP = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-1234',
      attendance: 'yes',
      guestCount: '1',
      testSubmission: true,
      submittedAt: new Date().toISOString()
    };
    
    // Try to add to the rsvps collection
    console.log('Attempting to write test RSVP to Firestore');
    const docRef = await db.collection('rsvps').add(testRSVP);
    console.log('Test RSVP written with ID:', docRef.id);
    
    // Clean up - delete the test document
    await docRef.delete();
    console.log('Test RSVP deleted successfully');
    
    return { success: true, message: 'RSVP write permission confirmed' };
    
  } catch (error) {
    console.error('RSVP write permission test failed:', error);
    return { success: false, error: error.message };
  }
};

// Add global access to debug functions
window.firebaseDebug = {
  testFirebaseConnection,
  testRSVPWritePermission
};
