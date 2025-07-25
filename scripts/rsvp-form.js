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
    const attendanceDetails = document.getElementById('attendanceDetails');
    if (attending) {
        attendanceDetails.style.display = 'block';
        document.getElementById('guestCount').required = true;
    } else {
        attendanceDetails.style.display = 'none';
        document.getElementById('guestCount').required = false;
    }
}

export async function buildFormFromJSON(rsvpData) {
    if (!rsvpData || !rsvpData.form) return;
    
    const formElement = document.getElementById(rsvpData.form.id);
    if (!formElement) return;
    
    // Clear existing form content
    formElement.innerHTML = '';
    
    // Build each section
    rsvpData.form.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.id = section.id;
        sectionDiv.className = rsvpData.styling.sectionClass;
        
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
            input.setAttribute('onchange', `${field.onChange}(${optionValue === 'yes'})`);
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

export async function loadFooterContent() {
    try {
        const response = await fetch('./json/footer.json');
        const footerData = await response.json();
        const footer = footerData.footer;
        const footerElement = document.querySelector('.footer');
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
