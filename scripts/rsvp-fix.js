// Direct fix for RSVP form conditional sections

document.addEventListener('DOMContentLoaded', function() {
    console.log('RSVP Fix script loaded');
    
    // Apply the fix once the form is loaded
    applyRsvpFormFix();
    
    // Also try again after a short delay to ensure all elements are loaded
    setTimeout(applyRsvpFormFix, 500);
});

function applyRsvpFormFix() {
    console.log('Applying RSVP form fix');
    
    // Find the attendance radio buttons
    const yesRadio = document.getElementById('attendanceYes');
    const noRadio = document.getElementById('attendanceNo');
    
    if (!yesRadio || !noRadio) {
        console.log('Radio buttons not found yet, trying alternative selectors');
        // Try alternative selectors
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        console.log(`Found ${attendanceRadios.length} attendance radio buttons`);
        
        // Apply direct click handlers
        attendanceRadios.forEach(radio => {
            console.log('Setting up radio:', radio.id, radio.value);
            
            // Replace existing event handler with a direct one
            const newRadio = radio.cloneNode(true);
            radio.parentNode.replaceChild(newRadio, radio);
            
            newRadio.addEventListener('click', function(event) {
                console.log('Radio clicked:', this.id, this.value);
                
                // Show/hide conditional sections directly based on value
                if (this.value.toLowerCase() === 'yes') {
                    showConditionalSections();
                } else {
                    hideConditionalSections();
                }
            });
        });
        
        // Check if any "yes" radio is already selected
        const selectedYesRadio = Array.from(attendanceRadios)
            .find(radio => radio.checked && radio.value.toLowerCase() === 'yes');
        
        if (selectedYesRadio) {
            console.log('Yes radio already selected, showing conditional sections');
            showConditionalSections();
        } else {
            hideConditionalSections();
        }
    }
}

function showConditionalSections() {
    console.log('Showing conditional sections');
    
    // Directly target all the sections we need to show
    const sectionsToShow = [
        document.getElementById('special-message'),
        document.getElementById('guestCount')?.closest('.form-section') || document.querySelector('.mb-3:has(#guestCount)'),
        document.getElementById('dietaryRestrictions')?.closest('.form-section') || document.querySelector('.mb-3:has(#dietaryRestrictions)')
    ];
    
    // Also try data-attribute based selectors
    document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]').forEach(el => {
        sectionsToShow.push(el);
    });
    
    // Show each section
    sectionsToShow.forEach(section => {
        if (section) {
            section.style.display = 'block';
            console.log('Showed section:', section.id || section.className);
        }
    });
    
    // Make required fields actually required
    document.querySelectorAll('[data-required-for="attendance"]').forEach(field => {
        if (field) {
            field.required = true;
            console.log('Made field required:', field.id);
        }
    });
}

function hideConditionalSections() {
    console.log('Hiding conditional sections');
    
    // Directly target all the sections we need to hide
    const sectionsToHide = [
        document.getElementById('special-message'),
        document.getElementById('guestCount')?.closest('.form-section') || document.querySelector('.mb-3:has(#guestCount)'),
        document.getElementById('dietaryRestrictions')?.closest('.form-section') || document.querySelector('.mb-3:has(#dietaryRestrictions)')
    ];
    
    // Also try data-attribute based selectors
    document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]').forEach(el => {
        sectionsToHide.push(el);
    });
    
    // Hide each section
    sectionsToHide.forEach(section => {
        if (section) {
            section.style.display = 'none';
            console.log('Hid section:', section.id || section.className);
        }
    });
    
    // Make required fields not required when hidden
    document.querySelectorAll('[data-required-for="attendance"]').forEach(field => {
        if (field) {
            field.required = false;
            console.log('Made field not required:', field.id);
        }
    });
}
