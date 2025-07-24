// Dynamically build all main content sections except 'home'
function buildDynamicSections() {
  if (!window.weddingData || !Array.isArray(weddingData.sections)) return '';
  // Map section type to renderer function
  const sectionRenderers = {
    'wedding-details': createWeddingDetailsContent,
    'gallery': createGalleryContent,
    'rsvp': createRSVPContent,
    'schedule': createScheduleContent,
    'scripture-theme': createScriptureThemeContent,
    'contact': createContactContent,
    'extras': createExtrasContent,
    'our-story': createOurStoryContent,
    'wedding_party': createWeddingPartyContent
    // Add more mappings as needed
  };

  // Build HTML for each section in order
  return window.weddingData.sections
    .filter(section => section.id !== 'home')
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
}

// Meet the Couple / Wedding Party section renderer
function createWeddingPartyContent(content) {
  return `
    <h2 class="section-title text-center mb-4">Meet the Couple</h2>
    <div class="row">
      <div class="col-12 mb-4">
        <div class="card-custom h-100">
          <div class="card-body">
            <div class="couple-container">
              <div class="couple-bride">
                <img src="${content.bride.photo}" alt="${content.bride.fullName}" class="img-fluid rounded mb-3" style="width: 230px; height: auto; max-height: 300px;">
                <h4 class="card-title">${content.bride.fullName}</h4>
                <p class="text-muted">Bride</p>
                <p>${content.bride.bio}</p>
                <ul class="list-unstyled">
                  ${content.bride.funFacts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
              </div>
              
              <div class="couple-love">
                <div class="heart-container">
                  <div class="heart-icon">💗</div>
                  <div class="heart-pulse"></div>
                </div>
              </div>
              
              <div class="couple-groom">
                <img src="${content.groom.photo}" alt="${content.groom.fullName}" class="img-fluid rounded mb-3" style="width: 230px; height: auto; max-height: 300px;">
                <h4 class="card-title">${content.groom.fullName}</h4>
                <p class="text-muted">Groom</p>
                <p>${content.groom.bio}</p>
                <ul class="list-unstyled">
                  ${content.groom.funFacts.map(fact => `<li>${fact}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="card-custom">
          <div class="card-body">
            <h4 class="card-title text-center mb-4">Bridal Party</h4>
            
            <!-- Bridal Party with border -->
            <div class="wedding-party-container bridal-party-border mb-5">
              <div class="row">
                ${content.bridesmaids.map(bm => `
                  <div class="col-md-4 mb-3">
                    <div class="card-custom h-100 text-center">
                      <div class="card-body">
                        <img src="${bm.photo}" alt="${bm.name}" class="img-fluid rounded-circle mb-2" style="max-width: 100px;">
                        <h6>${bm.name}</h6>
                        <p class="text-muted small">${bm.relationship}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <h4 class="card-title text-center mb-4">Groomsmen</h4>
            
            <!-- Groomsmen with border -->
            <div class="wedding-party-container groomsmen-border">
              <div class="row">
                ${content.groomsmen.map(gm => `
                  <div class="col-md-4 mb-3">
                    <div class="card-custom h-100 text-center">
                      <div class="card-body">
                        <img src="${gm.photo}" alt="${gm.name}" class="img-fluid rounded-circle mb-2" style="max-width: 100px;">
                        <h6>${gm.name}</h6>
                        <p class="text-muted small">${gm.relationship}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


function createGalleryContent(content) {
  return `
        <h2 class="section-title text-center mb-4">Gallery</h2>
        <div class="row">
            <div class="col-12 mb-4">
                <h3 class="text-center">Portraits</h3>
                <div class="row">
                    ${content.portraitPhotos
                      .map(
                        (photo, index) =>
                          `<div class="col-md-6 col-lg-4 mb-3"><div class="gallery-item" data-index="${index}"><img src="${photo.src}" alt="${photo.caption}" class="img-fluid rounded-custom" data-lightbox-src="${photo.src}" data-lightbox-caption="${photo.caption}"><p class="text-center mt-2 small">${photo.caption}</p></div></div>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 mb-4">
                <h3 class="text-center">A beautiful garden</h3>
                <div class="row">
                    ${content.throwbackPhotos
                      .map(
                        (photo, index) =>
                          `<div class="col-md-6 col-lg-4 mb-3"><div class="gallery-item" data-index="${
                            index + content.portraitPhotos.length
                          }"><img src="${photo.src}" alt="${
                            photo.caption
                          }" class="img-fluid rounded-custom" data-lightbox-src="${
                            photo.src
                          }" data-lightbox-caption="${
                            photo.caption
                          }"><p class="text-center mt-2 small">${
                            photo.caption
                          }</p></div></div>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
        <div class="text-center mt-4">
            <a href="gallery.html" class="btn btn-primary-custom"><i class="bi bi-images"></i> View Full Gallery</a>
        </div>
    `;
}

function createRSVPContent(content) {
  // Build form fields dynamically from JSON config
  const formFields = content.form.fields.map(field => {
    let input = '';
    const required = field.required ? 'required' : '';
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        input = `<input type="${field.type}" class="form-control" id="${field.name}" name="${field.name}" ${required}
          ${field.min !== undefined ? `min=\"${field.min}\"` : ''}
          ${field.max !== undefined ? `max=\"${field.max}\"` : ''}
        >`;
        break;
      case 'radio':
        input = field.options.map((opt, i) => `
          <div class="form-check form-check-custom">
            <input class="form-check-input" type="radio" name="${field.name}" id="${field.name}_${i}" value="${opt}" ${required}>
            <label class="form-check-label" for="${field.name}_${i}">${opt}</label>
          </div>
        `).join('');
        break;
      case 'select':
        input = `<select class="form-control" id="${field.name}" name="${field.name}" ${required}>
          <option value="">Select...</option>
          ${field.options.map(opt => `<option value=\"${opt}\">${opt}</option>`).join('')}
        </select>`;
        break;
      case 'textarea':
        input = `<textarea class="form-control" id="${field.name}" name="${field.name}" rows="3" ${required}></textarea>`;
        break;
      default:
        input = '';
    }
    return `
      <div class="mb-3">
        <label for="${field.name}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
        ${input}
      </div>
    `;
  }).join('');

  return `
    <h2 class="section-title text-center mb-4">RSVP</h2>
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card-custom">
          <div class="card-body">
            <h4 class="card-title mb-4">Please respond by ${content.deadline}</h4>
            <form id="rsvpForm" class="form-custom" action="${content.form.action}" method="${content.form.method}">
              ${formFields}
              <button type="submit" class="btn btn-primary-custom btn-lg mt-3"><i class="bi bi-heart-fill"></i> Submit RSVP</button>
            </form>
            <div id="rsvpConfirmation" class="alert alert-success mt-4" style="display:none;">${content.confirmationMessage || 'Thank you for your RSVP!'}</div>
          </div>
        </div>
      </div>
    </div>
    <script>
      (function() {
        var form = document.getElementById('rsvpForm');
        if (form) {
          form.onsubmit = function(e) {
            e.preventDefault();
            var formData = new FormData(form);
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
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
                document.getElementById('rsvpConfirmation').style.display = 'block';
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
          };
        }
      })();
    </script>
  `;
}

function createScheduleContent(content) {
  return `
    <h2 class="section-title text-center mb-4">Schedule</h2>
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card-custom">
          <div class="card-body">
            <h3 class="text-center mb-4">Wedding Day Timeline</h3>
            <div class="timeline-schedule">
              ${content.weddingDay
                .map(
                  (event) =>
                    `<div class="schedule-item"><div class="schedule-time">${event.time}</div><div class="schedule-content"><h5>${event.event}</h5><p class="text-muted">${event.location}</p><p>${event.description}</p></div></div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
    ${
      content.preWeddingEvents.length > 0
        ? `<div class="row mt-5"><div class="col-12"><h3 class="text-center mb-4">Pre-Wedding Events</h3><div class="row">${content.preWeddingEvents
            .map(
              (event) =>
                `<div class="col-md-6 mb-3"><div class="card-custom"><div class="card-body"><h5>${event.event}</h5><p class="text-muted">${event.date} at ${event.time}</p><p class="text-muted">${event.location}</p><p>${event.description}</p></div></div></div>`
            )
            .join("")}</div></div></div>`
        : ""
    }
  `;
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
              <p><i class="bi bi-envelope"></i> ${content.contact.plannerEmail}</p>
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
    
    // Guest Message column
    html += '<div class="message-col">';
    if (hasGuestMessage) {
      html += '<div class="card-custom h-100">';
      html += '<div class="card-body text-center">';
      html += `<h4 class="card-title">${
        content.guestMessage.title || "Leave a Message for the Couple"
      }</h4>`;
      html += `<p class="mb-3">${content.guestMessage.description || "Share your thoughts and well wishes for our journey together."}</p>`;
      // Generate unique IDs for the form and messages to prevent conflicts
      const guestFormId = `guestMessageForm_${Math.floor(Math.random() * 10000)}`;
      const guestSuccessId = `guestMessageSuccess_${Math.floor(Math.random() * 10000)}`;
      const guestErrorId = `guestMessageError_${Math.floor(Math.random() * 10000)}`;
      
      // Generate a hidden iframe ID for form submission
      const iframeId = `hidden_iframe_${Math.floor(Math.random() * 10000)}`;
      
      html += `<div class="guest-message mb-3" id="guestMessageContainer_${Math.floor(Math.random() * 10000)}">
        <form id="${guestFormId}" action="https://formspree.io/f/${content.guestMessage.formspreeId}" method="POST" onsubmit="setTimeout(function() { window.showGuestMessageSuccess('${guestFormId}', '${guestSuccessId}'); }, 1500); return true;" target="${iframeId}" class="guest-message-form">
          ${createFormFields(content.guestMessage.form.fields)}
          <input type="hidden" name="_next" value="javascript:void(0)" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_format" value="plain" />
          <button type="submit" class="btn btn-primary-custom mt-3">${content.guestMessage.form.submitText || 'Send Message'}</button>
        </form>
        <iframe name="${iframeId}" id="${iframeId}" style="display:none;"></iframe>
        <div id="${guestSuccessId}" class="thank-you-message" style="display:none;">
          <div class="thank-you-content">
            <i class="bi bi-heart-fill text-primary-custom mb-3" style="font-size: 2.5rem;"></i>
            <h4>${content.guestMessage.successMessage || 'Thank you for your blessing!'}</h4>
            <p>Your message means the world to us.</p>
            <div class="celebration-icon mt-3">
              <i class="bi bi-emoji-smile-fill" style="color: #D8E460; font-size: 1.5rem;"></i>
            </div>
          </div>
        </div>
        <div id="${guestErrorId}" class="error-message" style="display:none;">
          <div class="error-content">
            <i class="bi bi-exclamation-circle text-danger mb-3" style="font-size: 2rem;"></i>
            <h4>${content.guestMessage.errorMessage || 'There was an error submitting your message.'}</h4>
            <p>Please try again or contact us directly.</p>
            <button class="btn btn-outline-primary-custom mt-3" onclick="document.getElementById('${guestFormId}').style.display='block'; document.getElementById('${guestErrorId}').style.display='none';">Try Again</button>
          </div>
        </div>
      </div>`;
      
      // The iframe is now added in the form HTML
      
      // Add the script with correct IDs after HTML is added to the DOM
      html += `<script>
        // Define a function to initialize the form on page load
        function initGuestMessageForm_${Math.floor(Math.random() * 10000)}() {
          console.log('%c⚡ Initializing guest message form', 'background: #D8E460; color: black; padding: 4px; font-weight: bold;');
          
          // Find all the elements by their IDs
          const form = document.getElementById('${guestFormId}');
          const successMessage = document.getElementById('${guestSuccessId}');
          const errorMessage = document.getElementById('${guestErrorId}');
          const iframe = document.getElementById('${iframeId}');
          
          // Debug what we found
          console.log('Form:', form);
          console.log('Success message:', successMessage);
          console.log('Error message:', errorMessage);
          
          if (form && successMessage) {
            console.log('%c✅ Form and success message found', 'color: green; font-weight: bold;');
            
            // Double check the form target is set to the iframe
            form.setAttribute('target', '${iframeId}');
            
            // Handle form submission - use a named function to avoid scope issues
            function handleSubmit(e) {
              console.log('🔄 Form submission started');
              
              // Get the submit button
              const submitBtn = form.querySelector('button[type="submit"]');
              const originalText = submitBtn.innerHTML;
              submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
              submitBtn.disabled = true;
              
              // Set a timer to show the success message
              window.setTimeout(function() {
                console.log('Showing success message now');
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Force styles to ensure visibility
                successMessage.setAttribute('style', 'display: block !important; opacity: 1 !important;');
                
                // Add the animation class
                successMessage.classList.add('animate-in');
                
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Reset the form for future use
                form.reset();
              }, 2000);
            }
            
            // Add the event handler
            form.addEventListener('submit', handleSubmit);
            
            // Add error handling button functionality
            const tryAgainBtn = errorMessage?.querySelector('button');
            if (tryAgainBtn) {
              tryAgainBtn.addEventListener('click', function() {
                form.style.display = 'block';
                errorMessage.style.display = 'none';
                form.reset();
              });
            }
          } else {
            console.error('❌ Could not find form or success message elements!');
          }
        }
        
        // Run the initialization function when the page is loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          setTimeout(initGuestMessageForm_${Math.floor(Math.random() * 10000)}, 100);
        } else {
          document.addEventListener('DOMContentLoaded', initGuestMessageForm_${Math.floor(Math.random() * 10000)});
        }
      </script>`;
      html += "</div></div>";
    }
    html += '</div>';
    
    // QR code column
    html += '<div class="qr-col">';
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
    <div class="row mt-5">
      <div class="col-12">
        <div class="card-custom">
          <div class="card-body">
            <h3 class="text-center mb-4">Our Journey Together</h3>
            <div class="timeline">
              ${content.timeline
                .map(
                  (item) => `
                    <div class="timeline-item">
                      <div class="timeline-date">${item.date}</div>
                      <div class="timeline-content">
                        <h5>${item.event}</h5>
                        <p>${item.description}</p>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
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
              <div class="color-palette row">
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
                    let html = `
                      <div class="color-display mb-4 col-md-6">
                        <div class="main-color-swatch" style="display:inline-block;width:80px;height:80px;border-radius:8px;background:${colorHex ? colorHex : 'transparent'};border:2px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        </div>
                        <h5 class="mt-2 mb-1">${colorName}</h5>
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
