// Dynamically build all main content sections except 'home'
function buildDynamicSections() {
  const container = document.getElementById("dynamic-sections");
  if (!container || !window.weddingData || !Array.isArray(weddingData.sections)) return;
  const sections = weddingData.sections.filter(
    (section) => section.id !== "home"
  );

  sections.forEach((section, index) => {
    // You may have a createSection function, or just use the content renderers directly
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
      case 'registry':
        html = createRegistryContent(section.content);
        break;
      case 'gallery':
        html = createGalleryContent(section.content);
        break;
      case 'extras':
        html = createExtrasContent(section.content);
        break;
      case 'scripture-theme':
        html = createScriptureThemeContent(section.content);
        break;
      case 'contact':
        html = createContactContent(section.content);
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

function createRegistryContent(content) {
  return `
        <div class="text-center mb-4">
            <p class="lead">${content.note}</p>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <h4 class="card-title"><i class="bi bi-gift"></i> Gift Registries</h4>
                        <div class="registry-buttons">
                            ${content.registries
                              .map(
                                (registry) =>
                                  `<div class="mb-3"><a href="${registry.url}" target="_blank" class="btn btn-outline-custom btn-lg"><i class="bi bi-box-seam"></i> ${registry.store} Registry</a></div>`
                              )
                              .join("")}
                        </div>
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
  return `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <h4 class="card-title mb-4">Please respond by ${content.deadline}</h4>
                        <p class="mb-4">We're so excited to celebrate with you! Please let us know if you'll be joining us.</p>
                        <a href="rsvp.html" class="btn btn-primary-custom btn-lg"><i class="bi bi-heart-fill"></i> Complete RSVP Form</a>
                        <p class="mt-3 text-muted"><small>The RSVP form includes meal preferences and special requests</small></p>
                    </div>
                </div>
            </div>
        </div>
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
                        <h4 class="card-title text-center"><i class="bi bi-palette2"></i> ${
                          content.theme.name
                        }</h4>
                        <p class="text-center">${content.theme.description}</p>
                        <h6 class="mt-4">Color Palette:</h6>
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
  // Spotify Playlist Section
  if (
    content.playlist &&
    content.playlist.spotify &&
    content.playlist.spotify.url
  ) {
    html += '<div class="row mt-4">';
    html += '<div class="col-12">';
    html += '<div class="card-custom">';
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
    html += "</div></div></div></div>";
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
      <div class="col-12">
        <div class="card-custom">
          <div class="card-body">
            <h4 class="card-title text-center"><i class="bi bi-palette"></i> Dress Code</h4>
            <div class="text-center">
              <p class="mb-3">${content.dressCode.description}</p>
              <div class="color-palette">
                ${content.dressCode.colors
                  .map((color) => `<span class="color-chip">${color}</span>`)
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${
      content.virtualAttendance && content.virtualAttendance.enabled
        ? `<div class="row mt-4"><div class="col-12"><div class="card-custom"><div class="card-body text-center"><i class="bi bi-laptop display-4 text-primary-custom mb-3"></i><h4 class="card-title">Virtual Attendance</h4><p>${content.virtualAttendance.description}</p><a href="${content.virtualAttendance.link}" target="_blank" class="btn btn-primary-custom"><i class="bi bi-camera-video"></i> Join Virtually</a></div></div></div></div>`
        : ""
    }
  `;
}
