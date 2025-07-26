// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPtGvYZypjk-gqpp3dVzL-hRFL749QO8A",
  authDomain: "femifoundhisbeauty2025.firebaseapp.com",
  projectId: "femifoundhisbeauty2025",
  storageBucket: "femifoundhisbeauty2025.firebasestorage.app",
  messagingSenderId: "1092404402928",
  appId: "1:1092404402928:web:cf2feb962c904dfd5f8035",
  measurementId: "G-WF972QVXHD"
};

// Initialize Firebase
const initFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      console.log('Initializing Firebase with config');
      firebase.initializeApp(firebaseConfig);
    } else {
      console.log('Firebase already initialized');
    }
    return firebase;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
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
    console.error('Error getting Firestore:', error);
    return null;
  }
};

// Make functions accessible globally
window.firebaseUtils = {
  initFirebase,
  getFirestore
};