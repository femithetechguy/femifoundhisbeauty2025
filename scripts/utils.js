// Hide loading screen
function hideLoadingScreen() {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }, 1500);
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
  // ...existing code from script.js...
}

function openLightbox(src, caption) {
  // ...existing code from script.js...
}

function closeLightbox() {
  // ...existing code from script.js...
}

function copyToClipboard(text) {
  // ...existing code from script.js...
}

function fallbackCopyToClipboard(text) {
  // ...existing code from script.js...
}

function showNotification(message, type = "info") {
  // ...existing code from script.js...
}
// ...other utility functions...
