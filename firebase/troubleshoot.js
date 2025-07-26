// Troubleshooting Functions for Firebase
// This file contains functions to help diagnose Firebase connection issues

// Detailed Firestore collection test - tries multiple collections
const testMultipleCollections = async () => {
  try {
    console.log('Testing multiple Firestore collections...');
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK is not loaded');
      return { success: false, error: 'Firebase SDK not loaded' };
    }
    
    // Initialize Firebase
    const app = initFirebase();
    if (!app) {
      console.error('Firebase initialization failed');
      return { success: false, error: 'Firebase initialization failed' };
    }
    
    // Get Firestore
    const db = app.firestore();
    if (!db) {
      console.error('Firestore initialization failed');
      return { success: false, error: 'Firestore initialization failed' };
    }
    
    // Create a simple test document
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Collection test'
    };
    
    // Test collections to try
    const collections = [
      'test_collection',
      'rsvps',
      'guest_messages',
      'test_data',
      'debug'
    ];
    
    const results = {};
    
    // Try each collection
    for (const collection of collections) {
      try {
        console.log(`Testing write to collection: ${collection}`);
        const docRef = await db.collection(collection).add(testDoc);
        console.log(`✅ Success writing to ${collection} with ID: ${docRef.id}`);
        
        // Try to delete the document we just created
        try {
          await docRef.delete();
          console.log(`✅ Success deleting test document from ${collection}`);
          results[collection] = { write: true, delete: true };
        } catch (deleteError) {
          console.error(`❌ Error deleting from ${collection}:`, deleteError);
          results[collection] = { write: true, delete: false, deleteError: deleteError.message };
        }
      } catch (writeError) {
        console.error(`❌ Error writing to ${collection}:`, writeError);
        results[collection] = { write: false, error: writeError.message };
      }
    }
    
    return { 
      success: Object.values(results).some(r => r.write), 
      results: results,
      message: 'Collection test completed'
    };
    
  } catch (error) {
    console.error('Collection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test the Firestore rules
const testFirestoreRules = async () => {
  try {
    console.log('Testing Firestore rules...');
    
    // Initialize Firebase
    const app = initFirebase();
    if (!app) {
      throw new Error('Firebase initialization failed');
    }
    
    // Get Firestore
    const db = app.firestore();
    
    // Try reading from rsvps collection (should fail without auth)
    console.log('Testing read from rsvps (should fail)...');
    try {
      const snapshot = await db.collection('rsvps').limit(1).get();
      console.log('❌ Read from rsvps succeeded when it should have failed');
    } catch (readError) {
      console.log('✅ Read from rsvps correctly failed:', readError.message);
    }
    
    // Try writing to rsvps collection (should succeed)
    console.log('Testing write to rsvps (should succeed)...');
    try {
      const testDoc = { test: true, timestamp: new Date().toISOString() };
      const docRef = await db.collection('rsvps').add(testDoc);
      console.log('✅ Write to rsvps succeeded with ID:', docRef.id);
      
      // Try to clean up
      try {
        await docRef.delete();
        console.log('❌ Delete from rsvps succeeded when it should have failed');
      } catch (deleteError) {
        console.log('✅ Delete from rsvps correctly failed:', deleteError.message);
      }
    } catch (writeError) {
      console.log('❌ Write to rsvps failed when it should have succeeded:', writeError.message);
    }
    
    return { success: true, message: 'Firestore rules test completed' };
    
  } catch (error) {
    console.error('Firestore rules test failed:', error);
    return { success: false, error: error.message };
  }
};

// Check Firebase configuration
const checkFirebaseConfig = () => {
  try {
    console.log('Checking Firebase configuration...');
    
    // Check if firebaseConfig is defined
    if (typeof firebaseConfig === 'undefined') {
      console.error('❌ firebaseConfig is not defined');
      return { success: false, error: 'Firebase configuration not defined' };
    }
    
    // Required fields
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!firebaseConfig[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields in firebaseConfig: ${missingFields.join(', ')}`);
      return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
    }
    
    console.log('✅ Firebase configuration appears valid');
    return { 
      success: true, 
      message: 'Firebase configuration is valid',
      config: {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain
      }
    };
    
  } catch (error) {
    console.error('Firebase config check failed:', error);
    return { success: false, error: error.message };
  }
};

// Add global access to troubleshooting functions
window.firebaseTroubleshoot = {
  testMultipleCollections,
  testFirestoreRules,
  checkFirebaseConfig
};
