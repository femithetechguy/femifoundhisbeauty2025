// Floating Action Button logic

document.addEventListener("DOMContentLoaded", function () {
  const fabMain = document.getElementById("fabMain");
  const fabMenu = document.getElementById("fabMenu");
  const shareBtn = document.getElementById("shareBtn");

  if (!fabMain || !fabMenu) return;

  // Toggle menu
  fabMain.addEventListener("click", function () {
    fabMain.classList.toggle("active");
    fabMenu.classList.toggle("active");
  });

  // Hide menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
      fabMain.classList.remove("active");
      fabMenu.classList.remove("active");
    }
  });

  // Prevent menu from closing when clicking inside
  fabMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Share button logic (reuse main share logic if available)
  if (shareBtn) {
    shareBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      // Try to use the same share logic as QR code share
      if (window.handleQrShare) {
        window.handleQrShare();
      } else {
        // Fallback: share site URL
        const shareData = {
          title: document.title,
          text: "Join us for our wedding!",
          url: window.location.href
        };
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (err) {}
        } else if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(window.location.href);
            if (window.showNotification) window.showNotification("Link copied to clipboard!");
          } catch (err) {}
        }
      }
      // Hide menu after sharing
      fabMain.classList.remove("active");
      fabMenu.classList.remove("active");
    });
  }
});
