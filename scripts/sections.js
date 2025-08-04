// Dynamically build all main content sections except 'home'
function buildDynamicSections() {
  if (!window.weddingData || !Array.isArray(weddingData.sections)) return '';
  // Map section type to renderer function
  const sectionRenderers = {
    'wedding-details': createWeddingDetailsContent,
    'gallery': createGalleryContent,
    'rsvp': createRSVPContent,
    'important-notice': createImportantNoticeContent,
    'scripture-theme': createScriptureThemeContent,
    'contact': createContactContent,
    'extras': createExtrasContent,
    'our-story': createOurStoryContent,
    'wedding_party': createWeddingPartyContent
    // Add more mappings as needed
  };

    // Build HTML for each section in order
  const sectionsHTML = window.weddingData.sections
    .filter(section => section.id !== 'home' && section.id !== 'rsvp' && section.order < 8.5)
    .map(section => {
      // Try both id and type for renderer mapping
      const renderer = sectionRenderers[section.id] || sectionRenderers[section.type];
      if (typeof renderer === 'function') {
        return `<section id="${section.id}">${renderer(section.content)}</section>`;
      } else {
        // Fallback: render as a simple card with title and description
        return `<section id="${section.id}"><div class="card-custom mb-4"><div class="card-body"><h4 class="card-title">${section.title || section.id}</h4><p>${section.content && section.content.description ? section.content.description : ''}</p></div></div></section>`;
      }
    })
    .join('');
    
  // After sections are rendered to DOM, dispatch an event to initialize components
  setTimeout(() => {
    document.dispatchEvent(new CustomEvent('contentLoaded'));
  }, 100);
  
  return sectionsHTML;
}

// Build sections that should appear after RSVP (order >= 8.5)
function buildPostRSVPSections() {
  if (!window.weddingData || !Array.isArray(weddingData.sections)) return '';
  
  // Map section type to renderer function
  const sectionRenderers = {
    'wedding-details': createWeddingDetailsContent,
    'gallery': createGalleryContent,
    'rsvp': createRSVPContent,
    'important-notice': createImportantNoticeContent,
    'scripture-theme': createScriptureThemeContent,
    'contact': createContactContent,
    'extras': createExtrasContent,
    'our-story': createOurStoryContent,
    'wedding_party': createWeddingPartyContent
    // Add more mappings as needed
  };

  // Build HTML for post-RSVP sections
  const sectionsHTML = window.weddingData.sections
    .filter(section => section.order >= 8.5)
    .map(section => {
      // Try both id and type for renderer mapping
      const renderer = sectionRenderers[section.id] || sectionRenderers[section.type];
      if (typeof renderer === 'function') {
        return `<section id="${section.id}">${renderer(section.content)}</section>`;
      } else {
        // Fallback: render as a simple card with title and description
        return `<section id="${section.id}"><div class="card-custom mb-4"><div class="card-body"><h4 class="card-title">${section.title || section.id}</h4><p>${section.content && section.content.description ? section.content.description : ''}</p></div></div></section>`;
      }
    })
    .join('');
    
  return sectionsHTML;
}

// Meet the Couple / Wedding Party section renderer
function createWeddingPartyContent(content) {
  // Ensure content has the required properties to prevent errors
  if (!content || !content.bride || !content.groom) {
    console.error('Missing bride or groom data in wedding party content');
    return '<p>Unable to load wedding party information.</p>';
  }

  return `
    <h2 class="section-title text-center mb-4">Meet the Couple</h2>
    <div class="row">
      <div class="col-12 mb-4">
        <div class="card-custom h-100">
          <div class="card-body">
            <div class="couple-container">
              <div class="couple-bride">
                <div class="portrait-container bride-photo-container">
                  <img src="${content.bride.photo.startsWith('/') ? content.bride.photo : '/' + content.bride.photo}" 
                       alt="${content.bride.fullName}" 
                       class="portrait-photo" 
                       style="width: 230px; height: auto;">
                  <div class="magnifier-icon" data-portrait="bride">
                    <i class="bi bi-zoom-in"></i>
                  </div>
                </div>
                <h4 class="card-title">${content.bride.fullName}</h4>
                <p class="text-muted">Bride</p>
                <p>${content.bride.bio}</p>
                <ul class="list-unstyled">
                  ${(content.bride.funFacts || []).map(fact => `<li>${fact}</li>`).join('')}
                </ul>
              </div>
              
              <div class="couple-love">
                <div class="heart-container">
                  <div class="heart-icon">💗</div>
                  <div class="heart-pulse"></div>
                </div>
              </div>
              
              <div class="couple-groom">
                <div class="portrait-container groom-photo-container">
                  <img src="${content.groom.photo.startsWith('/') ? content.groom.photo : '/' + content.groom.photo}" 
                       alt="${content.groom.fullName}" 
                       class="portrait-photo" 
                       style="width: 230px; height: auto;">
                  <div class="magnifier-icon" data-portrait="groom">
                    <i class="bi bi-zoom-in"></i>
                  </div>
                </div>
                <h4 class="card-title">${content.groom.fullName}</h4>
                <p class="text-muted">Groom</p>
                <p>${content.groom.bio}</p>
                <ul class="list-unstyled">
                  ${(content.groom.funFacts || []).map(fact => `<li>${fact}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


function createGalleryContent(content) {
  // Combine portrait photos and throwback photos for the first row
  const firstRowPhotos = [...content.portraitPhotos];
  
  // Add throwback photo to the first row if available
  if (content.throwbackPhotos && content.throwbackPhotos.length > 0) {
    firstRowPhotos.push(...content.throwbackPhotos);
  }
  
  return `
        <h2 class="section-title text-center mb-4">Gallery</h2>
        <div class="row">
            <div class="col-12 mb-4">
                <h3 class="text-center">Our Memories</h3>
                <div class="row">
                    ${firstRowPhotos
                      .map(
                        (photo, index) =>
                          `<div class="col-6 col-md-3 mb-3"><div class="gallery-item" data-index="${index}"><img src="${photo.src}" alt="${photo.caption}" class="img-fluid rounded-custom" data-lightbox-src="${photo.src}" data-lightbox-caption="${photo.caption}"><p class="text-center mt-2 small">${photo.caption}</p></div></div>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
        <div class="text-center mt-4">
            <a href="gallery.html" class="btn btn-primary-custom direct-link"><i class="bi bi-images"></i> View Full Gallery</a>
        </div>
    `;
}

function createImportantNoticeContent(content) {
  if (!content || !content.notices || !Array.isArray(content.notices)) {
    console.error('Missing notices data in important notice content');
    return '<p>Unable to load important notice information.</p>';
  }

  // Generate notice cards HTML
  const noticeCardsHTML = content.notices.map(notice => `
    <div class="notice-card">
      <div class="notice-icon">${notice.icon || '⚠️'}</div>
      <h3 class="notice-card-title">${notice.title}</h3>
      <p class="notice-message">${notice.message}</p>
    </div>
  `).join('');

  // Get CTA configuration
  const cta = content.cta || {};
  const ctaText = cta.text || 'I Understand';
  const ctaSubtext = cta.subtext || '';

  return `
    <div class="important-notice-section">
      <div class="important-notice-container">
        <div class="notice-header">
          <h2 class="notice-title">${content.title || 'Important Notice'}</h2>
          <p class="notice-subtitle">${content.subtitle || 'Please read carefully'}</p>
        </div>
        <div class="notices-grid">
          ${noticeCardsHTML}
        </div>
        <div class="cta-button-container">
          <button class="animated-cta-button" onclick="acknowledgeNotice()">
            ${ctaText}
          </button>
          ${ctaSubtext ? `<p class="cta-subtext">${ctaSubtext}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

function createRSVPContent(content) {
  // Try to use rsvpData from global scope if available, otherwise fall back to content
  const rsvpData = window.rsvpData && Object.keys(window.rsvpData).length > 0 ? window.rsvpData : null;
  
  if (rsvpData) {
    // Use rsvp.json data to build the form
    let formHTML = '';
    
    // Build each section from rsvp.json
    rsvpData.form.sections.forEach(section => {
      // Handle conditional display for entire section
      const sectionConditionalAttr = section.conditional ? 
        `data-depends-on="${section.conditional.dependsOn}" data-show-when="${section.conditional.showWhen}"` : '';
      
      // Set initial display style for conditional sections
      const sectionInitialStyle = section.conditional && section.conditional.showWhen === "yes" ? 
        'style="display: none;"' : '';
        
      formHTML += `
        <div class="${rsvpData.styling.sectionClass}" ${sectionConditionalAttr} ${sectionInitialStyle} id="${section.id}">
          <h5 class="form-section-title">
            <i class="bi ${section.icon}"></i> ${section.title}
          </h5>
      `;
      
      // Build fields for this section
      // Check if section has fields property before iterating
      if (section.fields && Array.isArray(section.fields)) {
        section.fields.forEach(field => {
          let fieldHTML = '';
          
          // Handle conditional display
          const conditionalAttr = field.conditional ? 
            `data-depends-on="${field.conditional.dependsOn}" data-show-when="${field.conditional.showWhen}"` : '';
        
        // Generate appropriate HTML based on field type
        switch(field.type) {
          case 'text':
          case 'email':
          case 'tel':
            fieldHTML = `
              <div class="mb-3" ${conditionalAttr}>
                <label for="${field.id}" class="${rsvpData.styling.labelClass}">${field.label}${field.required ? ' *' : ''}</label>
                <input type="${field.type}" class="${rsvpData.styling.inputClass}" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
              </div>
            `;
            break;
            
          case 'radio':
            fieldHTML = `
              <div class="mb-3" ${conditionalAttr}>
                <label class="${rsvpData.styling.labelClass}">${field.label}${field.required ? ' *' : ''}</label>
                <div class="attendance-options">
            `;
            
            field.options.forEach((option, index) => {
              const value = field.values[index];
              const icon = field.icons ? field.icons[index] : '';
              const onChangeFunc = field.onChange ? `onclick="${value === 'yes' ? 'showAttendanceDetails()' : 'hideAttendanceDetails()'}"`  : '';
              
              fieldHTML += `
                <div class="form-check form-check-custom">
                  <input class="form-check-input" type="radio" name="${field.id}" id="${field.id}_${index}" 
                    value="${value}" ${field.required ? 'required' : ''} ${onChangeFunc}>
                  <label class="form-check-label" for="${field.id}_${index}">
                    ${icon ? `<i class="bi ${icon}"></i> ` : ''}${option}
                  </label>
                </div>
              `;
            });
            
            fieldHTML += `
                </div>
              </div>
            `;
            break;
            
          case 'select':
            fieldHTML = `
              <div class="mb-3" ${conditionalAttr} ${field.conditional && field.conditional.showWhen === 'yes' ? 'style="display: none;"' : ''} id="${field.conditional && field.conditional.showWhen === 'yes' ? 'attendanceDetailsSection' : ''}">
                <label for="${field.id}" class="${rsvpData.styling.labelClass}">${field.label}${field.required ? ' *' : ''}</label>
                <select class="${rsvpData.styling.inputClass}" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
            `;
            
            field.options.forEach((option, index) => {
              fieldHTML += `<option value="${field.values[index]}">${option}</option>`;
            });
            
            fieldHTML += `
                </select>
              </div>
            `;
            break;
            
          case 'textarea':
            // Special handling for dietary restrictions which is conditional
            const specialId = field.id === 'dietaryRestrictions' && field.conditional ? 'dietaryRestrictions' : field.id;
            const inAttendanceDetails = field.conditional && field.conditional.showWhen === 'yes';
            
            fieldHTML = `
              <div class="mb-3" ${conditionalAttr} ${inAttendanceDetails ? 'style="display: none;"' : ''}>
                <label for="${specialId}" class="${rsvpData.styling.labelClass}">${field.label}${field.required ? ' *' : ''}</label>
                <textarea class="${rsvpData.styling.inputClass}" id="${specialId}" name="${specialId}" 
                  rows="${field.rows || 3}" placeholder="${field.placeholder || ''}" 
                  data-required="${field.required ? 'true' : 'false'}" ${field.required ? 'required' : ''}></textarea>
              </div>
            `;
            break;
        }
        
        formHTML += fieldHTML;
      });
      }
      
      formHTML += `</div>`;
    });
    
    return `
      <h2 class="section-title text-center mb-4">${rsvpData.header.title}</h2>
      <div class="row justify-content-center">
        <div class="col-lg-8 mx-auto">
          <div class="${rsvpData.styling.cardClass}">
            <div class="card-body">
              <div class="text-center mb-3">
                <i class="bi ${rsvpData.header.icon} text-primary-custom fs-1 mb-2"></i>
                <h4 class="mb-2">Thanks for RSVPing!</h4>
                <p class="text-muted">Please respond by ${rsvpData.meta.deadline}</p>
              </div>
              
              <form id="${rsvpData.form.id}" class="${rsvpData.styling.formClass}" method="${rsvpData.form.method}" action="${rsvpData.form.action}" onsubmit="${rsvpData.form.handler}(event)">
                <!-- Hidden fields for Formspree -->
                <input type="hidden" name="_subject" value="Wedding RSVP Submission">
                <input type="hidden" name="_format" value="json">
                ${formHTML}
                <div class="text-center mt-4">
                  <button type="submit" class="${rsvpData.form.submitButton.class}">
                    <i class="bi ${rsvpData.form.submitButton.icon}"></i> ${rsvpData.form.submitButton.text}
                  </button>
                </div>
              </form>
              
              <div id="confirmationMessage" class="success-message mt-4" style="display: none;">
                <div class="text-center">
                  <i class="bi ${rsvpData.confirmationMessage.icon} display-4 text-success mb-3"></i>
                  <h3>${rsvpData.confirmationMessage.title}</h3>
                  <p class="lead">${rsvpData.confirmationMessage.message}</p>
                  <p>${rsvpData.confirmationMessage.subMessage}</p>
                  <a href="${rsvpData.confirmationMessage.backButton.link}" class="btn btn-outline-custom">
                    <i class="bi ${rsvpData.confirmationMessage.backButton.icon}"></i> ${rsvpData.confirmationMessage.backButton.text}
                  </a>
                </div>
              </div>
              
              <!-- Additional confirmation element for compatibility with gallery.html -->
              <div id="rsvpConfirmation" class="success-message mt-4" style="display: none;">
                <div class="text-center">
                  <i class="bi ${rsvpData.confirmationMessage.icon} display-4 text-success mb-3"></i>
                  <h3>${rsvpData.confirmationMessage.title}</h3>
                  <p class="lead">${rsvpData.confirmationMessage.message}</p>
                  <p>${rsvpData.confirmationMessage.subMessage}</p>
                  <a href="${rsvpData.confirmationMessage.backButton.link}" class="btn btn-outline-custom">
                    <i class="bi ${rsvpData.confirmationMessage.backButton.icon}"></i> ${rsvpData.confirmationMessage.backButton.text}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script>
        // Toggle functions for conditional fields
        function showAttendanceDetails() {
          console.log('showAttendanceDetails called');
          const attendanceDetails = document.getElementById('attendanceDetailsSection');
          if (attendanceDetails) {
            attendanceDetails.style.display = 'block';
            const guestCount = document.getElementById('guestCount');
            if (guestCount) guestCount.required = true;
          }
          
          // Find all elements with data-depends-on="attendance" and data-show-when="yes"
          const conditionalElements = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
          conditionalElements.forEach(element => {
            element.style.display = 'block';
            console.log('Showing conditional element:', element.id || element.className);
            
            // If the element contains required fields, make them required again
            const requiredFields = element.querySelectorAll('[data-required="true"]');
            requiredFields.forEach(field => field.required = true);
          });
          
          // Special handling for the special message section
          const specialMessageSection = document.getElementById('section-special-message') || 
                                     document.getElementById('special-message');
          if (specialMessageSection) {
            specialMessageSection.style.display = 'block';
            console.log('Explicitly showed special message section:', specialMessageSection.id);
          } else {
            // Try to find by title
            document.querySelectorAll('.form-section-title').forEach(title => {
              if (title.textContent.includes('Special Message')) {
                const parent = title.closest('.form-section');
                if (parent) {
                  parent.style.display = 'block';
                  console.log('Found and showed special message section by title');
                }
              }
            });
          }
        }
        
        function hideAttendanceDetails() {
          console.log('hideAttendanceDetails called');
          const attendanceDetails = document.getElementById('attendanceDetailsSection');
          if (attendanceDetails) {
            attendanceDetails.style.display = 'none';
            const guestCount = document.getElementById('guestCount');
            if (guestCount) guestCount.required = false;
          }
          
          // Find all elements with data-depends-on="attendance" and data-show-when="yes"
          const conditionalElements = document.querySelectorAll('[data-depends-on="attendance"][data-show-when="yes"]');
          conditionalElements.forEach(element => {
            element.style.display = 'none';
            
            // Remove required from all fields
            const requiredFields = element.querySelectorAll('[required]');
            requiredFields.forEach(field => field.required = false);
          });
        }
        
        function toggleAttendanceDetails(attending) {
          console.log('toggleAttendanceDetails called with:', attending);
          if (attending) {
            showAttendanceDetails();
          } else {
            hideAttendanceDetails();
          }
        }
        
        // Handle RSVP form submission
        function handleRSVPSubmission(event) {
          event.preventDefault();
          
          const form = event.target;
          const formData = new FormData(form);
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
          
          submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
          submitBtn.disabled = true;
          
          fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
          })
          .then(function(response) {
            if (response.ok) {
              form.style.display = 'none';
              // Try both possible confirmation IDs
              const confirmation = document.getElementById('confirmationMessage') || document.getElementById('rsvpConfirmation');
              if (confirmation) {
                confirmation.style.display = 'block';
              }
            } else {
              alert('There was an error submitting your RSVP. Please try again.');
            }
          })
          .catch(function() {
            alert('There was an error submitting your RSVP. Please check your connection and try again.');
          })
          .finally(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          });
        }
        
        // Initialize the form on page load
        document.addEventListener('DOMContentLoaded', function() {
          // Set the initial state (hide by default)
          hideAttendanceDetails();
          
          // Make functions available globally
          window.showAttendanceDetails = showAttendanceDetails;
          window.hideAttendanceDetails = hideAttendanceDetails;
          window.toggleAttendanceDetails = toggleAttendanceDetails;
          window.handleRSVPSubmission = handleRSVPSubmission;
        });
      </script>
    `;
  } else {
    // Fallback to legacy implementation if rsvpData is not available
    let fullNameField = content.form.fields.find(field => field.name === "fullName");
    let emailField = content.form.fields.find(field => field.name === "email");
    let phoneField = content.form.fields.find(field => field.name === "phone");
    let attendanceField = content.form.fields.find(field => field.name === "attendance");
    let guestCountField = content.form.fields.find(field => field.name === "guestCount");
    let dietaryField = content.form.fields.find(field => field.name === "dietaryRestrictions");
    
    // Create the custom layout with personal information in one section
    let formHTML = `
      <div class="form-section mb-4">
        <h5 class="form-section-title">
          <i class="bi bi-person"></i> Personal Information
        </h5>
        
        <!-- Full Name field -->
        <div class="mb-3">
          <label for="fullName" class="form-label">${fullNameField.label}${fullNameField.required ? ' *' : ''}</label>
          <input type="text" class="form-control" id="fullName" name="fullName" ${fullNameField.required ? 'required' : ''}>
        </div>
        
        <!-- Email and Phone on same row -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="email" class="form-label">${emailField.label}${emailField.required ? ' *' : ''}</label>
            <input type="email" class="form-control" id="email" name="email" ${emailField.required ? 'required' : ''}>
          </div>
          <div class="col-md-6 mb-3">
            <label for="phone" class="form-label">${phoneField.label}${phoneField.required ? ' *' : ''}</label>
            <input type="tel" class="form-control" id="phone" name="phone" ${phoneField.required ? 'required' : ''}>
          </div>
        </div>
      </div>
      
      <div class="form-section mb-4">
        <h5 class="form-section-title">
          <i class="bi bi-calendar-check"></i> Attendance
        </h5>
        
        <!-- Attendance radio buttons -->
        <div class="mb-3">
          <label class="form-label">${attendanceField.label}${attendanceField.required ? ' *' : ''}</label>
          <div class="attendance-options">
            <div class="form-check form-check-custom">
              <input class="form-check-input" type="radio" name="attendance" id="attendance_0" value="${attendanceField.options[0]}" ${attendanceField.required ? 'required' : ''} onclick="showAttendanceDetails()">
              <label class="form-check-label" for="attendance_0">${attendanceField.options[0]}</label>
            </div>
            <div class="form-check form-check-custom">
              <input class="form-check-input" type="radio" name="attendance" id="attendance_1" value="${attendanceField.options[1]}" ${attendanceField.required ? 'required' : ''} onclick="hideAttendanceDetails()">
              <label class="form-check-label" for="attendance_1">${attendanceField.options[1]}</label>
            </div>
          </div>
        </div>
        
        <div id="attendanceDetailsSection" style="display: none;">
          <!-- Guest Count field -->
          <div class="mb-3">
            <label for="guestCount" class="form-label">${guestCountField.label}${guestCountField.required ? ' *' : ''}</label>
            <input type="number" class="form-control" id="guestCount" name="guestCount" value="1"
              min="${guestCountField.min || 1}" max="${guestCountField.max || 10}">
          </div>
          
          <!-- Dietary Restrictions -->
          <div class="mb-3">
            <label for="dietaryRestrictions" class="form-label">${dietaryField.label}${dietaryField.required ? ' *' : ''}</label>
            <textarea class="form-control" id="dietaryRestrictions" name="dietaryRestrictions" rows="2" data-required="${dietaryField.required ? 'true' : 'false'}"></textarea>
          </div>
        </div>
      </div>
    `;

    return `
      <h2 class="section-title text-center mb-4">RSVP</h2>
      <div class="row justify-content-center">
        <div class="col-lg-8 mx-auto">
          <div class="upload-card">
            <div class="text-center mb-3">
              <i class="bi bi-heart-fill upload-icon"></i>
              <h4 class="mb-2">We'd Love to See You There</h4>
              <p class="text-muted">Please respond by ${content.deadline}</p>
            </div>
            
            <form id="rsvpForm" class="form-custom" action="${content.form.action}" method="${content.form.method}">
              ${formHTML}
              <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary-custom btn-lg upload-btn">
                  <i class="bi bi-heart-fill"></i> Submit RSVP
                </button>
              </div>
            </form>
            <div id="rsvpConfirmation" class="success-message mt-4" style="display:none;">
              <i class="bi bi-check-circle"></i> ${content.confirmationMessage || 'Thank you for your RSVP! We look forward to celebrating with you.'}
            </div>
          </div>
        </div>
      </div>
      <script>
        // Simplified direct implementation of toggle functions
        function showAttendanceDetails() {
          console.log('showAttendanceDetails called');
          document.getElementById('attendanceDetailsSection').style.display = 'block';
          document.getElementById('guestCount').required = true;
          
          // Make dietary restrictions required if it was originally required
          const dietaryRestrictions = document.getElementById('dietaryRestrictions');
          if (dietaryRestrictions && dietaryRestrictions.getAttribute('data-required') === 'true') {
            dietaryRestrictions.required = true;
          }
        }
        
        function hideAttendanceDetails() {
          console.log('hideAttendanceDetails called');
          document.getElementById('attendanceDetailsSection').style.display = 'none';
          document.getElementById('guestCount').required = false;
          document.getElementById('dietaryRestrictions').required = false;
        }
        
        function toggleAttendanceDetails(attending) {
          console.log('toggleAttendanceDetails called with:', attending);
          if (attending) {
            showAttendanceDetails();
          } else {
            hideAttendanceDetails();
          }
        }
        
        // Initialize the RSVP form
        document.addEventListener('DOMContentLoaded', function() {
          const rsvpForm = document.getElementById('rsvpForm');
          
          // Set the initial state (hide by default)
          hideAttendanceDetails();
          
          // Check if first radio button (Yes) is selected
          const yesRadio = document.getElementById('attendance_0');
          if (yesRadio && yesRadio.checked) {
            showAttendanceDetails();
          }
          
          // Make functions available globally
          window.showAttendanceDetails = showAttendanceDetails;
          window.hideAttendanceDetails = hideAttendanceDetails;
          window.toggleAttendanceDetails = toggleAttendanceDetails;
          
          // Handle form submission
          if (rsvpForm) {
            rsvpForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              var formData = new FormData(rsvpForm);
              var submitBtn = rsvpForm.querySelector('button[type="submit"]');
              var originalText = submitBtn.innerHTML;
              
              submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
              submitBtn.disabled = true;
              
              fetch(rsvpForm.action, {
                method: rsvpForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
              })
              .then(function(response) {
                if (response.ok) {
                  rsvpForm.style.display = 'none';
                  // Try both possible confirmation IDs
                  const confirmation = document.getElementById('rsvpConfirmation') || document.getElementById('confirmationMessage');
                  if (confirmation) {
                    confirmation.style.display = 'block';
                  }
                } else {
                  alert('There was an error submitting your RSVP. Please try again.');
                }
              })
              .catch(function() {
                alert('There was an error submitting your RSVP. Please check your connection and try again.');
              })
              .finally(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
              });
            });
          }
        });
      </script>
    `;
  }
}



function createScriptureThemeContent(content) {
  // Handle scripture as an array
  const scriptures = Array.isArray(content.scripture) ? content.scripture : [content.scripture];
  return `
    <h2 class="section-title text-center mb-4">Our Anchor Scriptures</h2>
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card-custom h-100 text-center">
          <div class="card-body">
            <i class="bi bi-book display-4 text-primary-custom mb-3"></i>
            <h4 class="card-title">Our Scripture${scriptures.length > 1 ? 's' : ''}</h4>
            ${scriptures
              .map(
                (s) => `
                  <div class="scripture-container">
                    <div class="scripture-verse">
                      <i class="bi bi-quote me-2"></i>
                      ${s.verse}
                      <i class="bi bi-quote ms-2"></i>
                    </div>
                    <div class="scripture-reference">
                      ${s.reference}
                    </div>
                    ${s.significance ? 
                      `<div class="scripture-significance">
                        <i class="bi bi-heart-fill me-2"></i>${s.significance}
                      </div>` : ''}
                  </div>
                `
              )
              .join('<hr class="scripture-divider my-4">')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function createContactContent(content) {
  return `
    <h2 class="section-title text-center mb-4">Contact Us</h2>
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card-custom h-100">
          <div class="card-body text-center">
            <h4 class="card-title"><i class="bi bi-people"></i> Contact Information</h4>
            <div class="contact-item mb-4">
              <h6>Wedding Contact</h6>
              <p><i class="bi bi-envelope"></i> <a href="mailto:${content.contact.plannerEmail}" class="contact-email">${content.contact.plannerEmail}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createExtrasContent(content) {
  let html = "<h2 class=\"section-title text-center mb-4\">Extras</h2>";
  // Guest Message + QR Code Side by Side (Desktop)
  // Always render both columns as siblings for flex layout
  const hasGuestMessage = content.guestMessage && content.guestMessage.enabled;
  const hasQR = content.qrCode && content.qrCode.enabled;
  
  if (hasGuestMessage || hasQR) {
    html += '<div class="message-qr-flex mt-4">';
    
    // QR code column - centered
    html += '<div class="qr-col mx-auto" style="max-width: 500px;">';
    if (hasQR) {
      const qr = content.qrCode;
      html += '<div class="card-custom h-100 d-flex flex-column align-items-center justify-content-center">';
      html += '<div class="card-body text-center d-flex flex-column align-items-center justify-content-center">';
      html += `<h4 class="card-title mb-3"><i class="bi bi-qr-code"></i> Scan Me!</h4>`;
      html += `<img src="${qr.image}" alt="QR Code" class="img-fluid mb-3" style="max-width: 220px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">`;
      html += `<p class="mb-2">${qr.description || ''}</p>`;
      html += `<div class="mb-3">`;
      html += `<button class="btn btn-primary-custom btn-share-qr" data-link="${qr.url}"><i class="bi bi-share"></i> Share</button>`;
      html += `<button class="btn btn-outline-custom ms-2 copy-qr-link" data-link="${qr.url}"><i class="bi bi-clipboard"></i> Copy Link</button>`;
      html += `<span class="copy-confirmation ms-2 text-success" style="display:none; font-size:0.95em;"><i class="bi bi-check-circle"></i> Copied!</span>`;
      html += `</div>`;
      html += '</div></div>';
    }
    html += '</div>';
    html += '</div>';
  }
  
  // Live Stream Section
  if (content.liveStream && content.liveStream.enabled) {
    html += '<div class="row mt-4">';
    html += '<div class="col-12">';
    html += '<div class="card-custom">';
    html += '<div class="card-body text-center">';
    html += '<i class="bi bi-broadcast display-4 text-primary-custom mb-3"></i>';
    html += '<h4 class="card-title">Virtual Guest?</h4>';
    html += `<p>${content.liveStream.description}</p>`;
    
    if (content.liveStream.backupPlatform) {
      html += `<p><strong>Backup:</strong> ${content.liveStream.backupPlatform}</p>`;
    }
    
    html += '<div class="mt-3">';
    html += `<a href="${content.liveStream.link}" target="_blank" class="btn btn-primary-custom me-2">`;
    html += '<i class="bi bi-play-circle"></i> Join via Zoom';
    html += "</a>";
    html += `<button class="btn btn-outline-custom copy-livestream-link" data-link="${content.liveStream.link}">`;
    html += '<i class="bi bi-clipboard"></i> Copy Link';
    html += "</button>";
    html += `<span class="copy-confirmation ms-2 text-success" style="display:none; font-size:0.95em;"><i class="bi bi-check-circle"></i> Copied!</span>`;
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
  }
  
  return html;
}
// Section content renderers (from script.js)
function createOurStoryContent(content) {
  console.log('Creating Our Story content');
  
  return `
    <h2 class="section-title text-center mb-4">Our Story</h2>
    <div class="row">
      <div class="col-lg-12 mb-4">
        <div class="card-custom h-100">
          <div class="card-body">
            <h4 class="card-title"><i class="bi bi-heart"></i> ${content.howWeMet.title}</h4>
            <p class="text-muted"><i class="bi bi-geo-alt"></i> ${content.howWeMet.location} • ${content.howWeMet.date}</p>
            <p>${content.howWeMet.story}</p>
            <button class="btn btn-primary-custom mt-3 px-4 py-2" onclick="openStoryPopup('howWeMet')">
              <i class="bi bi-book"></i> Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createWeddingDetailsContent(content) {
  return `
    <h2 class="section-title text-center mb-4">Wedding Details</h2>
    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="card-custom h-100">
          <div class="card-body text-center">
            <i class="bi bi-church display-4 text-primary-custom mb-3"></i>
            <h4 class="card-title">Ceremony</h4>
            <h5>${content.ceremony.venue.name}</h5>
            <p class="text-muted">${content.ceremony.venue.address}</p>
            <p><strong>Date:</strong> ${content.ceremony.date}</p>
            <p><strong>Time:</strong> ${content.ceremony.time}</p>
            <div class="venue-actions">
              <div class="position-relative">
                <button class="btn btn-outline-custom copy-address-btn" data-address="${content.ceremony.venue.address}">
                  <i class="bi bi-clipboard"></i> Copy Address
                </button>
                <span class="copy-confirmation text-success position-absolute" style="display:none; font-size:0.85em; top: 100%; left: 50%; transform: translateX(-50%); white-space: nowrap; margin-top: 4px;">
                  <i class="bi bi-check-circle"></i> Copied!
                </span>
              </div>
              <div>
                <button class="btn btn-primary-custom" onclick="driveToLocation('${content.ceremony.venue.address}')">
                  <i class="bi bi-car-front-fill"></i> Drive Here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card-custom h-100">
          <div class="card-body text-center">
            <i class="bi bi-music-note-list display-4 text-primary-custom mb-3"></i>
            <h4 class="card-title">Reception</h4>
            <h5>${content.reception.venue.name}</h5>
            <p class="text-muted">${content.reception.venue.address}</p>
            <p><strong>Date:</strong> ${content.reception.date}</p>
            <p><strong>Time:</strong> ${content.reception.time}</p>
            <div class="venue-actions">
              <div class="position-relative">
                <button class="btn btn-outline-custom copy-address-btn" data-address="${content.reception.venue.address}">
                  <i class="bi bi-clipboard"></i> Copy Address
                </button>
                <span class="copy-confirmation text-success position-absolute" style="display:none; font-size:0.85em; top: 100%; left: 50%; transform: translateX(-50%); white-space: nowrap; margin-top: 4px;">
                  <i class="bi bi-check-circle"></i> Copied!
                </span>
              </div>
              <div>
                <button class="btn btn-primary-custom" onclick="driveToLocation('${content.reception.venue.address}')">
                  <i class="bi bi-car-front-fill"></i> Drive Here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-6 mb-4">
        <div class="card-custom h-100">
          <div class="card-body">
            <h4 class="card-title text-center"><i class="bi bi-palette"></i> Dress Code + Color</h4>
            <div class="text-center">
              <p class="mb-3">${content.dressCode.description}</p>
              <div class="color-palette row justify-content-center">
                ${content.dressCode.colors
                  .map((color) => {
                    let colorName, colorHex, variations = [], examples = [];
                    if (typeof color === 'object' && color !== null) {
                      colorName = color.name || '';
                      colorHex = color.hex || '';
                      variations = color.variations || [];
                      examples = color.examples || [];
                    } else if (typeof color === 'string') {
                      colorName = color;
                      const colorMap = {
                        'Olive Green': '#586B36',
                        'Green': '#008000',
                        'Gold': '#d4af37',
                        'Navy Blue': '#1e3a8a',
                        'Ivory': '#f8f8ff',
                        'White': '#ffffff',
                        'Black': '#000000',
                        'Red': '#ff0000',
                        'Blue': '#0000ff',
                        'Yellow': '#ffff00',
                        'Purple': '#800080',
                        'Pink': '#ffc0cb',
                        'Orange': '#ffa500',
                        'Brown': '#8b4513',
                        'Beige': '#f5f5dc',
                        'Teal': '#008080',
                        'Coral': '#ff7f50',
                        'Burgundy': '#800020',
                        'Lavender': '#e6e6fa',
                        'Mint': '#98ff98',
                        'Peach': '#ffe5b4',
                        'Champagne': '#f7e7ce',
                        'Silver': '#c0c0c0',
                        'Rose Gold': '#b76e79',
                        'Turquoise': '#40e0d0',
                        'Maroon': '#800000',
                        'Sky Blue': '#87ceeb',
                        'Emerald': '#50c878',
                        'Sage': '#b2ac88',
                        'Blush': '#f9c2c2',
                        'Mustard': '#ffdb58',
                        'Lilac': '#c8a2c8',
                        'Magenta': '#ff00ff',
                        'Cyan': '#00ffff',
                        'Aqua': '#00ffff',
                        'Tan': '#d2b48c',
                        'Cream': '#fffdd0',
                        'Charcoal': '#36454f',
                        'Plum': '#8e4585',
                        'Denim': '#1560bd',
                        'Copper': '#b87333',
                        'Mint Green': '#98ff98',
                        'Forest Green': '#228b22',
                        'Royal Blue': '#4169e1',
                        'Lime': '#00ff00',
                        'Fuchsia': '#ff00ff',
                        'Periwinkle': '#ccccff',
                        'Sand': '#c2b280',
                        'Taupe': '#483c32',
                        'Rust': '#b7410e',
                        'Slate': '#708090',
                        'Seafoam': '#93e9be',
                        'Mocha': '#967969',
                        'Berry': '#990f4b',
                        'Sunflower': '#ffda03',
                        'Mint Blue': '#429e9d',
                        'Dusty Rose': '#c08081',
                        'Terracotta': '#e2725b',
                        'Peacock': '#1b5e20',
                        'Eggplant': '#614051',
                        'Canary': '#ffff99',
                        'Coral Pink': '#f88379',
                        'Powder Blue': '#b0e0e6',
                        'Steel Blue': '#4682b4',
                        'Jade': '#00a86b',
                        'Mint Cream': '#f5fffa',
                        'Azure': '#007fff',
                        'Lemon': '#fff700',
                        'Apricot': '#fbceb1',
                        'Mauve': '#e0b0ff',
                        'Indigo': '#4b0082',
                        'Amber': '#ffbf00',
                        'Emerald Green': '#50c878',
                        'Rose': '#ff007f',
                        'Wine': '#722f37',
                        'Minty Green': '#98ff98',
                        'Pearl': '#eae0c8',
                        'Ivory White': '#fffff0',
                        'Off White': '#faf9f6',
                        'Light Blue': '#add8e6',
                        'Light Green': '#90ee90',
                        'Light Pink': '#ffb6c1',
                        'Light Yellow': '#ffffe0',
                        'Light Purple': '#b19cd9',
                        'Light Brown': '#a52a2a',
                        'Light Gray': '#d3d3d3',
                        'Dark Green': '#006400',
                        'Dark Blue': '#00008b',
                        'Dark Red': '#8b0000',
                        'Dark Purple': '#301934',
                        'Dark Brown': '#654321',
                        'Dark Gray': '#a9a9a9',
                        'Dark Orange': '#ff8c00',
                        'Dark Yellow': '#b5a42e',
                        'Dark Pink': '#e75480',
                        'Dark Gold': '#b8860b',
                        'Dark Navy': '#000080',
                        'Dark Olive': '#556b2f',
                        'Dark Teal': '#014d4e',
                        'Dark Coral': '#cd5b45',
                        'Dark Burgundy': '#4a0c25',
                        'Dark Maroon': '#3c1414',
                        'Dark Plum': '#580f41',
                        'Dark Rose': '#c08081',
                        'Dark Mint': '#367c2b',
                        'Dark Sage': '#59806a',
                        'Dark Champagne': '#c2b280',
                        'Dark Silver': '#a9a9a9',
                        'Dark Copper': '#7c482b',
                        'Dark Jade': '#006b3c',
                        'Dark Pearl': '#bfc1c2',
                        'Dark Ivory': '#eae0c8',
                        'Dark Off White': '#e5e4e2',
                        'Dark Lemon': '#bfcf00',
                        'Dark Apricot': '#cfa18d',
                        'Dark Mauve': '#915f6d',
                        'Dark Amber': '#bfa200',
                        'Dark Emerald': '#006400',
                        'Dark Wine': '#3c1414',
                        'Dark Minty Green': '#367c2b',
                        'Dark Pearl': '#bfc1c2',
                        'Dark Ivory White': '#eae0c8',
                        'Dark Off White': '#e5e4e2',
                        'Dark Light Blue': '#5f9ea0',
                        'Dark Light Green': '#228b22',
                        'Dark Light Pink': '#c08081',
                        'Dark Light Yellow': '#b5a42e',
                        'Dark Light Purple': '#301934',
                        'Dark Light Brown': '#654321',
                        'Dark Light Gray': '#a9a9a9'
                      };
                      colorHex = colorMap[colorName.trim()] || '';
                    } else {
                      colorName = '';
                      colorHex = '';
                    }
                    // Create enhanced color display with larger swatch and variations
                    const isOliveGreen = colorName === "Olive Green";
                    let html = `
                      <div class="color-display mb-4 col-md-6 ${isOliveGreen ? 'primary-color-container' : ''}">
                        <div class="main-color-swatch" style="display:inline-block;width:80px;height:80px;border-radius:8px;background:${colorHex ? colorHex : 'transparent'};border:2px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,0.1);" ${isOliveGreen ? 'title="Primary Wedding Color"' : ''}>
                        </div>
                        <h5 class="mt-2 mb-1" ${isOliveGreen ? 'title="Olive Green - Primary Wedding Color"' : ''}>${colorName}</h5>
                    `;
                    
                    // Add color variations if available
                    if (variations && variations.length > 0) {
                      html += `<div class="color-variations mb-3 mt-2">`;
                      variations.forEach(variation => {
                        html += `
                          <div class="variation-item" style="display:inline-block;margin:0 5px;">
                            <div style="display:inline-block;width:30px;height:30px;border-radius:4px;background:${variation.hex};border:1px solid #ccc;"></div>
                            <div class="small text-muted">${variation.name}</div>
                          </div>
                        `;
                      });
                      html += `</div>`;
                    }
                    
                    // Add example suggestions if available
                    if (examples && examples.length > 0) {
                      html += `<div class="color-examples small">
                        <p>Suggested items: ${examples.join(', ')}</p>
                      </div>`;
                    }
                    
                    html += `</div>`;
                    return html;
                  })
                  .join("")}
                
                <!-- Add an image example of the color -->
                <div class="color-guide mt-3">
                  <div class="row align-items-center">
                    <div class="col-12">
                      <div class="alert alert-light" role="alert">
                        <i class="bi bi-info-circle"></i> 
                        <strong>Tip:</strong> When shopping, look for colors labeled as Olive Green, Olive, Sage, or Military Green.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${content.virtualAttendance && content.virtualAttendance.enabled
        ? `<div class="col-lg-6 mb-4"><div class="card-custom h-100"><div class="card-body text-center"><i class="bi bi-laptop display-4 text-primary-custom mb-3"></i><h4 class="card-title">Virtual Attendance</h4><p>${content.virtualAttendance.description}</p><div class="mt-3"><a href="${content.virtualAttendance.link}" target="_blank" class="btn btn-primary-custom me-2"><i class="bi bi-camera-video"></i> Join Virtually</a><button class="btn btn-outline-custom copy-virtual-link" data-link="${content.virtualAttendance.link}"><i class="bi bi-clipboard"></i> Copy Link</button><span class="copy-confirmation ms-2 text-success" style="display:none; font-size:0.95em;"><i class="bi bi-check-circle"></i> Copied!</span></div></div></div></div>`
        : ''}
    </div>
  `;
}

// Helper function to generate form fields based on configuration
function createFormFields(fields) {
  if (!fields || !Array.isArray(fields)) return '';
  
  let html = '';
  fields.forEach(field => {
    const required = field.required ? 'required' : '';
    const fieldId = `field_${field.name}`;
    
    html += `<div class="mb-3">`;
    html += `<label for="${fieldId}" class="form-label">${field.label}</label>`;
    
    if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
      html += `<input type="${field.type}" class="form-control" id="${fieldId}" name="${field.name}" ${required}>`;
    } 
    else if (field.type === 'textarea') {
      html += `<textarea class="form-control" id="${fieldId}" name="${field.name}" rows="4" ${required}></textarea>`;
    }
    else if (field.type === 'select') {
      html += `<select class="form-select" id="${fieldId}" name="${field.name}" ${required}>`;
      html += `<option value="">Please select...</option>`;
      field.options.forEach(option => {
        html += `<option value="${option}">${option}</option>`;
      });
      html += `</select>`;
    }
    else if (field.type === 'radio') {
      field.options.forEach((option, index) => {
        html += `<div class="form-check">`;
        html += `<input class="form-check-input" type="radio" name="${field.name}" id="${fieldId}_${index}" value="${option}" ${index === 0 && required ? 'required' : ''}>`;
        html += `<label class="form-check-label" for="${fieldId}_${index}">${option}</label>`;
        html += `</div>`;
      });
    }
    html += `</div>`;
  });
  
  return html;
}
