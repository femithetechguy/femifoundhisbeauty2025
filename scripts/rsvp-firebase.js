// rsvp-firebase.js
// This file handles RSVP form submissions to Firebase Firestore

// Fixed Firebase utilities access
// We need to access these functions directly as they're defined in the global scope
// in config.js, not as properties of firebase.config

// Function to handle RSVP submission to Firebase
const submitRSVPToFirebase = async (formData) => {
  try {
    console.log('Starting RSVP submission to Firebase');
    
    // Initialize Firebase and get Firestore
    const firebase = initFirebase();
    if (!firebase) {
      console.error('Firebase initialization failed');
      throw new Error('Firebase is not available');
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    if (!db) {
      console.error('Firestore initialization failed');
      throw new Error('Firebase Firestore is not available');
    }
    
    console.log('Firebase and Firestore initialized successfully');
    
    // Create a timestamp for the submission
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
    // Extract form data
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      attendance: formData.get('attendance'),
      submittedAt: timestamp,
      clientTimestamp: new Date().toISOString() // Backup client timestamp
    };
    
    console.log('Form data extracted:', { 
      name: data.name, 
      email: data.email, 
      attendance: data.attendance 
    });
    
    // Add conditional fields based on attendance
    if (data.attendance === 'yes') {
      data.guestCount = formData.get('guestCount');
      data.dietaryRestrictions = formData.get('dietaryRestrictions') || '';
      data.specialMessage = formData.get('specialMessage') || '';
      console.log('Added conditional fields for attending guest');
    }
    
    // Add to Firestore
    console.log('Attempting to add document to Firestore');
    const result = await db.collection('rsvps').add(data);
    console.log('RSVP submitted successfully with ID:', result.id);
    return { success: true, id: result.id };
    
  } catch (error) {
    console.error('Error submitting RSVP to Firebase:', error);
    return { success: false, error: error.message };
  }
};

// Function to initialize RSVP form with Firebase
const initializeFirebaseRSVP = () => {
  // Get the form
  const form = document.getElementById('simpleRsvpForm');
  
  if (!form) {
    console.error('RSVP form not found');
    return;
  }
  
  // Add submit event handler
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Update button state
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
      // Submit to Firebase
      const result = await submitRSVPToFirebase(formData);
      
      if (result.success) {
        // Show confirmation message
        form.closest('.card-custom').style.display = 'none';
        document.getElementById('confirmationMessage').style.display = 'block';
      } else {
        alert('There was an error submitting your RSVP. Please try again.');
        console.error('RSVP submission error:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your RSVP. Please check your connection and try again.');
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // Handle the conditional sections
  setupConditionalFields();
  
  console.log('Firebase RSVP script initialized');
};

// Function to setup conditional fields based on attendance selection
const setupConditionalFields = () => {
  const yesRadio = document.getElementById('yesRadio');
  const noRadio = document.getElementById('noRadio');
  const conditionalSections = document.getElementById('conditional-sections');
  
  if (yesRadio && noRadio && conditionalSections) {
    yesRadio.addEventListener('change', function() {
      console.log('Yes radio selected');
      conditionalSections.style.display = 'block';
      
      // Make guest count required when attendance is yes
      const guestCount = document.getElementById('guestCount');
      if (guestCount) {
        guestCount.required = true;
      }
    });
    
    noRadio.addEventListener('change', function() {
      console.log('No radio selected');
      conditionalSections.style.display = 'none';
      
      // Remove required attribute when attendance is no
      const guestCount = document.getElementById('guestCount');
      if (guestCount) {
        guestCount.required = false;
      }
    });
  }
};

// Export functions for external use
window.rsvpFirebase = {
  submitRSVPToFirebase,
  initializeFirebaseRSVP
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking for Firebase availability for RSVP form');
  
  // Function to check Firebase and initialize when ready
  const checkFirebaseAndInit = () => {
    if (typeof firebase !== 'undefined' && typeof initFirebase === 'function') {
      console.log('Firebase found, initializing RSVP form');
      initializeFirebaseRSVP();
    } else {
      console.log('Firebase or initFirebase not loaded yet, waiting...');
      // Try again shortly
      setTimeout(checkFirebaseAndInit, 100);
    }
  };
  
  // Start checking for Firebase
  checkFirebaseAndInit();
});
