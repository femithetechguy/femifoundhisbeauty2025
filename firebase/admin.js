// Firebase Admin Panel
// This script is for the admin panel to view submitted form data

// Check if user is authenticated
function checkAuth() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    // Redirect to login if not authenticated
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Load and display RSVP submissions
async function loadRsvpSubmissions() {
  if (!checkAuth()) return;
  
  try {
    const db = getFirestore();
    const rsvpSnapshot = await db.collection('rsvps')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
      
    const rsvpList = document.getElementById('rsvp-list');
    if (!rsvpList) return;
    
    if (rsvpSnapshot.empty) {
      rsvpList.innerHTML = '<tr><td colspan="6" class="text-center">No RSVP submissions yet</td></tr>';
      return;
    }
    
    let html = '';
    rsvpSnapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A';
      
      html += `
        <tr>
          <td>${data.name || 'N/A'}</td>
          <td>${data.email || 'N/A'}</td>
          <td>${data.phone || 'N/A'}</td>
          <td>${data.attending ? 'Yes' : 'No'}</td>
          <td>${data.guestCount || '0'}</td>
          <td>${date}</td>
          <td>
            <button class="btn btn-sm btn-info view-details" data-id="${doc.id}">View Details</button>
          </td>
        </tr>
      `;
    });
    
    rsvpList.innerHTML = html;
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
      button.addEventListener('click', async function() {
        const id = this.getAttribute('data-id');
        const doc = await db.collection('rsvps').doc(id).get();
        if (doc.exists) {
          showDetailsModal(doc.data());
        }
      });
    });
  } catch (error) {
    console.error('Error loading RSVP submissions:', error);
    alert('Error loading RSVP submissions. Please try again.');
  }
}

// Guest message submissions functionality has been removed

// Load and display contact form submissions
async function loadContactSubmissions() {
  if (!checkAuth()) return;
  
  try {
    const db = getFirestore();
    const contactSnapshot = await db.collection('contacts')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
      
    const contactList = document.getElementById('contact-list');
    if (!contactList) return;
    
    if (contactSnapshot.empty) {
      contactList.innerHTML = '<tr><td colspan="5" class="text-center">No contact form submissions yet</td></tr>';
      return;
    }
    
    let html = '';
    contactSnapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A';
      const shortMessage = data.message ? (data.message.length > 50 ? data.message.substring(0, 50) + '...' : data.message) : 'N/A';
      
      html += `
        <tr>
          <td>${data.name || 'N/A'}</td>
          <td>${data.email || 'N/A'}</td>
          <td>${data.subject || 'N/A'}</td>
          <td>${shortMessage}</td>
          <td>${date}</td>
          <td>
            <button class="btn btn-sm btn-info view-contact" data-id="${doc.id}">View Full Message</button>
          </td>
        </tr>
      `;
    });
    
    contactList.innerHTML = html;
    
    // Add event listeners to view contact buttons
    document.querySelectorAll('.view-contact').forEach(button => {
      button.addEventListener('click', async function() {
        const id = this.getAttribute('data-id');
        const doc = await db.collection('contacts').doc(id).get();
        if (doc.exists) {
          showContactModal(doc.data());
        }
      });
    });
  } catch (error) {
    console.error('Error loading contact form submissions:', error);
    alert('Error loading contact form submissions. Please try again.');
  }
}

// Show details modal for RSVP
function showDetailsModal(data) {
  const modal = document.getElementById('details-modal');
  if (!modal) return;
  
  const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A';
  
  const modalContent = `
    <div class="modal-header">
      <h5 class="modal-title">RSVP Details</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Name:</div>
        <div class="col-md-8">${data.name || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Email:</div>
        <div class="col-md-8">${data.email || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Phone:</div>
        <div class="col-md-8">${data.phone || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Attending:</div>
        <div class="col-md-8">${data.attending ? 'Yes' : 'No'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Guest Count:</div>
        <div class="col-md-8">${data.guestCount || '0'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Dietary Restrictions:</div>
        <div class="col-md-8">${data.dietaryRestrictions || 'None'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Special Message:</div>
        <div class="col-md-8">${data.specialMessage || 'None'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Submitted On:</div>
        <div class="col-md-8">${date}</div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  `;
  
  modal.querySelector('.modal-content').innerHTML = modalContent;
  
  // Show the modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Guest message modal functionality has been removed

// Show contact modal for contact forms
function showContactModal(data) {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  
  const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A';
  
  const modalContent = `
    <div class="modal-header">
      <h5 class="modal-title">Contact Form Submission</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Name:</div>
        <div class="col-md-8">${data.name || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Email:</div>
        <div class="col-md-8">${data.email || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Subject:</div>
        <div class="col-md-8">${data.subject || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Message:</div>
        <div class="col-md-8">${data.message || 'N/A'}</div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4 fw-bold">Submitted On:</div>
        <div class="col-md-8">${date}</div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  `;
  
  modal.querySelector('.modal-content').innerHTML = modalContent;
  
  // Show the modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  checkAuth();
  
  // Load submissions based on active tab
  const activeTab = document.querySelector('.nav-link.active');
  if (activeTab) {
    const tabId = activeTab.getAttribute('id');
    if (tabId === 'rsvp-tab') {
      loadRsvpSubmissions();
    } else if (tabId === 'contact-tab') {
      loadContactSubmissions();
    }
  }
  
  // Add tab change event listeners
  document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(event) {
      const targetTab = event.target.getAttribute('id');
      if (targetTab === 'rsvp-tab') {
        loadRsvpSubmissions();
      } else if (targetTab === 'contact-tab') {
        loadContactSubmissions();
      }
    });
  });
  
  // Add sign out event listener
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async function() {
      await signOut();
      window.location.href = 'admin-login.html';
    });
  }
});

// Export functions
window.loadRsvpSubmissions = loadRsvpSubmissions;
window.loadContactSubmissions = loadContactSubmissions;
