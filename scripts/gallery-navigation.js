// Custom navigation builder for gallery.html
// This version only includes a Home link
function buildGalleryNavigation() {
  console.log("Building gallery navigation - simplified menu with only Home link");
  
  // Force the navigation to only have Home
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
