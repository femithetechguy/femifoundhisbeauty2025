// RSVP Form functionality with JSON data support
export async function loadRSVPData() {
    try {
        const response = await fetch('./json/rsvp.json');
        if (!response.ok) {
            throw new Error('Failed to load RSVP data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading RSVP data:', error);
        return null;
    }
}

export function renderRSVPForm(rsvpData) {
    if (!rsvpData) return;
    
    // Update page title and meta
    document.title = rsvpData.meta.title;
    document.querySelector('meta[name="description"]').content = rsvpData.meta.description;
    
    // Update header
    const sectionHeader = document.querySelector('.section-header');
    if (sectionHeader) {
        const title = sectionHeader.querySelector('.section-title');
        const subtitle = sectionHeader.querySelector('.section-subtitle');
        
        if (title) title.innerHTML = `<i class="bi ${rsvpData.header.icon}"></i> ${rsvpData.header.title}`;
        if (subtitle) subtitle.innerHTML = `${rsvpData.header.subtitle.replace(rsvpData.meta.deadline, `<strong>${rsvpData.meta.deadline}</strong>`)}`;
    }
    
    // Apply styling classes from JSON
    const form = document.getElementById(rsvpData.form.id);
    if (form) {
        form.className = rsvpData.styling.formClass;
        form.method = rsvpData.form.method;
        form.action = rsvpData.form.action;
        
        // Build dynamic form based on JSON
        buildFormFromJSON(rsvpData);
    }
}

export function toggleAttendanceDetails(attending) {
    console.log('toggleAttendanceDetails called with:', attending);
    
    // DIRECT TARGETING APPROACH
    // Explicitly target specific sections and elements we know need to be shown/hidden
    const directSpecialMessageSection = document.getElementById('special-message');
    const guestCountField = document.querySelector('.form-section div.mb-3:has(#guestCount), div.mb-3:has(select[name="guestCount"])');
    const dietaryField = document.querySelector('.form-section div.mb-3:has(#dietaryRestrictions), div.mb-3:has(textarea[name="dietaryRestrictions"])');
    
    // Log direct targets
    console.log('Direct targets found:');
    console.log('- Special message section:', directSpecialMessageSection ? 'Found' : 'Not found');
    console.log('- Guest count field:', guestCountField ? 'Found' : 'Not found');
    console.log('- Dietary field:', dietaryField ? 'Found' : 'Not found');
    
    // BACKUP SELECTOR APPROACH
    // Also get all elements with conditional data attributes as backup
    const conditionalElements = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
    console.log('Found conditional elements via data attributes:', conditionalElements.length);
    
    // Debug - log each element
    conditionalElements.forEach((el, i) => {
        console.log(`Conditional element ${i}:`, el.id, el.tagName, el.className);
    });
    
    // Explicitly check for the special-message section
    const specialMessageSection = document.getElementById('special-message');
    if (specialMessageSection) {
        console.log('Found special-message section by ID');
    } else {
        // Try finding by class or other attributes if ID doesn't work
        const possibleSpecialMessageSections = document.querySelectorAll('[id*="special-message"], [id*="special"], .form-section:nth-child(3)');
        console.log('Possible special message sections found:', possibleSpecialMessageSections.length);
        possibleSpecialMessageSections.forEach((section, i) => {
            console.log(`Possible section ${i}:`, section.id, section.tagName, section.className);
        });
    }
    
    if (attending) {
        console.log('Showing conditional elements...');
        
        // DIRECT APPROACH: Show specific elements we know we need
        const elementsToShow = [
            directSpecialMessageSection,
            guestCountField,
            dietaryField
        ].filter(el => el); // Remove any null/undefined elements
        
        // Also add any data-attribute-based elements
        conditionalElements.forEach(el => {
            if (!elementsToShow.includes(el)) {
                elementsToShow.push(el);
            }
        });
        
        console.log(`Showing ${elementsToShow.length} elements in total`);
        
        // Show all found elements
        elementsToShow.forEach(element => {
            // Make sure we use the right display type for form sections
            if (element.classList.contains('form-section')) {
                element.style.display = 'block';
                // Ensure proper styling is maintained
                element.style.padding = '20px';
                element.style.borderRadius = '12px';
                element.style.backgroundColor = 'var(--color-background-alt)';
                element.style.boxShadow = 'var(--shadow-light)';
            } else {
                element.style.display = 'block';
            }
            
            console.log('Showing element:', element.id || element.className);
            
            // Re-enable required fields
            const requiredFields = element.querySelectorAll('[data-required="true"]');
            requiredFields.forEach(field => field.required = true);
        });
        
        // Direct handling for special message section to ensure it's displayed
        if (directSpecialMessageSection) {
            directSpecialMessageSection.style.display = 'block';
            // Ensure proper styling is maintained
            directSpecialMessageSection.style.padding = '20px';
            directSpecialMessageSection.style.borderRadius = '12px';
            directSpecialMessageSection.style.backgroundColor = 'var(--color-background-alt)';
            directSpecialMessageSection.style.boxShadow = 'var(--shadow-light)';
            console.log('Explicitly showed special-message section');
        } else {
            // Try to find section by title if ID doesn't work
            const specialSection = Array.from(document.querySelectorAll('.form-section-title')).find(
                title => title.textContent.includes('Special Message')
            );
            if (specialSection) {
                const parentSection = specialSection.closest('.form-section');
                if (parentSection) {
                    parentSection.style.display = 'block';
                    // Ensure proper styling is maintained
                    parentSection.style.padding = '20px';
                    parentSection.style.borderRadius = '12px';
                    parentSection.style.backgroundColor = 'var(--color-background-alt)';
                    parentSection.style.boxShadow = 'var(--shadow-light)';
                    console.log('Found and showed special message section by title');
                }
            }
        }
    } else {
        // Hide all conditional elements
        conditionalElements.forEach(element => {
            element.style.display = 'none';
            
            // Disable required fields
            const requiredFields = element.querySelectorAll('[required]');
            requiredFields.forEach(field => field.required = false);
        });
    }
}

export async function buildFormFromJSON(rsvpData) {
    if (!rsvpData || !rsvpData.form) return;
    
    const formElement = document.getElementById(rsvpData.form.id);
    if (!formElement) return;
    
    console.log('Building form from JSON data');
    
    // Clear existing form content
    formElement.innerHTML = '';
    
    // Build each section
    rsvpData.form.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.id = section.id; // This keeps the original section.id as the element ID
        sectionDiv.className = rsvpData.styling.sectionClass;
        
        console.log('Building section:', section.id);
        
        // Handle section-level conditionals
        if (section.conditional) {
            sectionDiv.setAttribute('data-depends-on', section.conditional.dependsOn);
            sectionDiv.setAttribute('data-show-when', section.conditional.showWhen);
            // Log that we're setting up a conditional section
            console.log(`Section ${section.id} is conditional on ${section.conditional.dependsOn}=${section.conditional.showWhen}`);
            
            if (section.conditional.showWhen === 'yes') {
                sectionDiv.style.display = 'none'; // Initially hidden
                console.log(`Section ${section.id} initially hidden`);
            }
        }
        
        // Create section header
        const sectionTitle = document.createElement('h4');
        sectionTitle.className = 'form-section-title';
        sectionTitle.innerHTML = `<i class="bi ${section.icon}"></i> ${section.title}`;
        sectionDiv.appendChild(sectionTitle);
        
        // Create section fields
        section.fields.forEach(field => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'mb-3';
            
            if (field.conditional) {
                fieldWrapper.setAttribute('data-depends-on', field.conditional.dependsOn);
                fieldWrapper.setAttribute('data-show-when', field.conditional.showWhen);
                if (field.conditional.showWhen === 'yes') {
                    fieldWrapper.style.display = 'none'; // Initially hidden
                }
            }
            
            // Create field based on type
            switch(field.type) {
                case 'text':
                case 'email':
                case 'tel':
                    createInputField(fieldWrapper, field, rsvpData.styling);
                    break;
                case 'textarea':
                    createTextareaField(fieldWrapper, field, rsvpData.styling);
                    break;
                case 'radio':
                    createRadioField(fieldWrapper, field, rsvpData.styling);
                    break;
                case 'select':
                    createSelectField(fieldWrapper, field, rsvpData.styling);
                    break;
            }
            
            sectionDiv.appendChild(fieldWrapper);
        });
        
        formElement.appendChild(sectionDiv);
    });
    
    // Add submit button
    const submitDiv = document.createElement('div');
    submitDiv.className = 'text-center';
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = rsvpData.form.submitButton.class;
    
    // Initialize event handlers now that all sections are built
    setTimeout(initializeEventHandlers, 100);
    submitButton.innerHTML = `<i class="bi ${rsvpData.form.submitButton.icon}"></i> ${rsvpData.form.submitButton.text}`;
    
    submitDiv.appendChild(submitButton);
    formElement.appendChild(submitDiv);
    
    // Configure confirmation message
    const confirmationMessage = document.getElementById('confirmationMessage');
    if (confirmationMessage) {
        const confirmData = rsvpData.confirmationMessage;
        confirmationMessage.innerHTML = `
            <div class="card-body text-center">
                <i class="bi ${confirmData.icon} display-4 text-success mb-3"></i>
                <h3>${confirmData.title}</h3>
                <p class="lead">${confirmData.message}</p>
                <p>${confirmData.subMessage}</p>
                <a href="${confirmData.backButton.link}" class="btn btn-outline-custom">
                    <i class="bi ${confirmData.backButton.icon}"></i> ${confirmData.backButton.text}
                </a>
            </div>
        `;
    }
}

function createInputField(wrapper, field, styling) {
    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.className = styling.labelClass;
    label.textContent = field.label + (field.required ? ' *' : '');
    
    const input = document.createElement('input');
    input.type = field.type;
    input.className = styling.inputClass;
    input.id = field.id;
    input.name = field.id;
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.required) input.required = true;
    
    wrapper.appendChild(label);
    wrapper.appendChild(input);
}

function createTextareaField(wrapper, field, styling) {
    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.className = styling.labelClass;
    label.textContent = field.label + (field.required ? ' *' : '');
    
    const textarea = document.createElement('textarea');
    textarea.className = styling.inputClass;
    textarea.id = field.id;
    textarea.name = field.id;
    textarea.rows = field.rows || 3;
    if (field.placeholder) textarea.placeholder = field.placeholder;
    if (field.required) textarea.required = true;
    
    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
}

function createRadioField(wrapper, field, styling) {
    const label = document.createElement('label');
    label.className = styling.labelClass;
    label.textContent = field.label + (field.required ? ' *' : '');
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'attendance-options';
    
    field.options.forEach((option, index) => {
        const optionId = `${field.id}${index === 0 ? 'Yes' : 'No'}`;
        const optionValue = field.values[index];
        console.log(`Creating radio option: ${option} with value: ${optionValue}`);
        const iconClass = field.icons ? field.icons[index] : '';
        
        const checkDiv = document.createElement('div');
        checkDiv.className = 'form-check form-check-custom';
        
        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'radio';
        input.name = field.id;
        input.id = optionId;
        input.value = optionValue;
        if (field.required) input.required = true;
        
        if (field.onChange) {
            // The value in the JSON is 'yes' (lowercase)
            input.setAttribute('onchange', `${field.onChange}(${optionValue.toLowerCase() === 'yes'})`);
            console.log(`Set onChange for radio: ${optionId} to ${field.onChange}(${optionValue.toLowerCase() === 'yes'})`);
        }
        
        const optionLabel = document.createElement('label');
        optionLabel.className = 'form-check-label';
        optionLabel.htmlFor = optionId;
        
        if (iconClass) {
            optionLabel.innerHTML = `<i class="bi ${iconClass}"></i> ${option}`;
        } else {
            optionLabel.textContent = option;
        }
        
        checkDiv.appendChild(input);
        checkDiv.appendChild(optionLabel);
        optionsDiv.appendChild(checkDiv);
    });
    
    wrapper.appendChild(label);
    wrapper.appendChild(optionsDiv);
}

function createSelectField(wrapper, field, styling) {
    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.className = styling.labelClass;
    label.textContent = field.label + (field.required ? ' *' : '');
    
    const select = document.createElement('select');
    select.className = styling.inputClass;
    select.id = field.id;
    select.name = field.id;
    if (field.required) select.required = true;
    
    field.options.forEach((option, index) => {
        const optionEl = document.createElement('option');
        optionEl.value = field.values[index];
        optionEl.textContent = option;
        select.appendChild(optionEl);
    });
    
    wrapper.appendChild(label);
    wrapper.appendChild(select);
}

export function handleRSVPSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('_format', 'json');
    formData.append('_timestamp', new Date().toISOString());
    formData.append('_source', 'rsvp_inline_form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
    submitButton.disabled = true;
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        return response.text().then(text => {
            if (response.ok) {
                document.getElementById('rsvpForm').style.display = 'none';
                document.getElementById('confirmationMessage').style.display = 'block';
            } else {
                alert('There was an error submitting your RSVP. Please try again.');
            }
        });
    })
    .catch(error => {
        console.error('RSVP submission error:', error);
        alert('There was an error submitting your RSVP. Please check your connection and try again.');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

export function applyColorTheme() {
    fetch('./json/colors.json')
        .then(response => response.json())
        .then(colorData => {
            const root = document.documentElement;
            const cssVariables = colorData.cssVariables[':root'];
            Object.entries(cssVariables).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        })
        .catch(error => console.error('Error loading colors:', error));
}

// Function to initialize event handlers for the form
function initializeEventHandlers() {
    console.log('Initializing event handlers');
    
    // First, make sure conditional sections are hidden by default
    toggleAttendanceDetails(false);
    
    // Set up attendance radio buttons to toggle visibility of conditional elements
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    console.log('Found attendance radios:', attendanceRadios.length);
    
    if (attendanceRadios.length) {
        attendanceRadios.forEach(radio => {
            console.log('Setting up radio:', radio.id, radio.value);
            
            // Remove existing event listeners first
            const newRadio = radio.cloneNode(true);
            radio.parentNode.replaceChild(newRadio, radio);
            
            // Add new event listener with more robust value checking
            newRadio.addEventListener('change', function() {
                console.log('Radio changed:', this.id, this.value);
                // Debug value comparison in detail
                console.log(`Radio value details: "${this.value}", length: ${this.value.length}, lowercase: ${this.value.toLowerCase()}`);
                
                // Use multiple approaches to check if this is a "yes" value
                const isYes = this.value.toLowerCase() === 'yes' || 
                              this.id.toLowerCase().includes('yes') || 
                              this.value.toLowerCase().includes('yes');
                
                console.log(`Is this a "yes" value? ${isYes}`);
                
                if (isYes) {
                    toggleAttendanceDetails(true);
                    
                    // Force check special message section visibility
                    setTimeout(() => {
                        // Find all sections with conditional attributes for attendance=yes
                        const conditionalSections = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
                        console.log('Post-timeout check - conditional sections found:', conditionalSections.length);
                        
                        // Explicitly look for special message section
                        const specialMessageSection = document.getElementById('special-message');
                        if (specialMessageSection) {
                            specialMessageSection.style.display = 'block';
                            console.log('Timeout action: Forced special-message section display');
                        }
                        
                        // Also try to find by section title
                        document.querySelectorAll('.form-section-title').forEach(title => {
                            if (title.textContent.includes('Special Message')) {
                                const parentSection = title.closest('.form-section');
                                if (parentSection) {
                                    parentSection.style.display = 'block';
                                    console.log('Timeout action: Found special message by title and showed it');
                                }
                            }
                        });
                    }, 100);
                    
                } else {
                    toggleAttendanceDetails(false);
                }
            });
            
            // Also add click handler for extra measure
            newRadio.onclick = function() {
                console.log('Radio clicked:', this.id, this.value);
                // The correct value from rsvp.json is 'yes' (lowercase)
                if (this.value.toLowerCase() === 'yes') {
                    toggleAttendanceDetails(true);
                } else {
                    toggleAttendanceDetails(false);
                }
            };
        });
    }
    
    // Force call toggleAttendanceDetails based on current selection
    const yesRadio = document.querySelector('input[name="attendance"][value="yes"]');
    if (yesRadio && yesRadio.checked) {
        console.log('Yes is checked, showing conditionals');
        toggleAttendanceDetails(true);
    } else {
        console.log('Yes is NOT checked, hiding conditionals');
        toggleAttendanceDetails(false);
    }
    
    console.log('RSVP form event handlers initialized');
}

export async function loadFooterContent() {
    try {
        const footerRes = await fetch('./json/footer.json');
        const footer = await footerRes.json();
        
        const footerElement = document.querySelector('footer.footer');
        const footerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <div class="footer-content">
                            <h5>${footer.leftColumn.title}</h5>
                            <p>${footer.leftColumn.subtitle}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="footer-hashtag">
                            <h3>${footer.rightColumn.hashtag}</h3>
                            <p>${footer.rightColumn.message}</p>
                        </div>
                    </div>
                </div>
                <hr class="footer-divider">
                <div class="row">
                    <div class="col-12 text-center">
                        <p class="footer-copyright">
                            ${footer.copyright.text}
                            <br>
                            <small>${footer.copyright.attribution.text} <i class="${footer.copyright.attribution.icon}"></i> by <a href="${footer.copyright.attribution.linkUrl}" target="${footer.copyright.attribution.linkTarget}" rel="${footer.copyright.attribution.linkRel}" class="${footer.copyright.attribution.linkClass}">${footer.copyright.attribution.linkText}</a></small>
                        </p>
                    </div>
                </div>
            </div>
        `;
        footerElement.innerHTML = footerHTML;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}
