// Global variables
let weddingData = {};
let colorData = {};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
async function initializeWebsite() {
    try {
        // Load JSON data
        await loadData();
        
        // Load couple photo from JSON
        loadCouplePhoto();
        
        // Apply color theme
        applyColorTheme();
        
        // Build navigation
        buildNavigation();
        
        // Build dynamic sections
        buildDynamicSections();
        
        // Initialize components
        initializeCountdown();
        initializeScrollEffects();
        initializeFloatingActions();
        initializeAnimations();
        
        // Hide loading screen
        hideLoadingScreen();
        
    } catch (error) {
        console.error('Error initializing website:', error);
        hideLoadingScreen();
    }
}

// Load JSON data
async function loadData() {
    try {
        const [weddingResponse, colorResponse] = await Promise.all([
            fetch('./json/wedding_outline.json'),
            fetch('./json/colors.json')
        ]);
        
        weddingData = await weddingResponse.json();
        colorData = await colorResponse.json();
        
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Helper function to convert Spotify URL to embed URL
function getSpotifyEmbedUrl(spotifyUrl) {
    // Extract the playlist ID from the Spotify URL
    // URL format: https://open.spotify.com/playlist/5R2cCAyWGRyR3sOkuLCNdp?si=...
    const playlistMatch = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) {
        const playlistId = playlistMatch[1];
        return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    }
    
    // Fallback to original URL if pattern doesn't match
    return spotifyUrl;
}

// Apply color theme from colors.json
function applyColorTheme() {
    const root = document.documentElement;
    const cssVariables = colorData.cssVariables[':root'];
    
    Object.entries(cssVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

// Build navigation from JSON data
function buildNavigation() {
    const navbarMenu = document.getElementById('navbarMenu');
    const navigation = weddingData.navigation;
    
    navigation.items.forEach(item => {
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        
        const navLink = document.createElement('a');
        navLink.className = 'nav-link';
        navLink.href = `#${item.id}`;
        navLink.innerHTML = `${item.icon} ${item.label}`;
        
        navItem.appendChild(navLink);
        navbarMenu.appendChild(navItem);
    });
    
    // Add RSVP link to separate page
    const rsvpItem = document.createElement('li');
    rsvpItem.className = 'nav-item';
    const rsvpLink = document.createElement('a');
    rsvpLink.className = 'nav-link btn btn-primary-custom ms-2';
    rsvpLink.href = 'rsvp.html';
    rsvpLink.innerHTML = '<i class="bi bi-heart-fill"></i> RSVP';
    rsvpItem.appendChild(rsvpLink);
    navbarMenu.appendChild(rsvpItem);
}

// Build dynamic sections
function buildDynamicSections() {
    const container = document.getElementById('dynamic-sections');
    const sections = weddingData.sections.filter(section => section.id !== 'home');
    
    sections.forEach((section, index) => {
        const sectionElement = createSection(section, index);
        container.appendChild(sectionElement);
    });
    
    // Initialize gallery handlers after sections are built
    setTimeout(() => {
        initializeGalleryHandlers();
    }, 100);
}

// Create individual sections
function createSection(section, index) {
    const sectionDiv = document.createElement('section');
    sectionDiv.id = section.id;
    sectionDiv.className = `section ${index % 2 === 1 ? 'section-alternate' : ''}`;
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // Section header
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
        <h2 class="section-title">${section.icon} ${section.title}</h2>
    `;
    container.appendChild(header);
    
    // Section content based on type
    const content = createSectionContent(section);
    container.appendChild(content);
    
    sectionDiv.appendChild(container);
    return sectionDiv;
}

// Create section content based on section type
function createSectionContent(section) {
    const contentDiv = document.createElement('div');
    
    switch(section.id) {
        case 'our-story':
            contentDiv.innerHTML = createOurStoryContent(section.content);
            break;
        case 'wedding-details':
            contentDiv.innerHTML = createWeddingDetailsContent(section.content);
            break;
        case 'wedding-party':
            contentDiv.innerHTML = createWeddingPartyContent(section.content);
            break;
        case 'travel':
            contentDiv.innerHTML = createTravelContent(section.content);
            break;
        case 'registry':
            contentDiv.innerHTML = createRegistryContent(section.content);
            break;
        case 'gallery':
            contentDiv.innerHTML = createGalleryContent(section.content);
            break;
        case 'rsvp':
            contentDiv.innerHTML = createRSVPContent(section.content);
            break;
        case 'schedule':
            contentDiv.innerHTML = createScheduleContent(section.content);
            break;
        case 'scripture-theme':
            contentDiv.innerHTML = createScriptureThemeContent(section.content);
            break;
        case 'contact':
            contentDiv.innerHTML = createContactContent(section.content);
            break;
        case 'extras':
            contentDiv.innerHTML = createExtrasContent(section.content);
            break;
        default:
            contentDiv.innerHTML = '<p>Content coming soon...</p>';
    }
    
    return contentDiv;
}

// Create Our Story section content
function createOurStoryContent(content) {
    return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-heart"></i> ${content.howWeMet.title}</h4>
                        <p class="text-muted"><i class="bi bi-geo-alt"></i> ${content.howWeMet.location} • ${new Date(content.howWeMet.date).toLocaleDateString()}</p>
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
                        <h4 class="card-title"><i class="bi bi-gem"></i> ${content.proposal.title}</h4>
                        <p class="text-muted"><i class="bi bi-geo-alt"></i> ${content.proposal.location} • ${new Date(content.proposal.date).toLocaleDateString()}</p>
                        <p>${content.proposal.story}</p>
                        <button class="btn btn-primary-custom btn-sm mt-2" onclick="openStoryPopup('proposal')">
                            <i class="bi bi-gem"></i> Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
                </div>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="text-center mb-4">Our Journey Together</h3>
                <div class="timeline">
                    ${content.timeline.map(item => `
                        <div class="timeline-item">
                            <div class="timeline-date">${new Date(item.date).toLocaleDateString()}</div>
                            <div class="timeline-content">
                                <h5>${item.event}</h5>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Create Wedding Details section content
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
                        <p><strong>Date:</strong> ${new Date(content.ceremony.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${content.ceremony.time}</p>
                        <button class="btn btn-outline-custom" onclick="openMap(${content.ceremony.venue.coordinates.lat}, ${content.ceremony.venue.coordinates.lng})">
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
                        <p><strong>Date:</strong> ${new Date(content.reception.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${content.reception.time}</p>
                        <button class="btn btn-outline-custom" onclick="openMap(${content.reception.venue.coordinates.lat}, ${content.reception.venue.coordinates.lng})">
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
                                ${content.dressCode.colors.map(color => `
                                    <span class="color-chip">${color}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${content.virtualAttendance && content.virtualAttendance.enabled ? `
        <div class="row mt-4">
            <div class="col-12">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <i class="bi bi-camera-video display-4 text-primary-custom mb-3"></i>
                        <h4 class="card-title">Join Us Virtually</h4>
                        <p>${content.virtualAttendance.description}</p>
                        <div class="virtual-details mt-3">
                            <p><strong>Platform:</strong> ${content.virtualAttendance.platform}</p>
                            <p><strong>Meeting ID:</strong> ${content.virtualAttendance.meetingId}</p>
                            <p><strong>Passcode:</strong> ${content.virtualAttendance.passcode}</p>
                        </div>
                        <div class="mt-3">
                            <a href="${content.virtualAttendance.link}" target="_blank" class="btn btn-primary-custom me-2">
                                <i class="bi bi-camera-video"></i> Join Zoom Meeting
                            </a>
                            <button class="btn btn-outline-custom" onclick="copyToClipboard('${content.virtualAttendance.link}')">
                                <i class="bi bi-clipboard"></i> Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

// Create Wedding Party section content
function createWeddingPartyContent(content) {
    return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom text-center">
                    <div class="card-body">
                        <div class="portrait-container">
                            <img src="${content.bride.photo}" alt="${content.bride.name}" class="portrait-image" 
                                 id="bride-portrait">
                            <button class="portrait-toggle" onclick="togglePortraitView('bride-portrait')" title="Toggle full/cropped view">
                                <i class="bi bi-aspect-ratio"></i>
                            </button>
                        </div>
                        <h4 class="card-title">${content.bride.fullName}</h4>
                        <p class="text-primary-custom">The Bride</p>
                        <p>${content.bride.bio}</p>
                        <div class="fun-facts">
                            <h6>Fun Facts:</h6>
                            ${content.bride.funFacts.map(fact => `<span class="badge bg-accent-1 me-1">${fact}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom text-center">
                    <div class="card-body">
                        <div class="portrait-container">
                            <img src="${content.groom.photo}" alt="${content.groom.name}" class="portrait-image"
                                 id="groom-portrait">
                            <button class="portrait-toggle" onclick="togglePortraitView('groom-portrait')" title="Toggle full/cropped view">
                                <i class="bi bi-aspect-ratio"></i>
                            </button>
                        </div>
                        <h4 class="card-title">${content.groom.fullName}</h4>
                        <p class="text-primary-custom">The Groom</p>
                        <p>${content.groom.bio}</p>
                        <div class="fun-facts">
                            <h6>Fun Facts:</h6>
                            ${content.groom.funFacts.map(fact => `<span class="badge bg-accent-1 me-1">${fact}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Travel section content
function createTravelContent(content) {
    return `
        <div class="row">
            <div class="col-lg-4 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-airplane"></i> Getting There</h4>
                        ${content.airports.map(airport => `
                            <div class="mb-3">
                                <h6>${airport.name} (${airport.code})</h6>
                                <p class="text-muted">${airport.distance}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-building"></i> Accommodations</h4>
                        ${content.hotels.map(hotel => `
                            <div class="mb-3">
                                <h6>${hotel.name}</h6>
                                <p class="text-muted small">${hotel.address}</p>
                                <p class="small">Phone: ${hotel.phone}</p>
                                ${hotel.specialRate ? `<span class="badge bg-primary-custom">Special Rate Available</span>` : ''}
                                ${hotel.bookingCode ? `<p class="small mt-2"><strong>Booking Code:</strong> ${hotel.bookingCode}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-car-front"></i> Transportation</h4>
                        <p><strong>Shuttle:</strong> ${content.transportation.shuttle.description}</p>
                        <p><strong>Ride Share:</strong> ${content.transportation.rideshare}</p>
                        <p><strong>Parking:</strong> ${content.transportation.parking}</p>
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
                            ${content.localTips.map(tip => `<li><i class="bi bi-check-circle text-primary-custom"></i> ${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Registry section content
function createRegistryContent(content) {
    return `
        <div class="text-center mb-4">
            <p class="lead">${content.note}</p>
        </div>
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <h4 class="card-title"><i class="bi bi-gift"></i> Gift Registries</h4>
                        ${content.registries.map(registry => `
                            <div class="mb-3">
                                <a href="${registry.url}" target="_blank" class="btn btn-outline-custom">
                                    <i class="bi bi-box-seam"></i> ${registry.store} Registry
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <h4 class="card-title"><i class="bi bi-cash-coin"></i> Cash Gifts</h4>
                        <p>For your convenience, you can also send cash gifts via:</p>
                        ${content.cashGifts.options.map(option => `
                            <div class="mb-2">
                                <strong>${option.method}:</strong> ${option.details}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Gallery section content
function createGalleryContent(content) {
    return `
        <div class="row">
            <div class="col-12 mb-4">
                <h3 class="text-center">Portraits</h3>
                <div class="row">
                    ${content.portraitPhotos.map((photo, index) => `
                        <div class="col-md-6 col-lg-4 mb-3">
                            <div class="gallery-item" data-index="${index}">
                                <img src="${photo.src}" alt="${photo.caption}" class="img-fluid rounded-custom" data-lightbox-src="${photo.src}" data-lightbox-caption="${photo.caption}">
                                <p class="text-center mt-2 small">${photo.caption}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 mb-4">
                <h3 class="text-center">A beautiful garden</h3>
                <div class="row">
                    ${content.throwbackPhotos.map((photo, index) => `
                        <div class="col-md-6 col-lg-4 mb-3">
                            <div class="gallery-item" data-index="${index + content.portraitPhotos.length}">
                                <img src="${photo.src}" alt="${photo.caption}" class="img-fluid rounded-custom" data-lightbox-src="${photo.src}" data-lightbox-caption="${photo.caption}">
                                <p class="text-center mt-2 small">${photo.caption}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="text-center mt-4">
            <a href="gallery.html" class="btn btn-primary-custom">
                <i class="bi bi-images"></i> View Full Gallery
            </a>
        </div>
    `;
}

// Create RSVP section content
function createRSVPContent(content) {
    return `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <h4 class="card-title mb-4">Please respond by ${new Date(content.deadline).toLocaleDateString()}</h4>
                        <p class="mb-4">We're so excited to celebrate with you! Please let us know if you'll be joining us.</p>
                        <a href="rsvp.html" class="btn btn-primary-custom btn-lg">
                            <i class="bi bi-heart-fill"></i> Complete RSVP Form
                        </a>
                        <p class="mt-3 text-muted">
                            <small>The RSVP form includes meal preferences and special requests</small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Schedule section content
function createScheduleContent(content) {
    return `
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <h3 class="text-center mb-4">Wedding Day Timeline</h3>
                <div class="timeline-schedule">
                    ${content.weddingDay.map(event => `
                        <div class="schedule-item">
                            <div class="schedule-time">${event.time}</div>
                            <div class="schedule-content">
                                <h5>${event.event}</h5>
                                <p class="text-muted">${event.location}</p>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        ${content.preWeddingEvents.length > 0 ? `
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="text-center mb-4">Pre-Wedding Events</h3>
                <div class="row">
                    ${content.preWeddingEvents.map(event => `
                        <div class="col-md-6 mb-3">
                            <div class="card-custom">
                                <div class="card-body">
                                    <h5>${event.event}</h5>
                                    <p class="text-muted">${new Date(event.date).toLocaleDateString()} at ${event.time}</p>
                                    <p class="text-muted">${event.location}</p>
                                    <p>${event.description}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

// Create Scripture/Theme section content
function createScriptureThemeContent(content) {
    return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-book display-4 text-primary-custom mb-3"></i>
                        <h4 class="card-title">Our Scripture</h4>
                        <blockquote class="blockquote">
                            <p class="lead">"${content.scripture.verse}"</p>
                            <footer class="blockquote-footer">${content.scripture.reference}</footer>
                        </blockquote>
                        <p class="mt-3">${content.scripture.significance}</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title text-center"><i class="bi bi-palette2"></i> ${content.theme.name}</h4>
                        <p class="text-center">${content.theme.description}</p>
                        
                        <h6 class="mt-4">Color Palette:</h6>
                        <div class="color-palette-display">
                            ${content.colorPalette.map(color => `
                                <div class="color-item">
                                    <div class="color-swatch" style="background-color: ${color.hex}"></div>
                                    <div class="color-info">
                                        <strong>${color.name}</strong>
                                        <p class="small text-muted">${color.meaning}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <h6 class="mt-4">Cultural Elements:</h6>
                        <ul class="list-unstyled">
                            ${content.culturalElements.map(element => `<li><i class="bi bi-star text-primary-custom"></i> ${element}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Contact section content
function createContactContent(content) {
    return `
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-people"></i> Contact Information</h4>
                        
                        <div class="contact-item mb-3">
                            <h6>The Happy Couple</h6>
                            <p><i class="bi bi-envelope"></i> ${content.couple.email}</p>
                            <p><i class="bi bi-telephone"></i> ${content.couple.phone}</p>
                        </div>
                        
                        <div class="contact-item mb-3">
                            <h6>Wedding Planner</h6>
                            <p><strong>${content.weddingPlanner.name}</strong></p>
                            <p>${content.weddingPlanner.contact}</p>
                            <p><i class="bi bi-envelope"></i> ${content.weddingPlanner.email}</p>
                            <p><i class="bi bi-telephone"></i> ${content.weddingPlanner.phone}</p>
                        </div>
                        
                        <div class="contact-item">
                            <h6>Emergency Contact</h6>
                            <p><strong>${content.emergencyContact.name}</strong></p>
                            <p><i class="bi bi-telephone"></i> ${content.emergencyContact.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body">
                        <h4 class="card-title"><i class="bi bi-chat-dots"></i> Send us a Message</h4>
                        <form class="form-custom" action="${content.form.action}" method="${content.form.method}" onsubmit="handleFormSubmission(event, 'contact')">
                            <input type="hidden" name="_subject" value="Wedding Website Contact Form">
                            <input type="hidden" name="_next" value="${window.location.origin}/index.html#contact">
                            ${content.form.fields.map(field => {
                                if (field.type === 'textarea') {
                                    return `
                                        <div class="mb-3">
                                            <label for="${field.name}" class="form-label">${field.label}</label>
                                            <textarea class="form-control" id="${field.name}" name="${field.name}" rows="4" ${field.required ? 'required' : ''}></textarea>
                                        </div>
                                    `;
                                } else {
                                    return `
                                        <div class="mb-3">
                                            <label for="${field.name}" class="form-label">${field.label}</label>
                                            <input type="${field.type}" class="form-control" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                                        </div>
                                    `;
                                }
                            }).join('')}
                            <button type="submit" class="btn btn-primary-custom w-100">
                                <i class="bi bi-send"></i> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Extras section content
function createExtrasContent(content) {
    return `
        <div class="row">
            ${content.guestbook.enabled ? `
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body text-center">
                        <i class="bi bi-journal-heart display-4 text-primary-custom mb-3"></i>
                        <h4 class="card-title">${content.guestbook.title}</h4>
                        <p>${content.guestbook.description}</p>
                        <button class="btn btn-outline-custom" onclick="openGuestbook()">
                            <i class="bi bi-pencil"></i> Leave a Message
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="col-lg-6 mb-4">
                <div class="card-custom h-100">
                    <div class="card-body text-center">
                        <i class="bi bi-music-note-beamed display-4 text-primary-custom mb-3"></i>
                        <h4 class="card-title">${content.playlist.title}</h4>
                        <p>Listen to the soundtrack of our love story</p>
                        ${content.playlist.spotify.embedded ? 
                            `<div class="spotify-embed-container">
                                <iframe style="border-radius:12px" 
                                        src="${getSpotifyEmbedUrl(content.playlist.spotify.url)}" 
                                        width="100%" 
                                        height="352" 
                                        frameBorder="0" 
                                        allowfullscreen="" 
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                        loading="lazy">
                                </iframe>
                            </div>` :
                            `<a href="${content.playlist.spotify.url}" target="_blank" class="btn btn-outline-custom">
                                <i class="bi bi-spotify"></i> Open Playlist
                            </a>`
                        }
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <h4 class="card-title"><i class="bi bi-share"></i> Share Our Joy</h4>
                        <p>Help us spread the love! Share photos and memories using our hashtag:</p>
                        <h3 class="text-primary-custom">${content.socialMedia.hashtag}</h3>
                        <div class="social-share-buttons mt-3">
                            <button class="btn btn-outline-custom me-2" onclick="shareOnSocial('twitter')">
                                <i class="bi bi-twitter"></i> Twitter
                            </button>
                            <button class="btn btn-outline-custom me-2" onclick="shareOnSocial('facebook')">
                                <i class="bi bi-facebook"></i> Facebook
                            </button>
                            <button class="btn btn-outline-custom" onclick="shareOnSocial('instagram')">
                                <i class="bi bi-instagram"></i> Instagram
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        ${content.liveStream && content.liveStream.enabled ? `
        <div class="row mt-4">
            <div class="col-12">
                <div class="card-custom">
                    <div class="card-body text-center">
                        <i class="bi bi-broadcast display-4 text-primary-custom mb-3"></i>
                        <h4 class="card-title">Live Stream</h4>
                        <p>${content.liveStream.description}</p>
                        <div class="live-stream-details mt-3">
                            <p><strong>Platform:</strong> ${content.liveStream.platform}</p>
                            ${content.liveStream.meetingId ? `<p><strong>Meeting ID:</strong> ${content.liveStream.meetingId}</p>` : ''}
                            ${content.liveStream.passcode ? `<p><strong>Passcode:</strong> ${content.liveStream.passcode}</p>` : ''}
                            ${content.liveStream.backupPlatform ? `<p><strong>Backup:</strong> ${content.liveStream.backupPlatform}</p>` : ''}
                        </div>
                        <div class="mt-3">
                            <a href="${content.liveStream.link}" target="_blank" class="btn btn-primary-custom me-2">
                                <i class="bi bi-play-circle"></i> Watch Live Stream
                            </a>
                            <button class="btn btn-outline-custom" onclick="copyToClipboard('${content.liveStream.link}')">
                                <i class="bi bi-clipboard"></i> Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

// Load couple photo from JSON configuration
function loadCouplePhoto() {
    try {
        const homeSection = weddingData.sections.find(section => section.id === 'home');
        
        if (homeSection && homeSection.content.couplePhoto) {
            const couplePhotoElement = document.querySelector('.couple-photo');
            
            if (couplePhotoElement) {
                const photoConfig = homeSection.content.couplePhoto;
                
                // Update image source and alt text
                couplePhotoElement.src = photoConfig.src;
                couplePhotoElement.alt = photoConfig.alt;
                
                // Add error handling for missing image
                couplePhotoElement.onerror = function() {
                    // Keep the placeholder if the image fails to load
                    this.src = "https://via.placeholder.com/600x800/D8E460/586B36?text=Beauty+%26+Femi";
                };
            }
        }
    } catch (error) {
        console.error('Error loading couple photo:', error);
    }
}

// Toggle portrait view between full image and cropped
function togglePortraitView(imageId) {
    const img = document.getElementById(imageId);
    if (!img) return;
    
    if (img.classList.contains('crop-mode')) {
        // Switch to full image view
        img.classList.remove('crop-mode');
    } else {
        // Switch to cropped view
        img.classList.add('crop-mode');
    }
}

// Initialize countdown timer
function initializeCountdown() {
    const weddingDate = new Date(weddingData.wedding.date + 'T' + weddingData.wedding.time);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(3, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('countdown-timer').innerHTML = '<h3 class="text-primary-custom">We\'re Married! 🎉</h3>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Back to top functionality
    document.getElementById('backToTop').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Active navigation highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
}

// Initialize floating actions
function initializeFloatingActions() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    fabMain.addEventListener('click', function() {
        fabMain.classList.toggle('active');
        fabMenu.classList.toggle('active');
    });
    
    // Share functionality
    document.getElementById('shareBtn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Beauty & Femi 2025 Wedding',
                text: 'Join us for our wedding celebration!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    });
}

// Initialize animations
function initializeAnimations() {
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    setTimeout(() => {
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }, 500);
}

// Hide loading screen
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

// Utility functions
function openMap(lat, lng) {
    const mapUrl = `https://maps.google.com?q=${lat},${lng}`;
    window.open(mapUrl, '_blank');
}

function openLightbox(src, caption) {
    // Remove any existing lightbox first
    const existingLightbox = document.getElementById('lightboxOverlay');
    if (existingLightbox) {
        existingLightbox.remove();
    }
    
    // Create lightbox with improved styling
    const lightboxHTML = `
        <div class="lightbox-overlay" id="lightboxOverlay">
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="closeLightbox()">
                    <i class="bi bi-x-lg"></i>
                </button>
                <img src="${src}" alt="${caption}" class="lightbox-image">
                <div class="lightbox-caption">${caption}</div>
            </div>
        </div>
    `;
    
    // Add lightbox to DOM
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    requestAnimationFrame(() => {
        const overlay = document.getElementById('lightboxOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    });
    
    // Add escape key listener
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        
        // Re-enable body scroll
        document.body.style.overflow = '';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 300);
    }
    
    // Remove escape key listener
    document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
}

// Improved lightbox overlay click handler
function handleLightboxOverlayClick(event) {
    // Only close if clicking the overlay itself, not the content
    if (event.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
    }
}

// Close lightbox when clicking overlay - use event delegation
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('lightbox-overlay')) {
        handleLightboxOverlayClick(event);
    }
});

function handleContactForm(event) {
    event.preventDefault();
    // Simulate form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

function openGuestbook() {
    // Placeholder for guestbook functionality
    alert('Guestbook feature coming soon!');
}

function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Beauty & Femi\'s wedding website! #BeautyAndFemi2025');
    
    let shareUrl = '';
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'instagram':
            alert('Please share on Instagram by copying this link: ' + window.location.href);
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Add timeline and schedule styles dynamically
const additionalStyles = `
    <style>
        .timeline {
            position: relative;
            padding: 20px 0;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--gradient-primary);
            transform: translateX(-50%);
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 30px;
            width: 50%;
            padding: 0 30px;
        }
        
        .timeline-item:nth-child(odd) {
            left: 0;
            text-align: right;
        }
        
        .timeline-item:nth-child(even) {
            left: 50%;
            text-align: left;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background: var(--color-primary);
            border: 3px solid var(--color-secondary);
            border-radius: 50%;
            top: 0;
        }
        
        .timeline-item:nth-child(odd)::before {
            right: -10px;
        }
        
        .timeline-item:nth-child(even)::before {
            left: -10px;
        }
        
        .timeline-date {
            font-weight: 600;
            color: var(--color-accent-1);
            margin-bottom: 10px;
        }
        
        .timeline-content h5 {
            margin-bottom: 5px;
            color: var(--color-accent-1);
        }
        
        .timeline-schedule .schedule-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;
            padding: 20px;
            background: var(--color-secondary);
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-light);
        }
        
        .schedule-time {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--color-primary);
            min-width: 80px;
            margin-right: 20px;
        }
        
        .schedule-content h5 {
            margin-bottom: 5px;
            color: var(--color-accent-1);
        }
        
        .color-palette {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .color-chip {
            padding: 8px 16px;
            background: var(--color-accent-2);
            color: var(--color-secondary);
            border-radius: var(--border-radius-sm);
            font-size: 0.9rem;
        }
        
        .color-palette-display .color-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .color-swatch {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 15px;
            border: 3px solid var(--color-neutral-dark);
        }
        
        .color-info strong {
            display: block;
            color: var(--color-accent-1);
        }
        
        .gallery-item img {
            cursor: pointer;
            transition: transform var(--transition-fast);
        }
        
        .gallery-item img:hover {
            transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
            .timeline::before {
                left: 20px;
            }
            
            .timeline-item {
                width: 100%;
                padding-left: 50px;
                text-align: left !important;
                left: 0 !important;
            }
            
            .timeline-item::before {
                left: 10px !important;
                right: auto !important;
            }
            
            .schedule-item {
                flex-direction: column;
            }
            
            .schedule-time {
                margin-bottom: 10px;
                margin-right: 0;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Utility function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success message
        showNotification('Link copied to clipboard!', 'success');
    }, function(err) {
        console.error('Could not copy text: ', err);
        showNotification('Failed to copy link', 'error');
    });
}

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Universal form submission handler for Formspree
function handleFormSubmission(event, formType) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Add Formspree parameters to force JSON response
    formData.append('_format', 'json');
    formData.append('_timestamp', new Date().toISOString());
    
    // Debug: Log form submission details
    console.log('Form type:', formType);
    console.log('Form action:', form.action);
    console.log('Form method:', form.method);
    console.log('Form data:', Object.fromEntries(formData));
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
    submitButton.disabled = true;
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            showNotification(`${formType.charAt(0).toUpperCase() + formType.slice(1)} form submitted successfully!`, 'success');
            form.reset();
        } else {
            return response.json().then(data => {
                console.log('Error response data:', data);
                if (Object.hasOwnProperty.call(data, 'errors')) {
                    showNotification(data["errors"].map(error => error["message"]).join(", "), 'error');
                } else {
                    showNotification('Oops! There was a problem submitting your form', 'error');
                }
            }).catch(() => {
                showNotification('Oops! There was a problem submitting your form', 'error');
            });
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showNotification('Oops! There was a problem submitting your form', 'error');
    })
    .finally(() => {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// Story Popup Functions
function openStoryPopup(storyType) {
    // Get story data from global weddingData
    const ourStorySection = weddingData.sections.find(section => section.id === 'our-story');
    if (!ourStorySection) return;
    
    const storyData = storyType === 'howWeMet' ? ourStorySection.content.howWeMet : ourStorySection.content.proposal;
    const title = storyData.title;
    const detailStory = storyData['detail-story'];
    const location = storyData.location;
    const date = new Date(storyData.date).toLocaleDateString();
    
    // Create popup HTML
    const popupHTML = `
        <div class="story-popup-overlay" id="storyPopupOverlay">
            <div class="story-popup">
                <div class="story-popup-header">
                    <h3 class="story-popup-title">
                        <i class="bi bi-${storyType === 'howWeMet' ? 'heart' : 'gem'}"></i>
                        ${title}
                    </h3>
                    <button class="story-popup-close" onclick="closeStoryPopup()">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="story-popup-body">
                    <div class="story-popup-meta">
                        <i class="bi bi-geo-alt"></i> ${location} • ${date}
                    </div>
                    <div class="story-popup-content">
                        ${detailStory}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to DOM
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Trigger animations
    requestAnimationFrame(() => {
        const overlay = document.getElementById('storyPopupOverlay');
        overlay.classList.add('active');
    });
    
    // Add escape key listener
    document.addEventListener('keydown', handlePopupKeydown);
}

function closeStoryPopup() {
    const overlay = document.getElementById('storyPopupOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        
        // Remove from DOM after animation
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    
    // Remove escape key listener
    document.removeEventListener('keydown', handlePopupKeydown);
}

function handlePopupKeydown(event) {
    if (event.key === 'Escape') {
        closeStoryPopup();
    }
}

// Close popup when clicking overlay
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('story-popup-overlay')) {
        closeStoryPopup();
    }
});

// Initialize gallery click handlers when sections are built
function initializeGalleryHandlers() {
    // Add click event listeners to all gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    galleryImages.forEach((img, index) => {
        // Remove any existing onclick handlers
        img.removeAttribute('onclick');
        
        img.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            const src = this.getAttribute('data-lightbox-src') || this.src;
            const caption = this.getAttribute('data-lightbox-caption') || this.alt;
            openLightbox(src, caption);
        });
        
        // Also add to parent gallery-item for better accessibility
        const galleryItem = img.closest('.gallery-item');
        if (galleryItem && !galleryItem.hasAttribute('data-click-initialized')) {
            galleryItem.setAttribute('data-click-initialized', 'true');
            galleryItem.addEventListener('click', function(event) {
                // Only trigger if the click wasn't on the image itself
                if (event.target === this || event.target.tagName === 'P') {
                    event.preventDefault();
                    event.stopPropagation();
                    const img = this.querySelector('img');
                    if (img) {
                        const src = img.getAttribute('data-lightbox-src') || img.src;
                        const caption = img.getAttribute('data-lightbox-caption') || img.alt;
                        openLightbox(src, caption);
                    }
                }
            });
        }
    });
}

// Call initializeGalleryHandlers after dynamic sections are built
document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryHandlers();
});