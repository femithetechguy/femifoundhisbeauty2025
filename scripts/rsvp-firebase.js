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
    
    console.log('Firebase SDK version:', firebase.SDK_VERSION || 'unknown');
    console.log('Firebase app name:', firebase.app().name || 'default');
    
    // Get Firestore instance
    const db = firebase.firestore();
    if (!db) {
      console.error('Firestore initialization failed');
      throw new Error('Firebase Firestore is not available');
    }
    
    console.log('Firebase and Firestore initialized successfully');
    console.log('Project ID:', firebase.app().options.projectId);
    
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
    
    // Add to Firestore using multiple approaches to handle potential permission issues
    console.log('Attempting to add document to Firestore collection: "rsvps"');
    console.log('Document data:', JSON.stringify(data, null, 2));
    
    try {
      // Reset network connection to clear any cached permissions
      try {
        await db.disableNetwork();
        await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay
        await db.enableNetwork();
        console.log('Network connection reset');
      } catch (networkErr) {
        console.warn('Could not reset network:', networkErr);
      }
      
      // First attempt: standard add()
      let result;
      try {
        result = await db.collection('rsvps').add(data);
        console.log('RSVP submitted successfully with ID:', result.id);
        return { success: true, id: result.id };
      } catch (addError) {
        console.warn('Standard add() failed, trying alternative method:', addError.message);
        
        // Second attempt: set() with auto-generated ID
        try {
          const docRef = db.collection('rsvps').doc();
          await docRef.set(data);
          console.log('RSVP submitted successfully with ID (using set):', docRef.id);
          return { success: true, id: docRef.id };
        } catch (setError) {
          // All Firebase attempts failed, fall back to email service
          console.error('All Firebase write attempts failed:', setError);
          
          // Try a test write to see if it's a general Firebase issue
          try {
            const testDoc = await db.collection('_debug').add({
              test: true,
              timestamp: new Date().toISOString(),
              error: setError.message
            });
            console.log('Debug write succeeded, ID:', testDoc.id);
            
            // Specific issue with rsvps collection
            return { success: false, error: 'Permission issue with RSVP collection' };
          } catch (debugError) {
            // General Firebase issue
            console.error('Debug write also failed:', debugError);
            
            // If we have a backup submission option, we would use it here
            // For now, return clear error
            return { 
              success: false, 
              error: 'Could not connect to database. Please try again or contact the site administrator.' 
            };
          }
        }
      }
    } catch (error) {
      console.error('Error during RSVP submission process:', error);
      return { success: false, error: error.message };
    }
    
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
    // Form not found - might be on a different page, silently exit
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
      console.log('Form submitted, preparing to send to Firebase...');
      
      // First test Firebase connectivity
      console.log('Testing Firebase connectivity before submission...');
      
      // Initialize Firebase if needed
      const firebase = initFirebase();
      if (!firebase) {
        throw new Error('Firebase initialization failed');
      }
      
      // Submit to Firebase
      console.log('Firebase initialized successfully, submitting RSVP...');
      const result = await submitRSVPToFirebase(formData);
      
      if (result.success) {
        console.log('RSVP submitted successfully with ID:', result.id);
        // Show confirmation message
        form.closest('.card-custom').style.display = 'none';
        document.getElementById('confirmationMessage').style.display = 'block';
      } else {
        console.error('RSVP submission failed with error:', result.error);
        alert(`There was an error submitting your RSVP: ${result.error}. Please try again.`);
      }
    } catch (error) {
      console.error('Error during RSVP submission:', error);
      alert(`Submission error: ${error.message}. Please check your connection and try again.`);
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // Handle the conditional sections
  setupConditionalFields();
  
  // RSVP form initialized (no console logging)
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

// Initialize when the document is loaded - no debug output
document.addEventListener('DOMContentLoaded', function() {
  // Function to check Firebase and initialize when ready
  const checkFirebaseAndInit = () => {
    if (typeof firebase !== 'undefined' && typeof initFirebase === 'function') {
      // Initialize silently
      initializeFirebaseRSVP();
    } else {
      // Try again shortly, no logs
      setTimeout(checkFirebaseAndInit, 100);
    }
  };
  
  // Start checking for Firebase
  checkFirebaseAndInit();
});
