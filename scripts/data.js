// Data loading and global data objects
window.weddingData = {};
window.colorData = {};
window.footerData = {};

async function loadData() {
  // Check if we're on gallery.html - if so, don't load full navigation
  const isGalleryPage = window.location.pathname.endsWith('gallery.html') || 
                        window.location.href.includes('gallery.html');
  
  console.log('Loading data - Is gallery page:', isGalleryPage);
  
  // Load main wedding data
  try {
    const weddingRes = await fetch('json/wedding_outline.json');
    window.weddingData = await weddingRes.json();
    
    // If on gallery page, remove navigation to prevent menu conflicts
    if (isGalleryPage && window.weddingData.navigation) {
      console.log('Gallery page detected - removing navigation data');
      // Keep original nav data but don't use it
      window._originalNavigation = window.weddingData.navigation;
      delete window.weddingData.navigation;
      
      // Set a flag to indicate we're on gallery page - this will be used by gallery-navigation.js
      window._isGalleryPage = true;
    }
  } catch (err) {
    console.error('Failed to load wedding_outline.json', err);
    window.weddingData = {};
  }

  // Load color data if needed (optional, adjust path as needed)
  try {
    const colorRes = await fetch('json/colors.json');
    window.colorData = await colorRes.json();
  } catch (err) {
    // Not critical, fallback to empty
    window.colorData = {};
  }

  // Load footer data if needed (optional, adjust path as needed)
  try {
    const footerRes = await fetch('json/footer.json');
    window.footerData = await footerRes.json();
  } catch (err) {
    // Not critical, fallback to empty
    window.footerData = {};
  }
}
