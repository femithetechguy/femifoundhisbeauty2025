// Portrait Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    // The magnifier icons are dynamically created, so we need to 
    // use event delegation to capture clicks
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.magnifier-icon')) {
            e.stopPropagation();
            
            const icon = e.target.closest('.magnifier-icon');
            const portraitType = icon.getAttribute('data-portrait');
            const portraitImg = icon.closest('.portrait-container').querySelector('img');
            const imageSrc = portraitImg.src;
            
            // Get elements for the modal
            const portraitModal = document.getElementById('portraitModal');
            const portraitModalImage = document.getElementById('portraitModalImage');
            
            // Set modal image and type
            portraitModalImage.src = imageSrc;
            portraitModalImage.alt = portraitType === 'bride' ? 'Beauty Portrait' : 'Femi Portrait';
            
            // Add appropriate class for styling
            portraitModal.className = 'portrait-modal';
            portraitModal.classList.add(`${portraitType}-modal`);
            
            // Show modal with animation
            setTimeout(() => {
                portraitModal.classList.add('show');
            }, 10);
        }
    });
    
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
