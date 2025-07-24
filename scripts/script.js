// (Removed stub assignments to avoid overwriting real functions)


// Initialize the website
document.addEventListener("DOMContentLoaded", function () {

// This file is now modularized. All logic has been moved to the following files:
//   - init.js
//   - data.js
//   - navigation.js
//   - sections.js
//   - couple-photo.js
//   - footer.js
//   - countdown.js
//   - gallery.js
//   - forms.js
//   - utils.js

// Please see those files in the scripts/ directory for all logic.
// This file is kept for reference and to avoid breaking any existing script tags.

// Markdown rendering utility for story popups
function renderDetailStory(detailStory) {
  if (!detailStory) return '';
  // If detailStory is an array, join it into a string
  let storyText = Array.isArray(detailStory) ? detailStory.join('\n') : detailStory;
  // Split by newlines and render headings/italics
  return storyText.split('\n').map(line => {
    if (line.startsWith('## ')) {
      return `<h3>${line.replace(/^## /, "")}</h3>`;
    }
    // Simple markdown italics
    let html = line.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
    return `<p>${html}</p>`;
  }).join("\n");
}

// Story Popup Functions
function openStoryPopup(storyType) {
  // Get story data from global weddingData
  const ourStorySection = weddingData.sections.find(
    (section) => section.id === "our-story"
  );
  if (!ourStorySection) return;

  const storyData =
    storyType === "howWeMet"
      ? ourStorySection.content.howWeMet
      : ourStorySection.content.proposal;
  const title = storyData.title;
  const detailStory = storyData["detail-story"];
  const location = storyData.location;
  const date = storyData.date; // Use the date string exactly as in JSON

  // Create popup HTML
  const popupHTML = `
        <div class="story-popup-overlay" id="storyPopupOverlay">
            <div class="story-popup">
                <div class="story-popup-header">
                    <h3 class="story-popup-title">
                        <i class="bi bi-${
                          storyType === "howWeMet" ? "heart" : "gem"
                        }"></i>
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
                        ${renderDetailStory(detailStory)}
                    </div>
                </div>
            </div>
        </div>
    `;

  // Add popup to DOM
  document.body.insertAdjacentHTML("beforeend", popupHTML);

  // Trigger animations
  requestAnimationFrame(() => {
    const overlay = document.getElementById("storyPopupOverlay");
    overlay.classList.add("active");
  });

  // Add escape key listener
  document.addEventListener("keydown", handlePopupKeydown);
}

function closeStoryPopup() {
  const overlay = document.getElementById("storyPopupOverlay");
  if (overlay) {
    overlay.classList.remove("active");

    // Remove from DOM after animation
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }

  // Remove escape key listener
  document.removeEventListener("keydown", handlePopupKeydown);
}

function handlePopupKeydown(event) {
  if (event.key === "Escape") {
    closeStoryPopup();
  }
}

// Close popup when clicking overlay
document.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("story-popup-overlay")) {
    closeStoryPopup();
  }
});

// Initialize gallery click handlers when sections are built
function initializeGalleryHandlers() {
  // Add click event listeners to all gallery images
  const galleryImages = document.querySelectorAll(".gallery-item img");

  galleryImages.forEach((img, index) => {
    // Remove any existing onclick handlers
    img.removeAttribute("onclick");

    img.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const src = this.getAttribute("data-lightbox-src") || this.src;
      const caption = this.getAttribute("data-lightbox-caption") || this.alt;
      openLightbox(src, caption);
    });

    // Also add to parent gallery-item for better accessibility
    const galleryItem = img.closest(".gallery-item");
    if (galleryItem && !galleryItem.hasAttribute("data-click-initialized")) {
      galleryItem.setAttribute("data-click-initialized", "true");
      galleryItem.addEventListener("click", function (event) {
        // Only trigger if the click wasn't on the image itself
        if (event.target === this || event.target.tagName === "P") {
          event.preventDefault();
          event.stopPropagation();
          const img = this.querySelector("img");
          if (img) {
            const src = img.getAttribute("data-lightbox-src") || img.src;
            const caption =
              img.getAttribute("data-lightbox-caption") || img.alt;
            openLightbox(src, caption);
          }
        }
      });
    }
  });
}

// Call initializeGalleryHandlers after dynamic sections are built
document.addEventListener("DOMContentLoaded", function () {
  initializeGalleryHandlers();
});

// Initialize footer content
async function initializeFooter() {
  try {
    const footers = document.querySelectorAll('.footer');
    
    footers.forEach(footer => {
      renderFooterContent(footer);
    });
  } catch (error) {
    console.error("Error initializing footer:", error);
  }
}

// Render footer content from JSON data
function renderFooterContent(footerElement) {
  const footer = footerData.footer;
  
  const footerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="footer-content">
            <h5>${footer.leftColumn.title}</h5>
            <p>${footer.leftColumn.subtitle}</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="footer-hashtag">
            <h3>${footer.rightColumn.hashtag}</h3>
            <p>${footer.rightColumn.message}</p>
          </div>
        </div>
      </div>
      <hr class="footer-divider">
      <div class="row">
        <div class="col-12 text-center">
          <p class="footer-copyright">
            ${footer.copyright.text}
            <br>
            <small>${footer.copyright.attribution.text} <i class="${footer.copyright.attribution.icon}"></i> by <a href="${footer.copyright.attribution.linkUrl}" target="${footer.copyright.attribution.linkTarget}" rel="${footer.copyright.attribution.linkRel}" class="${footer.copyright.attribution.linkClass}">${footer.copyright.attribution.linkText}</a></small>
          </p>
        </div>
      </div>
    </div>
  `;
  
  footerElement.innerHTML = footerHTML;
}


// Expose popup and utility functions globally for inline HTML onclick (must be after all function declarations)
window.openStoryPopup = openStoryPopup;
window.closeStoryPopup = closeStoryPopup;
window.handlePopupKeydown = handlePopupKeydown;
if (typeof togglePortraitView === 'function') window.togglePortraitView = togglePortraitView;

}); // <-- Close the DOMContentLoaded event listener
