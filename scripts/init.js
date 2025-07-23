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
  buildDynamicSections();
  initializeCountdown();
  initializeCopyButtons();
  initializeLoveEffects();
  initializeFooter();
  hideLoadingScreen();
}
