// QR Code Share Functionality
function initializeQRShareButtons() {
  // Expose handleQrShare function globally to be used by fab.js
  window.handleQrShare = function(customURL) {
    // Default to the website URL if no custom URL is provided
    const shareURL = customURL || window.location.href;
    
    const shareData = {
      title: document.title || 'EwaFemi2025 Wedding',
      text: 'Join us for our wedding celebration!',
      url: shareURL
    };
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch(err => {
          console.warn('Share failed:', err);
          // Fallback to copy to clipboard
          if (navigator.clipboard) {
            copyToClipboard(shareURL);
            showNotification('Link copied to clipboard!', 'success');
          }
        });
    } else if (navigator.clipboard) {
      // Fallback for browsers without Web Share API
      copyToClipboard(shareURL);
      showNotification('Link copied to clipboard!', 'success');
    } else {
      // Ultimate fallback
      prompt('Copy this link to share:', shareURL);
    }
  };
  
  // Attach event listeners to QR share buttons
  document.querySelectorAll('.btn-share-qr').forEach(button => {
    button.addEventListener('click', function() {
      const link = this.getAttribute('data-link');
      window.handleQrShare(link);
    });
  });
  
  // Function to show notification
  // Make it globally available
  window.showNotification = function(message, type = 'info') {
    // Check if notification container exists, create if not
    let notifContainer = document.getElementById('notification-container');
    if (!notifContainer) {
      notifContainer = document.createElement('div');
      notifContainer.id = 'notification-container';
      notifContainer.style.position = 'fixed';
      notifContainer.style.bottom = '20px';
      notifContainer.style.right = '20px';
      notifContainer.style.zIndex = '9999';
      document.body.appendChild(notifContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.backgroundColor = type === 'success' ? 'var(--color-success)' : 
                                         type === 'warning' ? 'var(--color-warning)' :
                                         type === 'error' ? 'var(--color-error)' : 
                                         'var(--color-info)';
    notification.style.color = 'white';
    notification.style.padding = '12px 18px';
    notification.style.borderRadius = '8px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'bi bi-check-circle' : 
                     type === 'warning' ? 'bi bi-exclamation-circle' :
                     type === 'error' ? 'bi bi-x-circle' : 
                     'bi bi-info-circle';
    icon.style.marginRight = '8px';
    
    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(message));
    
    // Add to container
    notifContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initializeQRShareButtons();
});
