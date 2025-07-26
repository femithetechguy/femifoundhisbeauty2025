// Firebase Admin Dashboard
// This file handles admin authentication and RSVP data retrieval

// Initialize Firebase from config
const initAdmin = () => {
  try {
    // Initialize Firebase if not already initialized
    const firebase = initFirebase();
    console.log('Firebase initialized');
    
    // Set up login form first
    setupLoginForm();
    
    // Then check if the user is already logged in
    firebase.auth().onAuthStateChanged(handleAuthStateChange);
    
    console.log('Admin dashboard initialized');
  } catch (error) {
    console.error('Error initializing admin dashboard:', error);
    showError('Failed to initialize admin dashboard. Please try again later.');
  }
};

// Handle authentication state changes
const handleAuthStateChange = (user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'No user');
  
  const loginContainer = document.getElementById('admin-login-container');
  const dashboardContainer = document.getElementById('admin-dashboard-container');
  
  if (!loginContainer || !dashboardContainer) {
    console.error('Login or dashboard container not found');
    return; // Exit if the containers aren't found
  }
  
  if (user) {
    // Check if user is an admin
    const email = user.email;
    console.log('User email:', email);
    
    // This should match the email(s) in the Firebase rules
    if (email === 'ewafemi@gmail.com') {
      console.log('Admin user authenticated');
      
      // User is authenticated and is an admin
      loginContainer.style.display = 'none';
      dashboardContainer.style.display = 'block';
      
      // Set up logout button
      const logoutButton = document.getElementById('admin-logout-button');
      if (logoutButton) {
        // Remove any existing listeners to prevent duplicates
        const newLogoutButton = logoutButton.cloneNode(true);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        
        // Display the logout button
        newLogoutButton.style.display = 'inline-block';
        
        // Set up the new event listener
        newLogoutButton.addEventListener('click', () => {
          firebase.auth().signOut()
            .then(() => {
              console.log('User signed out');
            })
            .catch((error) => {
              console.error('Sign out error:', error);
            });
        });
      }
      
      // Show admin email in header
      const emailDisplay = document.getElementById('admin-email-display');
      if (emailDisplay) {
        emailDisplay.textContent = email;
      }
      
      // Load RSVP data
      loadRSVPData();
      
    } else {
      // User is not an admin
      console.log('Non-admin user detected, signing out');
      signOutNonAdmin();
    }
  } else {
    // User is not authenticated
    console.log('No user authenticated, showing login form');
    loginContainer.style.display = 'block';
    dashboardContainer.style.display = 'none';
    
    // Clear any email display
    const emailDisplay = document.getElementById('admin-email-display');
    if (emailDisplay) {
      emailDisplay.textContent = '';
    }
    
    // Hide logout button
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
      logoutButton.style.display = 'none';
    }
  }
};

// Sign out non-admin users
const signOutNonAdmin = () => {
  firebase.auth().signOut()
    .then(() => {
      console.log('Non-admin user signed out');
      showError('You do not have permission to access the admin dashboard.');
    })
    .catch((error) => {
      console.error('Sign out error:', error);
    });
};

// Setup login form
const setupLoginForm = () => {
  const loginForm = document.getElementById('admin-login-form');
  
  if (!loginForm) {
    console.error('Login form not found');
    return;
  }
  
  console.log('Setting up login form');
  
  // Remove any existing event listeners by cloning
  const newLoginForm = loginForm.cloneNode(true);
  loginForm.parentNode.replaceChild(newLoginForm, loginForm);
  
  // Add the submit event listener to the new form
  newLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Login form submitted');
    
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const errorMessage = document.getElementById('admin-login-error');
    
    if (!emailInput || !passwordInput) {
      console.error('Email or password input not found');
      return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate inputs
    if (!email || !password) {
      if (errorMessage) {
        errorMessage.textContent = 'Please enter both email and password';
      }
      return;
    }
    
    // Clear previous error and show loading state
    if (errorMessage) {
      errorMessage.textContent = '';
    }
    
    const submitBtn = newLoginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
      submitBtn.disabled = true;
    }
    
    // Authenticate with Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential.user.email);
      })
      .catch((error) => {
        console.error('Login error:', error);
        if (errorMessage) {
          errorMessage.textContent = error.message || 'Failed to login. Please try again.';
        }
        
        // Reset button state
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      });
  });
  
  console.log('Login form setup complete');
};

// Load RSVP data from Firestore
const loadRSVPData = async () => {
  try {
    const db = getFirestore();
    const rsvpsRef = db.collection('rsvps');
    const snapshot = await rsvpsRef.orderBy('submittedAt', 'desc').get();
    
    // Clear the loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
    // Check if we have any RSVPs
    if (snapshot.empty) {
      document.getElementById('rsvp-table-container').innerHTML = '<p>No RSVPs submitted yet.</p>';
      return;
    }
    
    // Process the data
    const rsvpData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      rsvpData.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date()
      });
    });
    
    // Display the data
    displayRSVPData(rsvpData);
    
  } catch (error) {
    console.error('Error loading RSVP data:', error);
    showError('Failed to load RSVP data. Please try again later.');
  }
};

// Display RSVP data in the table
const displayRSVPData = (data) => {
  const tableContainer = document.getElementById('rsvp-table-container');
  
  if (!tableContainer) {
    console.error('Table container not found');
    return;
  }
  
  // Count RSVPs by attendance
  const stats = calculateRSVPStats(data);
  
  // Create stats display
  const statsHtml = `
    <div class="stats-container mb-4">
      <h4>RSVP Summary</h4>
      <div class="row">
        <div class="col-md-3">
          <div class="card text-center p-3 bg-light">
            <h5>Total RSVPs</h5>
            <h3>${stats.total}</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center p-3 bg-success text-white">
            <h5>Attending</h5>
            <h3>${stats.attending}</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center p-3 bg-secondary text-white">
            <h5>Not Attending</h5>
            <h3>${stats.notAttending}</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center p-3 bg-info text-white">
            <h5>Total Guests</h5>
            <h3>${stats.totalGuests}</h3>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Create the table HTML
  let tableHtml = `
    <div class="table-responsive">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Attending</th>
            <th>Guests</th>
            <th>Dietary Restrictions</th>
            <th>Message</th>
            <th>Date Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add each RSVP as a row
  data.forEach(rsvp => {
    const formattedDate = new Date(rsvp.submittedAt).toLocaleString();
    const attending = rsvp.attendance === 'yes';
    const attendanceClass = attending ? 'text-success' : 'text-danger';
    const attendanceIcon = attending ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
    
    tableHtml += `
      <tr data-rsvp-id="${rsvp.id}">
        <td>${rsvp.name}</td>
        <td><a href="mailto:${rsvp.email}">${rsvp.email}</a></td>
        <td><a href="tel:${rsvp.phone}">${rsvp.phone}</a></td>
        <td class="${attendanceClass}"><i class="bi ${attendanceIcon}"></i> ${attending ? 'Yes' : 'No'}</td>
        <td>${attending ? (rsvp.guestCount || '1') : '-'}</td>
        <td>${attending && rsvp.dietaryRestrictions ? rsvp.dietaryRestrictions : '-'}</td>
        <td>${rsvp.specialMessage ? `<button class="btn btn-sm btn-outline-primary view-message-btn" data-message="${escapeHtml(rsvp.specialMessage)}">View Message</button>` : '-'}</td>
        <td>${formattedDate}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-rsvp-btn" data-rsvp-id="${rsvp.id}">Delete</button>
        </td>
      </tr>
    `;
  });
  
  tableHtml += `
        </tbody>
      </table>
    </div>
  `;
  
  // Combine stats and table
  tableContainer.innerHTML = statsHtml + tableHtml;
  
  // Set up event handlers
  setupViewMessageButtons();
  setupDeleteButtons();
  setupExportButton(data);
};

// Calculate RSVP statistics
const calculateRSVPStats = (data) => {
  const stats = {
    total: data.length,
    attending: 0,
    notAttending: 0,
    totalGuests: 0
  };
  
  data.forEach(rsvp => {
    if (rsvp.attendance === 'yes') {
      stats.attending++;
      // Add guests count (convert to number)
      const guestCount = parseInt(rsvp.guestCount || '1', 10);
      stats.totalGuests += guestCount;
    } else {
      stats.notAttending++;
    }
  });
  
  return stats;
};

// Setup view message buttons
const setupViewMessageButtons = () => {
  const viewButtons = document.querySelectorAll('.view-message-btn');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const message = button.getAttribute('data-message');
      
      // Show message in a modal
      const modalBody = document.getElementById('message-modal-body');
      if (modalBody) {
        modalBody.textContent = message;
      }
      
      // Show the modal using Bootstrap
      const messageModal = new bootstrap.Modal(document.getElementById('message-modal'));
      messageModal.show();
    });
  });
};

// Setup delete buttons
const setupDeleteButtons = () => {
  const deleteButtons = document.querySelectorAll('.delete-rsvp-btn');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this RSVP?')) {
        const rsvpId = button.getAttribute('data-rsvp-id');
        
        try {
          const db = getFirestore();
          await db.collection('rsvps').doc(rsvpId).delete();
          
          // Remove the row from the table
          const row = button.closest('tr');
          if (row) {
            row.remove();
          }
          
          // Show success message
          alert('RSVP deleted successfully');
          
          // Reload data to update stats
          loadRSVPData();
        } catch (error) {
          console.error('Error deleting RSVP:', error);
          alert('Failed to delete RSVP. Please try again.');
        }
      }
    });
  });
};

// Setup export button
const setupExportButton = (data) => {
  const exportButton = document.getElementById('export-rsvps-btn');
  
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      // Convert data to CSV
      const csvContent = convertToCSV(data);
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set link properties
      link.setAttribute('href', url);
      link.setAttribute('download', `wedding_rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.display = 'none';
      
      // Add to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};

// Convert data to CSV
const convertToCSV = (data) => {
  const headers = ['Name', 'Email', 'Phone', 'Attending', 'Guest Count', 'Dietary Restrictions', 'Special Message', 'Date Submitted'];
  
  // Create header row
  let csv = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(rsvp => {
    const row = [
      `"${rsvp.name.replace(/"/g, '""')}"`,
      `"${rsvp.email.replace(/"/g, '""')}"`,
      `"${rsvp.phone.replace(/"/g, '""')}"`,
      rsvp.attendance === 'yes' ? 'Yes' : 'No',
      rsvp.attendance === 'yes' ? (rsvp.guestCount || '1') : '',
      `"${(rsvp.dietaryRestrictions || '').replace(/"/g, '""')}"`,
      `"${(rsvp.specialMessage || '').replace(/"/g, '""')}"`,
      `"${new Date(rsvp.submittedAt).toLocaleString()}"`
    ];
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

// Helper function to escape HTML for safe insertion
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Show error message
const showError = (message) => {
  const errorContainer = document.getElementById('admin-error-container');
  
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  } else {
    alert(message);
  }
};

// Export admin functions
window.admin = {
  initAdmin,
  loadRSVPData
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking for admin page');
  
  // Check if we're on the admin page
  if (window.location.pathname.includes('/admin')) {
    console.log('On admin page, initializing...');
    
    // Make sure Firebase is loaded
    const checkFirebase = () => {
      console.log('Checking for Firebase...');
      
      if (typeof firebase !== 'undefined' && typeof initFirebase === 'function') {
        console.log('Firebase found, initializing admin');
        initAdmin();
      } else {
        console.log('Firebase not loaded yet, waiting...');
        
        // Check again in a short while
        setTimeout(checkFirebase, 100);
      }
    };
    
    // Start checking for Firebase
    checkFirebase();
  }
});

// Add a fallback initialization
window.initializeAdminManually = () => {
  console.log('Manual admin initialization');
  if (typeof firebase !== 'undefined' && typeof initFirebase === 'function') {
    initAdmin();
  } else {
    showError('Firebase is not available. Please check that all scripts are loaded properly.');
  }
};
