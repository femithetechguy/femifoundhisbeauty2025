// Gallery Form Handler with Formspree Integration
let weddingData = {};

// Load wedding data and configure gallery upload form
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load wedding data
        const response = await fetch('./json/wedding_outline.json');
        weddingData = await response.json();
        
        // Configure upload form with Formspree
        configureUploadForm();
        
        // Load and apply color theme
        await loadAndApplyColors();
        
        // Initialize gallery features
        initializeGallery();
        
    } catch (error) {
        console.error('Error loading wedding data:', error);
    }
});

// Configure upload form with data from JSON
function configureUploadForm() {
    const gallerySection = weddingData.sections.find(section => section.id === 'gallery');
    if (gallerySection && gallerySection.content.uploadForm) {
        const form = document.getElementById('uploadForm');
        const formConfig = gallerySection.content.uploadForm;
        
        // Set form action and method
        form.action = formConfig.action;
        form.method = formConfig.method;
        
        // Add hidden fields for Formspree
        const hiddenFields = `
            <input type="hidden" name="_subject" value="Photo Upload for ${weddingData.wedding.title}">
            <input type="hidden" name="_next" value="${window.location.origin}/gallery.html?success=true">
            <input type="hidden" name="_template" value="basic">
        `;
        form.insertAdjacentHTML('afterbegin', hiddenFields);
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

// Initialize gallery functionality
function initializeGallery() {
    // Filter functionality
    initializeFilters();
    
    // Lightbox functionality
    initializeLightbox();
    
    // Upload form functionality
    initializeUploadForm();
}

// Filter photos by category
function filterPhotos(category) {
    const photos = document.querySelectorAll('.photo-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide photos based on category
    photos.forEach(photo => {
        if (category === 'all' || photo.dataset.category === category) {
            photo.style.display = 'block';
            photo.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            photo.style.display = 'none';
        }
    });
}

// Initialize photo filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.filter;
            filterPhotos(category);
        });
    });
}

// Initialize lightbox
function initializeLightbox() {
    const photoItems = document.querySelectorAll('.photo-item img');
    photoItems.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt);
        });
    });
}

// Open lightbox
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    
    const modal = new bootstrap.Modal(lightbox);
    modal.show();
}

// Initialize upload form
function initializeUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handlePhotoUpload);
    }
}

// Handle photo upload form submission
function handlePhotoUpload(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Uploading...';
    submitButton.disabled = true;
    
    // Add timestamp and format
    formData.append('_timestamp', new Date().toISOString());
    formData.append('_format', 'json'); // Force JSON response from Formspree
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showUploadSuccess();
            form.reset();
            
            // Close modal after short delay
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
                modal.hide();
            }, 2000);
        } else {
            return response.json().then(data => {
                if (Object.hasOwnProperty.call(data, 'errors')) {
                    showUploadError(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    showUploadError('There was a problem uploading your photos. Please try again.');
                }
            }).catch(() => {
                showUploadError('There was a problem uploading your photos. Please try again.');
            });
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showUploadError('There was a problem uploading your photos. Please check your connection and try again.');
    })
    .finally(() => {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// Show upload success message
function showUploadSuccess() {
    const successHtml = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill me-2 fs-4"></i>
                <div>
                    <h6 class="alert-heading mb-1">Photos Uploaded Successfully! 📸</h6>
                    <p class="mb-0">Thank you for sharing your memories with us!</p>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('#uploadModal .modal-body').insertAdjacentHTML('beforeend', successHtml);
}

// Show upload error message
function showUploadError(message) {
    const errorHtml = `
        <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
                <div>
                    <h6 class="alert-heading mb-1">Upload Failed</h6>
                    <p class="mb-0">${message}</p>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('#uploadModal .modal-body').insertAdjacentHTML('beforeend', errorHtml);
}

// Check for success message in URL
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Show success notification
        const successNotification = document.createElement('div');
        successNotification.className = 'alert alert-success position-fixed';
        successNotification.style.top = '20px';
        successNotification.style.right = '20px';
        successNotification.style.zIndex = '9999';
        successNotification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill me-2"></i>
                <span>Photos uploaded successfully!</span>
            </div>
        `;
        
        document.body.appendChild(successNotification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            successNotification.remove();
        }, 3000);
        
        // Clean up URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
    }
});
