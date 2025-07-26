// Initialize Dynamic RSVP Component
// This script initializes the RSVP form in the same way as gallery.html,
// ensuring consistent behavior across the website

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure all required scripts are loaded
    setTimeout(function() {
        // Initialize the dynamic RSVP content
        initializeDynamicRSVP();
    }, 500);
});

// Function to initialize the dynamic RSVP content - same as in gallery.html
function initializeDynamicRSVP() {
    console.log('Initializing dynamic RSVP container on index.html');
    const dynamicRsvpContainer = document.getElementById('dynamic-rsvp-container');
    if (!dynamicRsvpContainer) {
        console.error('Dynamic RSVP container not found');
        return;
    }
    
    // Check if we have the necessary functions and data
    if (typeof createRSVPContent !== 'function') {
        console.error('createRSVPContent function not found. Make sure sections.js is loaded properly.');
        return;
    }
    
    if (!window.rsvpData || Object.keys(window.rsvpData).length === 0) {
        console.error('RSVP data not loaded. Make sure data.js is loaded properly and rsvp.json exists.');
        return;
    }
    
    // Create the RSVP content using the same function as gallery.html
    const rsvpHTML = createRSVPContent(window.rsvpData);
    dynamicRsvpContainer.innerHTML = rsvpHTML;
    
    // Initialize RSVP functionality
    document.dispatchEvent(new CustomEvent('contentLoaded'));
    console.log('Dynamic RSVP content loaded successfully on index.html');
    
    // Register functions for conditional sections - same as in gallery.html
    window.showAttendanceDetails = function() {
        const conditionalSections = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
        conditionalSections.forEach(section => {
            section.style.display = 'block';
        });
    };
    
    window.hideAttendanceDetails = function() {
        const conditionalSections = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
        conditionalSections.forEach(section => {
            section.style.display = 'none';
        });
    };
    
    // Set up event listeners for attendance radio buttons
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Yes, I\'ll be there') {
                window.showAttendanceDetails();
            } else {
                window.hideAttendanceDetails();
            }
        });
    });
    
    // Check if yes is already selected
    const checkedYesRadio = document.querySelector('input[name="attendance"][value="Yes, I\'ll be there"]:checked');
    if (checkedYesRadio) {
        window.showAttendanceDetails();
    } else {
        window.hideAttendanceDetails();
    }
}
