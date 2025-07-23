// Dynamically build all main content sections except 'home'
function buildDynamicSections() {
  const container = document.getElementById("dynamic-sections");
  if (!container || !window.weddingData || !Array.isArray(weddingData.sections)) return;
  const sections = weddingData.sections.filter(
    (section) => section.id !== "home"
  );


  sections.forEach((section, index) => {
    let html = '';
    switch (section.id) {
      case 'our-story':
        html = createOurStoryContent(section.content);
        break;
      case 'wedding-party':
        html = createWeddingPartyContent(section.content);
        break;
      case 'wedding-details':
        html = createWeddingDetailsContent(section.content);
        break;
      case 'travel':
        html = createTravelContent(section.content);
        break;
      case 'schedule':
        html = createScheduleContent(section.content);
        break;
      case 'gallery':
        html = createGalleryContent(section.content);
        break;
      case 'extras':
        html = createExtrasContent(section.content);
        break;
      case 'rsvp':
        html = createRSVPContent(section.content);
        break;
      case 'scripture-theme':
        html = createScriptureThemeContent(section.content);
        break;
      case 'contact':
        html = createContactContent(section.content);
        break;
      case 'qr-code':
        html = createQRCodeContent(section.content);
        break;
      default:
        html = '';
    }
    const sectionDiv = document.createElement('section');
    sectionDiv.id = section.id;
    sectionDiv.className = `section ${index % 2 === 1 ? 'section-alternate' : ''}`;
    sectionDiv.innerHTML = html;
    container.appendChild(sectionDiv);
  });
// QR Code Section Renderer
function createQRCodeContent(content) {
  if (!content || !content.enabled) return '';
  // Find virtual guest/live stream info from extras if available
  let virtualGuestCard = '';
  if (window.weddingData && Array.isArray(window.weddingData.sections)) {
    const extrasSection = window.weddingData.sections.find(s => s.id === 'extras');
    if (extrasSection && extrasSection.content && extrasSection.content.liveStream && extrasSection.content.liveStream.enabled) {
      const ls = extrasSection.content.liveStream;
      virtualGuestCard = `
        <div class="col-lg-6 col-md-8 mb-4 d-flex align-items-stretch">
          <div class="card-custom text-center w-100 d-flex flex-column h-100">
            <div class="card-body d-flex flex-column justify-content-center h-100">
              <i class="bi bi-broadcast display-4 text-primary-custom mb-3"></i>
              <h4 class="card-title">Virtual Guest?</h4>
              <p>${ls.description || ''}</p>
              ${ls.backupPlatform ? `<p><strong>Backup:</strong> ${ls.backupPlatform}</p>` : ''}
              <div class="mt-3">
                <a href="${ls.link}" target="_blank" class="btn btn-primary-custom me-2"><i class="bi bi-play-circle"></i> Join via Zoom</a>
                <button class="btn btn-outline-custom copy-livestream-link" data-link="${ls.link}"><i class="bi bi-clipboard"></i> Copy Link</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
  // Only render the Virtual Guest? card beside the QR code card, never above
  return `
    <div class="row justify-content-center d-flex align-items-stretch">
      <div class="col-lg-6 col-md-8 mb-4 d-flex align-items-stretch">
        <div class="card-custom text-center w-100 d-flex flex-column h-100">
          <div class="card-body d-flex flex-column justify-content-center h-100">
            <h4 class="card-title mb-3"><i class="bi bi-qr-code"></i> Scan to Visit Our Website</h4>
            <img src="${content.image}" alt="QR Code" class="img-fluid mb-3" style="max-width: 220px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
            <p class="mb-2">${content.description || ''}</p>
            <div class="mb-3">
              <button class="btn btn-primary-custom btn-share-qr" data-link="${content.url}"><i class="bi bi-share"></i> Share</button>
              <button class="btn btn-outline-custom ms-2 copy-qr-link" data-link="${content.url}"><i class="bi bi-clipboard"></i> Copy Link</button>
            </div>
          </div>
        </div>
      </div>
      ${virtualGuestCard}
    </div>
    <script>
      document.querySelectorAll('.btn-share-qr').forEach(btn => {
        btn.addEventListener('click', function() {
          const url = this.getAttribute('data-link');
          const shareData = {
            title: document.title || 'Beauty & Femi 2025 Wedding',
            text: 'Join us for Beauty & Femi\'s wedding!',
            url: url
          };
          if (navigator.share) {
            navigator.share(shareData).catch(() => {});
          } else if (window.copyToClipboard) {
            window.copyToClipboard(url);
            if (window.showNotification) window.showNotification('Link copied to clipboard!');
          } else {
            navigator.clipboard.writeText(url);
            if (window.showNotification) window.showNotification('Link copied to clipboard!');
          }
        });
      });
      document.querySelectorAll('.copy-qr-link').forEach(btn => {
        btn.addEventListener('click', function() {
          if (window.copyToClipboard) {
            window.copyToClipboard(this.getAttribute('data-link'));
          } else {
            navigator.clipboard.writeText(this.getAttribute('data-link'));
          }
          if (window.showNotification) {
            window.showNotification('Link copied to clipboard!');
          }
        });
      });
      document.querySelectorAll('.copy-livestream-link').forEach(btn => {
        btn.addEventListener('click', function() {
          if (window.copyToClipboard) {
            window.copyToClipboard(this.getAttribute('data-link'));
          } else {
            navigator.clipboard.writeText(this.getAttribute('data-link'));
          }
          if (window.showNotification) {
            window.showNotification('Link copied to clipboard!');
          }
        });
      });
    </script>
  `;
}

  // Initialize gallery handlers after sections are built
  setTimeout(() => {
    if (typeof initializeGalleryHandlers === 'function') {
      initializeGalleryHandlers();
    }
  }, 100);
}

// Expose globally for use in init.js
window.buildDynamicSections = buildDynamicSections;
function createWeddingPartyContent(content) {
  return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom text-center">
                    <div class="card-body">
                        <div class="portrait-container">
                            <img src="${content.bride.photo}" alt="${
    content.bride.name
  }" class="portrait-image" id="bride-portrait">
                            <button class="portrait-toggle" onclick="togglePortraitView('bride-portrait')" title="Toggle full/cropped view">
                                <i class="bi bi-aspect-ratio"></i>
                            </button>
                        </div>
                        <h4 class="card-title">${content.bride.fullName}</h4>
                        <p class="text-primary-custom">The Bride</p>
                        <p>${content.bride.bio}</p>
                        <div class="fun-facts">
                            <h6>Fun Facts:</h6>
                            ${content.bride.funFacts
                              .map(
                                (fact) =>
                                  `<span class="badge bg-accent-1 me-1">${fact}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom text-center">
                    <div class="card-body">
                        <div class="portrait-container">
                            <img src="${content.groom.photo}" alt="${
    content.groom.name
  }" class="portrait-image" id="groom-portrait">
                            <button class="portrait-toggle" onclick="togglePortraitView('groom-portrait')" title="Toggle full/cropped view">
                                <i class="bi bi-aspect-ratio"></i>
                            </button>
                        </div>
                        <h4 class="card-title">${content.groom.fullName}</h4>
                        <p class="text-primary-custom">The Groom</p>
                        <p>${content.groom.bio}</p>
                        <div class="fun-facts">
                            <h6>Fun Facts:</h6>
                            ${content.groom.funFacts
                              .map(
                                (fact) =>
                                  `<span class="badge bg-accent-1 me-1">${fact}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createTravelContent(content) {
  return `
        <div class="row">
            <div class="col-lg-4 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-airplane"></i> Getting There</h4>
                        ${content.airports
                          .map(
                            (airport) =>
                              `<div class="mb-3"><h6>${airport.name} (${airport.code})</h6><p class="text-muted">${airport.distance}</p></div>`
                          )
                          .join("")}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-building"></i> Accommodations</h4>
                        ${content.hotels
                          .map(
                            (hotel) =>
                              `<div class="mb-3"><h6>${
                                hotel.name
                              }</h6><p class="text-muted small">${
                                hotel.address
                              }</p><p class="small">Phone: ${hotel.phone}</p>${
                                hotel.specialRate
                                  ? `<span class="badge bg-primary-custom">Special Rate Available</span>`
                                  : ""
                              }${
                                hotel.bookingCode
                                  ? `<p class="small mt-2"><strong>Booking Code:</strong> ${hotel.bookingCode}</p>`
                                  : ""
                              }</div>`
                          )
                          .join("")}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-car-front"></i> Transportation</h4>
                        <p><strong>Shuttle:</strong> ${
                          content.transportation.shuttle.description
                        }</p>
                        <p><strong>Ride Share:</strong> ${
                          content.transportation.rideshare
                        }</p>
                        <p><strong>Parking:</strong> ${
                          content.transportation.parking
                        }</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card-custom">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-lightbulb"></i> Local Tips</h4>
                        <ul class="list-unstyled">
                            ${content.localTips
                              .map(
                                (tip) =>
                                  `<li><i class="bi bi-check-circle text-primary-custom"></i> ${tip}</li>`
                              )
                              .join("")}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function createGalleryContent(content) {
  return `
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
        <div class="row">
            <div class="col-lg-8 mx-auto">
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
  return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-book display-4 text-primary-custom mb-3"></i>
                        <h4 class="card-title">Our Scripture</h4>
                        <blockquote class="blockquote"><p class="lead">"${
                          content.scripture.verse
                        }"</p><footer class="blockquote-footer">${
    content.scripture.reference
  }</footer></blockquote>
                        <p class="mt-3">${content.scripture.significance}</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title text-center"><i class="bi bi-palette2"></i> Color Palette</h4>
                        <div class="color-palette-display">
                            ${content.colorPalette
                              .map(
                                (color) =>
                                  `<div class="color-item"><div class="color-swatch" style="background-color: ${color.hex}"></div><div class="color-info"><strong>${color.name}</strong><p class="small text-muted">${color.meaning}</p></div></div>`
                              )
                              .join("")}
                        </div>
                        <h6 class="mt-4">Cultural Elements:</h6>
                        <ul class="list-unstyled">${content.culturalElements
                          .map(
                            (element) =>
                              `<li><i class="bi bi-star text-primary-custom"></i> ${element}</li>`
                          )
                          .join("")}</ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createContactContent(content) {
  return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-people"></i> Contact Information</h4>
                        <div class="contact-item mb-3"><h6>The Happy Couple</h6><p><i class="bi bi-envelope"></i> ${
                          content.couple.email
                        }</p><p><i class="bi bi-telephone"></i> ${
    content.couple.phone
  }</p></div>
                        <div class="contact-item mb-3"><h6>Wedding Planner</h6><p><strong>${
                          content.weddingPlanner.name
                        }</strong></p><p>${
    content.weddingPlanner.contact
  }</p><p><i class="bi bi-envelope"></i> ${
    content.weddingPlanner.email
  }</p><p><i class="bi bi-telephone"></i> ${
    content.weddingPlanner.phone
  }</p></div>
                        <div class="contact-item"><h6>Emergency Contact</h6><p><strong>${
                          content.emergencyContact.name
                        }</strong></p><p><i class="bi bi-telephone"></i> ${
    content.emergencyContact.phone
  }</p></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-chat-dots"></i> Send us a Message</h4>
                        <form class="form-custom" action="${
                          content.form.action
                        }" method="${
    content.form.method
  }" onsubmit="handleFormSubmission(event, 'contact')">
                            <input type="hidden" name="_subject" value="Wedding Website Contact Form">
                            <input type="hidden" name="_next" value="${
                              window.location.origin
                            }/index.html#contact">
                            ${content.form.fields
                              .map((field) =>
                                field.type === "textarea"
                                  ? `<div class="mb-3"><label for="${
                                      field.name
                                    }" class="form-label">${
                                      field.label
                                    }</label><textarea class="form-control" id="${
                                      field.name
                                    }" name="${field.name}" rows="4" ${
                                      field.required ? "required" : ""
                                    }></textarea></div>`
                                  : `<div class="mb-3"><label for="${
                                      field.name
                                    }" class="form-label">${
                                      field.label
                                    }</label><input type="${
                                      field.type
                                    }" class="form-control" id="${
                                      field.name
                                    }" name="${field.name}" ${
                                      field.required ? "required" : ""
                                    }></div>`
                              )
                              .join("")}
                            <button type="submit" class="btn btn-primary-custom w-100"><i class="bi bi-send"></i> Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createExtrasContent(content) {
  let html = "";
  // Spotify Playlist + QR Code Side by Side (Desktop)
  // Always render both columns as siblings for flex layout
  const hasPlaylist = content.playlist && content.playlist.spotify && content.playlist.spotify.url;
  const hasQR = content.qrCode && content.qrCode.enabled;
  if (hasPlaylist || hasQR) {
    html += '<div class="playlist-qr-flex mt-4">';
    // Playlist column
    html += '<div class="playlist-col">';
    if (hasPlaylist) {
      html += '<div class="card-custom h-100">';
      html += '<div class="card-body text-center">';
      html += `<h4 class="card-title">${
        content.playlist.title || "Our Love Story in Songs"
      }</h4>`;
      let embedUrl = content.playlist.spotify.url;
      if (embedUrl.includes("open.spotify.com/playlist/")) {
        embedUrl = embedUrl.replace(
          "open.spotify.com/playlist/",
          "open.spotify.com/embed/playlist/"
        );
      }
      html += `<div class="spotify-embed mb-3"><iframe src="${embedUrl}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;
      if (content.playlist.songs && Array.isArray(content.playlist.songs)) {
        html += '<ul class="playlist-songs">';
        content.playlist.songs.forEach((song) => {
          html += `<li><strong>${song.title}</strong> by ${song.artist}`;
          if (song.significance)
            html += ` <span class="song-significance">(${song.significance})</span>`;
          html += "</li>";
        });
        html += "</ul>";
      }
      html += "</div></div>";
    }
    html += '</div>';
    // QR code column
    html += '<div class="qr-col">';
    if (hasQR) {
      const qr = content.qrCode;
      html += '<div class="card-custom h-100 d-flex flex-column align-items-center justify-content-center">';
      html += '<div class="card-body text-center">';
      html += `<h4 class="card-title mb-3"><i class="bi bi-qr-code"></i> Scan to Visit</h4>`;
      html += `<img src="${qr.image}" alt="QR Code" class="img-fluid mb-3" style="max-width: 220px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">`;
      html += `<p class="mb-2">${qr.description || ''}</p>`;
      html += `<div class="mb-3">`;
      html += `<button class="btn btn-primary-custom btn-share-qr" data-link="${qr.url}"><i class="bi bi-share"></i> Share</button>`;
      html += `<button class="btn btn-outline-custom ms-2 copy-qr-link" data-link="${qr.url}"><i class="bi bi-clipboard"></i> Copy Link</button>`;
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
    html +=
      '<i class="bi bi-broadcast display-4 text-primary-custom mb-3"></i>';
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
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-heart"></i> ${
                          content.howWeMet.title
                        }</h4>
                        <p class="text-muted"><i class="bi bi-geo-alt"></i> ${
                          content.howWeMet.location
                        } • ${content.howWeMet.date}</p>
                        <p>${content.howWeMet.story}</p>
                        <button class="btn btn-primary-custom btn-sm mt-2" onclick="openStoryPopup('howWeMet')">
                            <i class="bi bi-book"></i> Read More
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-gem"></i> ${
                          content.proposal.title
                        }</h4>
                        <p class="text-muted"><i class="bi bi-geo-alt"></i> ${
                          content.proposal.location
                        } • ${content.proposal.date}</p>
                        <p>${content.proposal.story}</p>
                        <button class="btn btn-primary-custom btn-sm mt-2" onclick="openStoryPopup('proposal')">
                            <i class="bi bi-gem"></i> Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-12">
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
    `;
}

function createWeddingDetailsContent(content) {
  return `
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
            <button class="btn btn-outline-custom" onclick="openMap(${
              content.ceremony.venue.coordinates.lat
            }, ${content.ceremony.venue.coordinates.lng})">
              <i class="bi bi-map"></i> Get Directions
            </button>
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
            <button class="btn btn-outline-custom" onclick="openMap(${
              content.reception.venue.coordinates.lat
            }, ${content.reception.venue.coordinates.lng})">
              <i class="bi bi-map"></i> Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-6 mb-4">
        <div class="card-custom h-100">
          <div class="card-body">
            <h4 class="card-title text-center"><i class="bi bi-palette"></i> Dress Code</h4>
            <div class="text-center">
              <p class="mb-3">${content.dressCode.description}</p>
              <div class="color-palette">
                ${content.dressCode.colors
                  .map((color) => {
                    // Support both string and object for color
                    let colorName, colorHex;
                    if (typeof color === 'object' && color !== null) {
                      colorName = color.name || '';
                      colorHex = color.hex || '';
                    } else if (typeof color === 'string') {
                      colorName = color;
                      // Try to guess hex for common color names (fallback: no swatch)
                      const colorMap = {
                        'Olive Green': '#808000',
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
                    return `<span class="color-chip" style="display:inline-flex;align-items:center;margin-right:8px;">
                      <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${colorHex ? colorHex : 'transparent'};border:1px solid #ccc;margin-right:6px;"></span>
                      <span>${colorName}</span>
                    </span>`;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
      ${
        content.virtualAttendance && content.virtualAttendance.enabled
          ? `<div class="col-lg-6 mb-4"><div class="card-custom h-100"><div class="card-body text-center"><i class="bi bi-laptop display-4 text-primary-custom mb-3"></i><h4 class="card-title">Virtual Attendance</h4><p>${content.virtualAttendance.description}</p><a href="${content.virtualAttendance.link}" target="_blank" class="btn btn-primary-custom"><i class="bi bi-camera-video"></i> Join Virtually</a></div></div></div>`
          : ''
      }
    </div>
  `;
}
