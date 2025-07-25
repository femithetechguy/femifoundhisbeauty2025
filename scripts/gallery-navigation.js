// Custom navigation builder for gallery.html
// This version only includes Home and RSVP links
function buildNavigation() {
  const navbarMenu = document.getElementById("navbarMenu");
  
  // Clear existing menu items
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
  rsvpLink.href = "#rsvp";
  rsvpLink.id = "rsvp-nav-link";
  rsvpLink.innerHTML = '<i class="bi bi-heart-fill"></i> RSVP';
  
  // Add click event to scroll to RSVP section
  rsvpLink.addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
    
    // Ensure RSVP form is loaded
    if (typeof loadRsvpForm === 'function') {
      loadRsvpForm();
    }
    
    // Collapse menu on mobile after click
    const navbarCollapse = document.querySelector('.navbar-collapse.show');
    if (navbarCollapse) {
      navbarCollapse.classList.remove('show');
    }
  });
  
  rsvpLi.appendChild(rsvpLink);
  navbarMenu.appendChild(rsvpLi);
}

// Run navigation builder when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  buildNavigation();
});
