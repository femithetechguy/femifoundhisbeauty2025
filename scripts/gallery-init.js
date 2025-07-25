// Gallery-specific initialization logic
// Loads data, applies color theme, initializes all gallery features

document.addEventListener("DOMContentLoaded", async function () {
  await initializeGalleryWebsite();
});

async function initializeGalleryWebsite() {
  await loadData();
  applyColorTheme();
  // Skip building navigation since we have a custom one
  // Skip buildNavigation(); - we use gallery-navigation.js instead
  
  // Render dynamic sections into the container
  const dynamicSectionsContainer = document.getElementById('dynamic-sections');
  if (dynamicSectionsContainer && typeof buildDynamicSections === 'function') {
    dynamicSectionsContainer.innerHTML = buildDynamicSections();
    
    // Trigger gallery initialization after content is loaded
    if (typeof initGalleryLightbox === 'function') {
      setTimeout(initGalleryLightbox, 200);
    }
  }
  
  // Only call functions that are available
  if (typeof initializeFooter === 'function') {
    initializeFooter();
  }
  
  // Hide loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}
