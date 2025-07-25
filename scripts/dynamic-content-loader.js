// Dynamic Content Loader for Single Page Application Experience
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the content loader
    initDynamicContentLoader();
});

function initDynamicContentLoader() {
    // Create a container for dynamically loaded content
    if (!document.getElementById('dynamicPageContent')) {
        const mainContent = document.getElementById('main-content');
        const dynamicContainer = document.createElement('div');
        dynamicContainer.id = 'dynamicPageContent';
        dynamicContainer.className = 'dynamic-content-container';
        dynamicContainer.style.display = 'none';
        mainContent.appendChild(dynamicContainer);
    }
    
    // Find all links to gallery.html and modify them to use dynamic loading
    updateGalleryLinks();
    
    // Handle browser history
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            if (event.state.page === 'gallery') {
                showGalleryPage();
            } else {
                hideGalleryPage();
            }
        } else {
            hideGalleryPage();
        }
    });
}

function updateGalleryLinks() {
    // Update all gallery links in the document
    const galleryLinks = document.querySelectorAll('a[href="gallery.html"], .gallery-link');
    
    galleryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadGalleryContent();
        });
    });
    
    // Special handling for the gallery nav link
    const galleryNavLink = document.getElementById('gallery-nav-link');
    if (galleryNavLink) {
        galleryNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadGalleryContent();
        });
    }
    
    // Handle dynamically added links by setting up a mutation observer
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const newLinks = node.querySelectorAll('a[href="gallery.html"], .gallery-link');
                        newLinks.forEach(link => {
                            if (!link.hasGalleryListener) {
                                link.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    loadGalleryContent();
                                });
                                link.hasGalleryListener = true;
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
}

function loadGalleryContent() {
    // Show loading spinner
    showLoadingSpinner();
    
    // Fetch gallery.html content
    fetch('gallery.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract gallery content (everything inside main#main-content)
            const galleryMain = doc.querySelector('#main-content');
            if (!galleryMain) {
                throw new Error('Gallery content not found');
            }
            
            // Get all CSS links specific to gallery
            const galleryStyles = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
                .filter(link => {
                    const href = link.getAttribute('href');
                    return href && href.includes('gallery-styles.css') && !document.querySelector(`link[href="${href}"]`);
                });
            
            // Get all gallery-specific scripts
            const galleryScripts = Array.from(doc.querySelectorAll('script'))
                .filter(script => {
                    const src = script.getAttribute('src');
                    return src && src.includes('gallery.js') && !document.querySelector(`script[src="${src}"]`);
                });
            
            const galleryInlineScripts = Array.from(doc.querySelectorAll('script:not([src])'))
                .filter(script => {
                    return script.textContent.includes('GalleryManager');
                });
            
            // Load gallery styles
            galleryStyles.forEach(style => {
                const newStyle = document.createElement('link');
                newStyle.rel = 'stylesheet';
                newStyle.href = style.href;
                newStyle.classList.add('dynamic-gallery-resource');
                document.head.appendChild(newStyle);
            });
            
            // Update the dynamic content container
            const dynamicContainer = document.getElementById('dynamicPageContent');
            dynamicContainer.innerHTML = '';
            dynamicContainer.appendChild(galleryMain.cloneNode(true));
            
            // Load gallery scripts
            galleryScripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                newScript.classList.add('dynamic-gallery-resource');
                document.body.appendChild(newScript);
            });
            
            // Execute inline scripts
            galleryInlineScripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                newScript.classList.add('dynamic-gallery-resource');
                document.body.appendChild(newScript);
            });
            
            // Show the gallery page
            showGalleryPage();
            
            // Update browser history
            if (history.state?.page !== 'gallery') {
                history.pushState({ page: 'gallery' }, 'Gallery - EwaFemi2025 Wedding', 'gallery.html');
                document.title = 'Photo Gallery - EwaFemi2025 Wedding';
            }
        })
        .catch(error => {
            console.error('Error loading gallery content:', error);
            hideLoadingSpinner();
            // Fallback to traditional navigation if loading fails
            window.location.href = 'gallery.html';
        });
}

function showGalleryPage() {
    // Hide the regular content and show the gallery content
    const dynamicSections = document.getElementById('dynamic-sections');
    const homeSection = document.getElementById('home');
    const dynamicContainer = document.getElementById('dynamicPageContent');
    
    if (dynamicSections) dynamicSections.style.display = 'none';
    if (homeSection) homeSection.style.display = 'none';
    if (dynamicContainer) dynamicContainer.style.display = 'block';
    
    // Update active nav link
    updateActiveNavLink('gallery');
    
    // Hide loading spinner
    hideLoadingSpinner();
    
    // Initialize any gallery-specific functionality
    if (typeof initGalleryPage === 'function') {
        setTimeout(() => initGalleryPage(), 100);
    }
}

function hideGalleryPage() {
    // Show the regular content and hide the gallery content
    const dynamicSections = document.getElementById('dynamic-sections');
    const homeSection = document.getElementById('home');
    const dynamicContainer = document.getElementById('dynamicPageContent');
    
    if (dynamicSections) dynamicSections.style.display = 'block';
    if (homeSection) homeSection.style.display = 'block';
    if (dynamicContainer) dynamicContainer.style.display = 'none';
    
    // Update title back to default
    document.title = 'EwaFemi2025 Wedding';
    
    // Update active nav link
    updateActiveNavLink('home');
}

function updateActiveNavLink(activeId) {
    // Remove active class from all nav items
    document.querySelectorAll('#navbarMenu .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the correct link
    if (activeId === 'gallery') {
        const galleryLinks = document.querySelectorAll('a[href="gallery.html"]');
        galleryLinks.forEach(link => link.classList.add('active'));
    } else {
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

function showLoadingSpinner() {
    // Create loading overlay if it doesn't exist
    let loadingOverlay = document.getElementById('dynamicLoadingOverlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'dynamicLoadingOverlay';
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-grow text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading Gallery...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
        
        // Add style for the overlay
        const overlayStyle = document.createElement('style');
        overlayStyle.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
            .loading-spinner {
                text-align: center;
            }
        `;
        document.head.appendChild(overlayStyle);
    }
    
    loadingOverlay.style.display = 'flex';
}

function hideLoadingSpinner() {
    const loadingOverlay = document.getElementById('dynamicLoadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Function that gallery.html can call to initialize itself when loaded dynamically
function initGalleryPage() {
    console.log('Initializing gallery page...');
    
    // If GalleryManager exists, initialize it
    if (window.galleryManager) {
        console.log('Gallery manager already exists');
    } else if (typeof GalleryManager !== 'undefined') {
        window.galleryManager = new GalleryManager();
        console.log('Gallery manager initialized');
    }
    
    // Initialize floating action button if exists
    if (typeof initFAB === 'function') {
        initFAB();
    }
    
    // Initialize footer
    if (typeof initializeFooter === 'function') {
        initializeFooter();
    }
}

// Add back button functionality to go back to main page
function addBackToHomeButton() {
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-outline-primary back-to-home-btn';
    backButton.innerHTML = '<i class="bi bi-arrow-left"></i> Back to Home';
    backButton.addEventListener('click', function() {
        history.pushState({ page: 'home' }, 'EwaFemi2025 Wedding', 'index.html');
        hideGalleryPage();
    });
    
    const dynamicContainer = document.getElementById('dynamicPageContent');
    const galleryContent = dynamicContainer.querySelector('main');
    if (galleryContent) {
        galleryContent.insertBefore(backButton, galleryContent.firstChild);
    }
}
