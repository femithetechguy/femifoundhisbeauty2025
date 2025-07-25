// This file adds additional RSVP fixes for the website
// It needs to be included in the index.html

// Function to handle special message section visibility
function fixSpecialMessageSectionVisibility() {
    console.log('Running special message section visibility fix');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for other scripts to initialize
        setTimeout(() => {
            // Check if we're on a page with RSVP form
            const rsvpForm = document.getElementById('rsvpForm');
            if (!rsvpForm) {
                console.log('No RSVP form found on this page');
                return;
            }
            
            console.log('RSVP form found, setting up fixes');
            
            // Set up direct event handlers for attendance radio buttons
            const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
            attendanceRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'yes') {
                        console.log('Yes radio selected, forcing special message section display');
                        // Force display of all conditional elements
                        const conditionalSections = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
                        conditionalSections.forEach(section => {
                            section.style.display = 'block';
                            console.log('Forced display of section:', section.id || section.className);
                        });
                        
                        // Special handling for special message section by various selectors
                        ['special-message', 'section-special-message'].forEach(id => {
                            const section = document.getElementById(id);
                            if (section) {
                                section.style.display = 'block';
                                console.log(`Found and showed ${id}`);
                            }
                        });
                        
                        // Also try to find by content
                        document.querySelectorAll('.form-section-title').forEach(title => {
                            if (title.textContent.includes('Special Message')) {
                                const parent = title.closest('.form-section');
                                if (parent) {
                                    parent.style.display = 'block';
                                    console.log('Found special message section by title and showed it');
                                }
                            }
                        });
                    }
                });
            });
            
            // Check initial state
            const yesRadio = document.querySelector('input[name="attendance"][value="yes"]:checked');
            if (yesRadio) {
                console.log('Yes radio is already checked, triggering change event');
                yesRadio.dispatchEvent(new Event('change'));
            }
            
            console.log('RSVP fixes initialized');
        }, 500);  // Wait 500ms for other scripts to initialize
    });
}

// Run the fix
fixSpecialMessageSectionVisibility();

// Make the function available globally instead of using export
window.fixSpecialMessageSectionVisibility = fixSpecialMessageSectionVisibility;
