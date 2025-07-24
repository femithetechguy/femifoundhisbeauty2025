// Navigation builder
function buildNavigation() {
  const navbarMenu = document.getElementById("navbarMenu");
  let navigation = weddingData.navigation;

  // If navigation is missing, generate from sections
  if (!navigation || !Array.isArray(navigation.items)) {
    if (Array.isArray(weddingData.sections)) {
      navigation = {
        items: weddingData.sections
          .filter(section => section.id !== 'home')
          .map(section => ({
            id: section.id,
            label: section.title || section.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            icon: section.icon ? `<span>${section.icon}</span>` : '',
            href: `#${section.id}`
          }))
      };
    } else {
      console.warn("Navigation data and sections are missing or invalid. Skipping navigation build.");
      return;
    }
  }

  // Add Extras to navigation if not present
  const extrasExists = navigation.items.some(item => item.id === "extras");
  if (!extrasExists) {
    navigation.items.push({
      id: "extras",
      label: "Extras",
      icon: "<i class='bi bi-stars'></i>",
      href: "#extras"
    });
  }

  navbarMenu.innerHTML = "";
  navigation.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nav-item";
    const a = document.createElement("a");
    a.className = "nav-link";
    // Default to hash if id exists, fallback to #home
    let href = item.href;
    if (!href && item.id) {
      href = `#${item.id}`;
    }
    if (!href) {
      href = "#home";
    }
    a.href = href;
    a.innerHTML = `${item.icon ? item.icon + ' ' : ''}${item.label}`;
    // Add smooth scroll and prevent 404 for hash links
    a.addEventListener("click", function(e) {
      if (a.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = a.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // fallback: scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        // Collapse menu on mobile after click
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
          navbarCollapse.classList.remove('show');
        }
      } else {
        // For external or page links, let default happen
        // Optionally: window.location = a.href;
      }
    });
    li.appendChild(a);
    navbarMenu.appendChild(li);
  });
}
