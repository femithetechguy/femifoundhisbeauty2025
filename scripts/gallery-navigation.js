// Custom navigation builder for gallery.html
// This version only includes Home and RSVP links
function buildGalleryNavigation() {
  console.log("Building gallery navigation - simplified menu");
  
  // Force the navigation to only have Home and RSVP
  // This is important because we need to make sure no other script overrides this
  setTimeout(function() {
    const navbarMenu = document.getElementById("navbarMenu");
    if (!navbarMenu) return;
    
    // Clear existing menu items completely
    navbarMenu.innerHTML = "";
    
    // Add Home link
    const homeLi = document.createElement("li");
    homeLi.className = "nav-item";
    const homeLink = document.createElement("a");
    homeLink.className = "nav-link";
    homeLink.href = "index.html";
    homeLink.innerHTML = '<i class="bi bi-house"></i> Home';
    homeLi.appendChild(homeLink);
    navbarMenu.appendChild(homeLi);
    
    // Add RSVP link
    const rsvpLi = document.createElement("li");
    rsvpLi.className = "nav-item";
    const rsvpLink = document.createElement("a");
    rsvpLink.className = "nav-link";
    rsvpLink.href = "rsvp.html";
    rsvpLink.id = "rsvp-nav-link";
    rsvpLink.innerHTML = '<i class="bi bi-heart-fill"></i> RSVP';
    
    // Add click handler for mobile menu collapse
    rsvpLink.addEventListener("click", function() {
      // Collapse menu on mobile after click
      const navbarCollapse = document.querySelector('.navbar-collapse.show');
      if (navbarCollapse) {
        navbarCollapse.classList.remove('show');
      }
    });
    
    rsvpLi.appendChild(rsvpLink);
    navbarMenu.appendChild(rsvpLi);
    
    // Set a flag to prevent other scripts from modifying this navigation
    window._galleryNavigationBuilt = true;
  }, 0);
}

// Ensure our navigation builder runs first
document.addEventListener("DOMContentLoaded", function() {
  buildGalleryNavigation();
  
  // Also run it after a short delay to handle any other scripts that might override it
  setTimeout(buildGalleryNavigation, 100);
});
