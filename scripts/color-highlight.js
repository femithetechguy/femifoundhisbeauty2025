// This script adds extra highlighting for the Olive Green color swatch
// and ensures all color swatches are properly centered and fixes any display issues
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the page content to be fully loaded
  setTimeout(() => {
    // Find all color display elements
    const colorDisplays = document.querySelectorAll('.color-display');
    
    // Look for the Olive Green color
    colorDisplays.forEach(display => {
      const colorNameElement = display.querySelector('h5');
      
      if (colorNameElement && colorNameElement.textContent.includes('Olive Green')) {
        console.log('Found Olive Green swatch, adding highlight');
        
        // Add special class if not already present
        if (!display.classList.contains('primary-color-container')) {
          display.classList.add('primary-color-container');
        }
        
        // Move this element to the start of its parent container
        const parent = display.parentElement;
        if (parent) {
          parent.prepend(display);
        }
        
        // Add title attributes for accessibility
        const swatch = display.querySelector('.main-color-swatch');
        if (swatch) {
          swatch.setAttribute('title', 'Olive Green - Primary Wedding Color');
          swatch.setAttribute('aria-label', 'Olive Green - Primary Wedding Color');
          
          // Fix: Remove any problematic pseudo-elements that might be causing overlapping lines
          const style = document.createElement('style');
          style.textContent = `
            .main-color-swatch::after,
            .main-color-swatch::before,
            .color-display::after,
            .color-display::before,
            h5[title*="Olive Green"]::after,
            h5::after {
              content: none !important;
              border: none !important;
              display: none !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    });
    
    // Ensure proper centering for all color displays
    const colorPalette = document.querySelector('.color-palette');
    if (colorPalette) {
      // Add justify-content-center class if not already present
      if (!colorPalette.classList.contains('justify-content-center')) {
        colorPalette.classList.add('justify-content-center');
      }
      
      // Force center alignment on parent elements
      const dressCodeSection = document.querySelector('.card-body:has(.color-palette)');
      if (dressCodeSection) {
        dressCodeSection.style.textAlign = 'center';
      }
    }
    
    // Force center alignment on all color examples and variations
    document.querySelectorAll('.color-variations, .color-examples').forEach(el => {
      el.style.textAlign = 'center';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
    });
    
    // Fix: Make sure any unwanted borders or lines are removed from all color swatches
    document.querySelectorAll('.main-color-swatch').forEach(swatch => {
      // Remove any border-related styles that might be causing issues
      swatch.style.outline = 'none';
      // Only keep the intended border
      if (!swatch.closest('.primary-color-container')) {
        swatch.style.border = '2px solid #ccc';
      }
    });
  }, 500);
});
