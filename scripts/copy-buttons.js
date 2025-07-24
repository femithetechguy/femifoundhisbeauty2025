// Initialize functionality for copy buttons
function initializeCopyButtons() {
  // Function to show confirmation message next to a button
  function showCopyConfirmation(button) {
    // Find the closest confirmation element next to this button
    const confirmation = button.nextElementSibling;
    if (confirmation && confirmation.classList.contains('copy-confirmation')) {
      // Show the confirmation
      confirmation.style.display = 'inline-block';
      confirmation.classList.add('show');
      
      // Hide after 2 seconds
      setTimeout(() => {
        confirmation.classList.remove('show');
        setTimeout(() => {
          confirmation.style.display = 'none';
        }, 300);
      }, 2000);
    }
  }

  // Handle all QR code copy links
  document.querySelectorAll('.copy-qr-link').forEach(button => {
    button.addEventListener('click', function() {
      const link = this.getAttribute('data-link');
      if (link) {
        copyToClipboard(link);
        showCopyConfirmation(this);
      }
    });
  });

  // Handle all livestream copy links
  document.querySelectorAll('.copy-livestream-link').forEach(button => {
    button.addEventListener('click', function() {
      const link = this.getAttribute('data-link');
      if (link) {
        copyToClipboard(link);
        showCopyConfirmation(this);
      }
    });
  });

  // Handle all virtual attendance copy links
  document.querySelectorAll('.copy-virtual-link').forEach(button => {
    button.addEventListener('click', function() {
      const link = this.getAttribute('data-link');
      if (link) {
        copyToClipboard(link);
        showCopyConfirmation(this);
      }
    });
  });
  
  // Removed pulse effect on buttons as it was causing clickability issues
  // The hover effects are now handled solely through CSS
}
