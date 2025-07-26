// Detect if device is mobile
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Show loading screen
function showLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    // Enable hardware acceleration
    loadingScreen.style.transform = 'translateZ(0)';
    loadingScreen.style.display = "flex";
    loadingScreen.classList.remove("hidden");
  }
}

// Hide loading screen with optimized performance
function hideLoadingScreen() {
  // Shorter timeout for mobile devices
  const isMobile = isMobileDevice();
  const initialDelay = isMobile ? 500 : 1000; // Shorter delay on mobile
  const transitionDelay = isMobile ? 200 : 500; // Shorter transition on mobile
  
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      // Add hardware acceleration for smoother transitions
      loadingScreen.style.transform = 'translateZ(0)';
      loadingScreen.classList.add("hidden");
      
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, transitionDelay);
    }
  }, initialDelay);
}
// Initialize love effects for QR code section
function initializeLoveEffects() {
  const loveContainer = document.querySelector(".floating-hearts");
  if (!loveContainer) return;

  const hearts = ["💕", "💖", "💗", "💝", "✨", "⭐", "🌟", "💫"];

  function createFloatingHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    // Random horizontal position
    heart.style.left = Math.random() * 100 + "%";

    // Random animation duration and delay
    heart.style.animationDuration = Math.random() * 3 + 2 + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";

    loveContainer.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 6000);
  }

  // Create hearts periodically
  setInterval(createFloatingHeart, 800);

  // Create initial hearts
  for (let i = 0; i < 3; i++) {
    setTimeout(createFloatingHeart, i * 300);
  }
}
// Utility functions
function openMap(lat, lng) {
  // If it's an iOS device
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    window.open(`maps://maps.apple.com/?q=${lat},${lng}&ll=${lat},${lng}`);
  }
  // Otherwise use Google Maps
  else {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`);
  }
}

// New function for driving directions to a specific address using native maps
function driveToLocation(address) {
  const encodedAddress = encodeURIComponent(address);
  
  // If it's an iOS device
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    window.open(`maps://maps.apple.com/?daddr=${encodedAddress}&dirflg=d`);
  }
  // For Android or other devices
  else {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`);
  }
}

function openLightbox(src, caption) {
  // ...existing code from script.js...
}

function closeLightbox() {
  // ...existing code from script.js...
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern asynchronous API
    return navigator.clipboard.writeText(text)
      .then(function() {
        showNotification('Copied to clipboard!', 'success');
      })
      .catch(function(err) {
        fallbackCopyToClipboard(text);
        // fallback will also show notification
      });
  } else {
    // Fallback for older browsers
    fallbackCopyToClipboard(text);
    // fallback will also show notification
  }
}

function fallbackCopyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  // Avoid scrolling to bottom
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    // Could not copy
  }
  document.body.removeChild(textArea);
  showNotification('Copied to clipboard!', 'success');
}

function showNotification(message, type = "info") {
  let notification = document.getElementById('globalNotification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'globalNotification';
    notification.style.position = 'fixed';
    notification.style.top = '30px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '220px';
    notification.style.maxWidth = '90vw';
    notification.style.padding = '14px 28px';
    notification.style.borderRadius = '8px';
    notification.style.fontSize = '1.1rem';
    notification.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
    notification.style.textAlign = 'center';
    notification.style.opacity = '0';
    notification.style.pointerEvents = 'none';
    notification.style.transition = 'opacity 0.3s';
    document.body.appendChild(notification);
  }
  notification.textContent = message;
  notification.style.background = type === 'success' ? '#d1e7dd' : (type === 'error' ? '#f8d7da' : '#e2e3e5');
  notification.style.color = type === 'success' ? '#0f5132' : (type === 'error' ? '#842029' : '#41464b');
  notification.style.border = type === 'success' ? '1.5px solid #badbcc' : (type === 'error' ? '1.5px solid #f5c2c7' : '1.5px solid #cfcfcf');
  notification.style.opacity = '1';
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 2200);
}
// ...other utility functions...
