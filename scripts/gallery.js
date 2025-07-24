// Gallery lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize gallery lightbox
  initGalleryLightbox();
});

function initGalleryLightbox() {
  // Elements
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImage = document.getElementById('galleryLightboxImage');
  const lightboxCaption = document.getElementById('galleryLightboxCaption');
  const lightboxClose = document.querySelector('.gallery-lightbox-close');
  const lightboxPrev = document.querySelector('.gallery-lightbox-prev');
  const lightboxNext = document.querySelector('.gallery-lightbox-next');
  const lightboxCurrent = document.getElementById('galleryLightboxCurrent');
  const lightboxTotal = document.getElementById('galleryLightboxTotal');
  
  // Gallery state
  let galleryImages = [];
  let currentImageIndex = 0;

  // Function to collect all gallery images after DOM is loaded
  function collectGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(galleryItems).map((item, index) => {
      const img = item.querySelector('img');
      return {
        src: img.getAttribute('data-lightbox-src') || img.src,
        caption: img.getAttribute('data-lightbox-caption') || img.alt,
        index: index
      };
    });
    
    // Update total count display
    lightboxTotal.textContent = galleryImages.length;
    
    // Add click listeners to gallery items
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        openLightbox(index);
      });
    });
  }

  // Open lightbox with specific image index
  function openLightbox(index) {
    if (galleryImages.length === 0) return;
    
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  // Update lightbox content with current image
  function updateLightboxContent() {
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.caption;
    lightboxCaption.textContent = image.caption;
    lightboxCurrent.textContent = currentImageIndex + 1;
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  // Navigate to previous image
  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
  }

  // Navigate to next image
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxContent();
  }

  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('show')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  });

  // Close when clicking outside of the image
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Run collection once the DOM content is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', collectGalleryImages);
  } else {
    collectGalleryImages();
  }
  
  // Re-collect gallery images when new content might be loaded
  document.addEventListener('contentLoaded', collectGalleryImages);
}
