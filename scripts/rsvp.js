// RSVP Form Handler with Formspree Integration
let weddingData = {};

// Load wedding data and configure RSVP form
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load wedding data
        const response = await fetch('./json/wedding_outline.json');
        weddingData = await response.json();
        
        // Configure RSVP form with Formspree
        configureRSVPForm();
        
        // Load and apply color theme
        await loadAndApplyColors();
        
    } catch (error) {
        console.error('Error loading wedding data:', error);
    }
});

// Configure RSVP form with data from JSON
function configureRSVPForm() {
    const rsvpSection = weddingData.sections.find(section => section.id === 'rsvp');
    if (rsvpSection && rsvpSection.content.form) {
        const form = document.getElementById('rsvpForm');
        const formConfig = rsvpSection.content.form;
        
        // Set form action and method
        form.action = formConfig.action;
        form.method = formConfig.method;
        
        // Add hidden fields for Formspree
        const hiddenFields = `
            <input type="hidden" name="_subject" value="Wedding RSVP from ${weddingData.wedding.title}">
            <input type="hidden" name="_next" value="${window.location.origin}/rsvp.html?success=true">
            <input type="hidden" name="_template" value="basic">
        `;
        form.insertAdjacentHTML('afterbegin', hiddenFields);
        
        // Update deadline if available
        const deadline = new Date(rsvpSection.content.deadline);
        const deadlineText = deadline.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const subtitleElement = document.querySelector('.section-subtitle');
        if (subtitleElement) {
            subtitleElement.innerHTML = `We're so excited to celebrate with you! Please respond by <strong>${deadlineText}</strong>`;
        }
    }
}

// Load and apply color theme
async function loadAndApplyColors() {
    try {
        const response = await fetch('./json/colors.json');
        const colorData = await response.json();
        
        const root = document.documentElement;
        const cssVariables = colorData.cssVariables[':root'];
        
        Object.entries(cssVariables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    } catch (error) {
        console.error('Error loading colors:', error);
    }
}

// Enhanced RSVP form submission handler
function handleRSVPSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Enhanced Debug: Log everything about the form submission
    console.log('=== RSVP FORM SUBMISSION DEBUG ===');
    console.log('Form element:', form);
    console.log('Form action:', form.action);
    console.log('Form method:', form.method);
    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}"`);
    }
    console.log('Current URL:', window.location.href);
    console.log('User agent:', navigator.userAgent);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting RSVP...';
    submitButton.disabled = true;
    
    // Add form processing timestamp and format
    formData.append('_timestamp', new Date().toISOString());
    formData.append('_source', 'rsvp_form');
    formData.append('_format', 'json'); // Force JSON response from Formspree
    
    console.log('Making fetch request...');
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('✅ Response received');
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        console.log('Response ok:', response.ok);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Always try to read the response body
        return response.text().then(text => {
            console.log('Response body text:', text);
            
            let jsonData = null;
            try {
                jsonData = JSON.parse(text);
                console.log('Parsed response JSON:', jsonData);
            } catch (e) {
                console.log('Response is not JSON, treating as text');
            }
            
            if (response.ok) {
                console.log('🎉 RSVP submission successful!');
                showSuccessMessage();
                form.reset();
                
                // Scroll to success message
                setTimeout(() => {
                    const successMsg = document.getElementById('successMessage');
                    if (successMsg) {
                        successMsg.scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }
                }, 100);
            } else {
                console.log('❌ RSVP submission failed');
                if (jsonData && jsonData.errors) {
                    const errorMessage = jsonData.errors.map(error => error.message).join(", ");
                    console.log('Formspree error:', errorMessage);
                    showErrorMessage(errorMessage);
                } else {
                    console.log('Unknown error format');
                    showErrorMessage('There was a problem submitting your RSVP. Please try again.');
                }
            }
        });
    })
    .catch(error => {
        console.log('🚨 Network/Fetch error occurred');
        console.error('RSVP submission error:', error);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        showErrorMessage('There was a problem submitting your RSVP. Please check your connection and try again.');
    })
    .finally(() => {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        console.log('=== END RSVP SUBMISSION DEBUG ===');
    });
}

// Show success message
function showSuccessMessage() {
    const successHtml = `
        <div id="successMessage" class="alert alert-success alert-dismissible fade show mt-4" role="alert">
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill me-2 fs-4"></i>
                <div>
                    <h5 class="alert-heading mb-1">RSVP Submitted Successfully! 🎉</h5>
                    <p class="mb-0">Thank you for your response! We can't wait to celebrate with you on our special day.</p>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('.card-custom .card-body').insertAdjacentHTML('beforeend', successHtml);
}

// Show error message
function showErrorMessage(message) {
    const errorHtml = `
        <div class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
            <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
                <div>
                    <h6 class="alert-heading mb-1">RSVP Submission Failed</h6>
                    <p class="mb-0">${message}</p>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('.card-custom .card-body').insertAdjacentHTML('beforeend', errorHtml);
}

// Guest count change handler
function updateGuestDetails() {
    const guestCount = parseInt(document.getElementById('guestCount').value) || 1;
    const guestDetailsContainer = document.getElementById('guestDetailsContainer');
    
    if (guestCount > 1) {
        guestDetailsContainer.style.display = 'block';
        
        let guestFieldsHtml = '';
        for (let i = 2; i <= guestCount; i++) {
            guestFieldsHtml += `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="guest${i}Name" class="form-label">Guest ${i} Name *</label>
                        <input type="text" class="form-control" id="guest${i}Name" name="guest${i}Name" required>
                    </div>
                    <div class="col-md-6">
                        <label for="guest${i}Meal" class="form-label">Guest ${i} Meal Preference *</label>
                        <select class="form-control" id="guest${i}Meal" name="guest${i}Meal" required>
                            <option value="">Select meal preference</option>
                            <option value="chicken">Chicken</option>
                            <option value="fish">Fish</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                        </select>
                    </div>
                </div>
            `;
        }
        
        guestDetailsContainer.innerHTML = `
            <h5 class="mb-3">Additional Guest Details</h5>
            ${guestFieldsHtml}
        `;
    } else {
        guestDetailsContainer.style.display = 'none';
        guestDetailsContainer.innerHTML = '';
    }
}

// Check for success message in URL
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showSuccessMessage();
        // Clean up URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
    }
});
