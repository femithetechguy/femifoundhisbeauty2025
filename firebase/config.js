// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPtGvYZypjk-gqpp3dVzL-hRFL749QO8A",
  authDomain: "femifoundhisbeauty2025.firebaseapp.com",
  projectId: "femifoundhisbeauty2025",
  storageBucket: "femifoundhisbeauty2025.appspot.com", // Fixed storage bucket URL format
  messagingSenderId: "1092404402928",
  appId: "1:1092404402928:web:cf2feb962c904dfd5f8035",
  measurementId: "G-WF972QVXHD"
};

// Initialize Firebase
const initFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      // Initialize Firebase (no logging)
      firebase.initializeApp(firebaseConfig);
      
      // Enable offline persistence to make the app more resilient
      firebase.firestore().enablePersistence({synchronizeTabs: true})
        .catch(err => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            // Silent failure - no need to warn users
          } else if (err.code === 'unimplemented') {
            // The current browser does not support persistence
            // Silent failure - no need to warn users
          }
        });
      
      // Firebase initialized successfully (no logging)
    } else {
      // Firebase already initialized (no logging)
    }
    return firebase;
  } catch (error) {
    // Only log in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.error('Error initializing Firebase:', error);
    }
    return null;
  }
};

// Initialize Firestore
const getFirestore = () => {
  try {
    const firebaseApp = initFirebase();
    if (!firebaseApp) return null;
    return firebaseApp.firestore();
  } catch (error) {
    // Only log in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.error('Error getting Firestore:', error);
    }
    return null;
  }
};

// Make functions accessible globally
window.firebaseUtils = {
  initFirebase,
  getFirestore
};