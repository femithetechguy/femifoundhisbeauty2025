// Website initialization logic
// Loads data, applies color theme, initializes all main features

document.addEventListener("DOMContentLoaded", async function () {
  await initializeWebsite();
});

async function initializeWebsite() {
  await loadData();
  applyColorTheme();
  // Check if loadCouplePhoto function exists before calling it
  if (typeof loadCouplePhoto === 'function') {
    loadCouplePhoto();
  } else if (typeof window.loadCouplePhoto === 'function') {
    window.loadCouplePhoto();
  } else {
    console.warn('loadCouplePhoto function not found');
  }
  
  // Only build navigation for index.html, not gallery.html
  // Gallery.html has its own navigation in gallery-navigation.js
  if (window.location.pathname.endsWith('gallery.html') === false) {
    buildNavigation();
  }
  // Render dynamic sections into the container
  const dynamicSectionsContainer = document.getElementById('dynamic-sections');
  if (dynamicSectionsContainer && typeof buildDynamicSections === 'function') {
    dynamicSectionsContainer.innerHTML = buildDynamicSections();
    
    // Trigger gallery initialization after content is loaded
    if (typeof initGalleryLightbox === 'function') {
      setTimeout(initGalleryLightbox, 200);
    }
  }
  initializeCountdown();
  initializeCopyButtons();
  initializeLoveEffects();
  initializeFooter();
  hideLoadingScreen();
}
