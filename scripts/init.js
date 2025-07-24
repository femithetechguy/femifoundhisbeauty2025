// Website initialization logic
// Loads data, applies color theme, initializes all main features

document.addEventListener("DOMContentLoaded", async function () {
  await initializeWebsite();
});

async function initializeWebsite() {
  await loadData();
  applyColorTheme();
  loadCouplePhoto();
  buildNavigation();
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
