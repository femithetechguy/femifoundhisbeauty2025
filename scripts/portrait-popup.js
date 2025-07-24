// Portrait Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Once DOM is loaded, find all magnifier icons and explicitly attach event listeners
    function attachMagnifierEvents() {
        console.log('Attaching magnifier events');
        const magnifierIcons = document.querySelectorAll('.magnifier-icon');
        console.log('Found', magnifierIcons.length, 'magnifier icons');
        
        magnifierIcons.forEach(icon => {
            // Remove any existing click listeners to prevent duplicates
            icon.removeEventListener('click', handleMagnifierClick);
            // Add click listener
            icon.addEventListener('click', handleMagnifierClick);
        });
    }
    
    // Handle magnifier click
    function handleMagnifierClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Magnifier clicked');
        
        const icon = e.currentTarget; // Use currentTarget for the element with the listener
        const portraitType = icon.getAttribute('data-portrait');
        const portraitContainer = icon.closest('.portrait-container');
        const portraitImg = portraitContainer.querySelector('img');
        
        console.log('Portrait type:', portraitType);
        console.log('Portrait container:', portraitContainer);
        console.log('Portrait image:', portraitImg);
        
        if (!portraitImg) {
            console.error('Could not find portrait image');
            return;
        }
        
        let imageSrc = portraitImg.src;
        console.log('Original image source:', imageSrc);
        
        // Handle image path issues by normalizing the path
        // Extract just the filename portion
        const imgFilename = imageSrc.split('/').pop();
        
        // Ensure the image path starts with /images/
        if (!imageSrc.includes('/images/')) {
            imageSrc = `/images/${imgFilename}`;
        }
        
        console.log('Corrected image source:', imageSrc);
        
        // Get elements for the modal
        const portraitModal = document.getElementById('portraitModal');
        const portraitModalImage = document.getElementById('portraitModalImage');
        
        // Set modal image and type
        portraitModalImage.src = imageSrc;
        portraitModalImage.alt = portraitType === 'bride' ? 'Beauty Portrait' : 'Femi Portrait';
        
        // Add appropriate class for styling
        portraitModal.className = 'portrait-modal';
        portraitModal.classList.add(`${portraitType}-modal`);
        
        // Show modal
        portraitModal.style.display = 'flex';
        
        // Add show class for animation
        setTimeout(() => {
            portraitModal.classList.add('show');
        }, 10);
    }
    
    // Also keep the event delegation approach as a backup
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.magnifier-icon')) {
            handleMagnifierClick(e);
        }
    });
    
    // Initial attachment
    attachMagnifierEvents();
    
    // Re-attach events when content might have changed
    // This helps with dynamically loaded content
    window.addEventListener('load', attachMagnifierEvents);
    
    // For dynamic content loaded via AJAX or other methods
    // You can call attachMagnifierEvents() manually or create a custom event
    document.addEventListener('contentUpdated', attachMagnifierEvents);
    
    // Re-check periodically for any new magnifier icons
    setTimeout(attachMagnifierEvents, 1000);
    setTimeout(attachMagnifierEvents, 3000);
    
    // Get close button element
    const closeModalButton = document.querySelector('.portrait-modal-close');
    const portraitModal = document.getElementById('portraitModal');
    
    // Close modal when clicking the close button
    closeModalButton.addEventListener('click', function() {
        portraitModal.classList.remove('show');
        
        // Hide modal after animation completes
        setTimeout(() => {
            portraitModal.style.display = 'none';
        }, 300);
    });
    
    // Close modal when clicking outside the image
    portraitModal.addEventListener('click', function(e) {
        if (e.target === portraitModal) {
            portraitModal.classList.remove('show');
            
            // Hide modal after animation completes
            setTimeout(() => {
                portraitModal.style.display = 'none';
            }, 300);
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && portraitModal.classList.contains('show')) {
            portraitModal.classList.remove('show');
            
            // Hide modal after animation completes
            setTimeout(() => {
                portraitModal.style.display = 'none';
            }, 300);
        }
    });
});
