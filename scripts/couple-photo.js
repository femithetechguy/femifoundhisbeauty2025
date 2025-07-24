// Toggle portrait view (full/cropped) for couple images
function togglePortraitView(imageId) {
  const img = document.getElementById(imageId);
  if (!img) return;
  img.classList.toggle('crop-mode');
}

// Expose globally for inline onclick
window.togglePortraitView = togglePortraitView;
// Couple photo loader
function loadCouplePhoto() {
  // Find the couple photo section (usually 'home')
  if (!window.weddingData || !Array.isArray(weddingData.sections)) return;
  const homeSection = weddingData.sections.find(section => section.id === 'home');
  if (!homeSection || !homeSection.content || !homeSection.content.couplePhoto) return;
  const couplePhotoData = homeSection.content.couplePhoto;
  // Find the img element in the hero section
  const img = document.querySelector('.couple-photo-container .couple-photo');
  if (img && couplePhotoData.src) {
    img.src = couplePhotoData.src;
    img.alt = couplePhotoData.alt || 'Beauty and Femi';
  }
}
