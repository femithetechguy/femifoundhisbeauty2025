// Direct no-frills fix for the RSVP form showing/hiding conditional sections
document.addEventListener('DOMContentLoaded', function() {
    console.log('DIRECT FIX: Script loaded');
    
    // Apply immediately and also after a short delay to ensure DOM is ready
    applyDirectFix();
    setTimeout(applyDirectFix, 500);
    setTimeout(applyDirectFix, 1000);
});

function applyDirectFix() {
    console.log('DIRECT FIX: Applying fix');
    
    // Find the yes/no radio buttons by any means necessary
    const yesRadios = [
        document.getElementById('attendanceYes'),
        document.querySelector('input[name="attendance"][value="yes"]'),
        document.querySelector('input[value="yes"]'),
        ...Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => 
            r.id.toLowerCase().includes('yes') || 
            (r.value && r.value.toLowerCase() === 'yes')
        )
    ].filter(Boolean); // Remove null values
    
    console.log(`DIRECT FIX: Found ${yesRadios.length} possible "yes" radio buttons`);
    
    // Find the sections that need to be shown/hidden - ULTRA AGGRESSIVE APPROACH
    const conditionalSections = [
        document.getElementById('special-message'),
        document.getElementById('guestCount')?.closest('.form-section') || document.querySelector('div:has(#guestCount)'),
        document.getElementById('dietaryRestrictions')?.closest('.form-section') || document.querySelector('div:has(#dietaryRestrictions)'),
        ...Array.from(document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]')),
        ...Array.from(document.querySelectorAll('.form-section')).filter(s => 
            s.id.includes('special-message') || 
            s.querySelector('.form-section-title')?.textContent.includes('Special Message')
        ),
        // Ultra-aggressive: grab by potential positions in the form
        ...Array.from(document.querySelectorAll('.form-section')).slice(2), // Get all sections from the 3rd one onwards
        // Find by content
        ...Array.from(document.querySelectorAll('div')).filter(div => 
            div.textContent.includes('Special Message') || 
            div.textContent.includes('Guest') || 
            div.textContent.includes('Dietary')
        ),
        // Find selects and textareas and show their parent containers
        ...Array.from(document.querySelectorAll('select, textarea')).map(el => el.closest('.form-section') || el.closest('.mb-3'))
    ].filter(Boolean); // Remove null values
    
    console.log(`DIRECT FIX: Found ${conditionalSections.length} conditional sections`);
    
    // Check if a "yes" radio is checked and show/hide sections accordingly
    let yesIsSelected = false;
    yesRadios.forEach(radio => {
        if (radio && radio.checked) {
            yesIsSelected = true;
            console.log('DIRECT FIX: "Yes" radio is checked:', radio.id);
        }
        
        // Add our own direct event handlers that bypass all other code
        radio.addEventListener('click', function() {
            console.log('DIRECT FIX: Radio clicked directly:', this.id);
            if (this.value.toLowerCase() === 'yes' || this.id.toLowerCase().includes('yes')) {
                showSections(conditionalSections);
            } else {
                hideSections(conditionalSections);
            }
        });
    });
    
    // Apply the current state
    if (yesIsSelected) {
        showSections(conditionalSections);
    } else {
        // Check if any radio contains "yes" in the ID and is checked
        const anyYesChecked = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
            .some(radio => radio.id.toLowerCase().includes('yes') || 
                          (radio.value && radio.value.toLowerCase().includes('yes')));
        
        if (anyYesChecked) {
            showSections(conditionalSections);
        } else {
            hideSections(conditionalSections);
        }
    }
}

function showSections(sections) {
    console.log('DIRECT FIX: Showing sections');
    sections.forEach(section => {
        if (section) {
            section.style.display = 'block';
            console.log('DIRECT FIX: Showed section:', section.id || section.className);
            
            // Make sure any required fields are actually required
            section.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.dataset.required === 'true' || field.dataset.requiredFor === 'attendance') {
                    field.required = true;
                }
            });
        }
    });
    
    // Additional display-related CSS
    sections.forEach(section => {
        if (section && section.classList.contains('form-section')) {
            section.style.padding = '20px';
            section.style.borderRadius = '12px';
            section.style.backgroundColor = 'var(--color-background-alt, #f8f9fa)';
            section.style.boxShadow = 'var(--shadow-light, 0 0 10px rgba(0,0,0,0.1))';
            section.style.marginBottom = '20px';
        }
    });
}

function hideSections(sections) {
    console.log('DIRECT FIX: Hiding sections');
    sections.forEach(section => {
        if (section) {
            section.style.display = 'none';
            console.log('DIRECT FIX: Hid section:', section.id || section.className);
            
            // Make sure any required fields are not required when hidden
            section.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.dataset.required === 'true' || field.dataset.requiredFor === 'attendance') {
                    field.required = false;
                }
            });
        }
    });
}
