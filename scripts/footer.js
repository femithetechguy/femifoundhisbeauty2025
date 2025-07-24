// Footer initialization and rendering
async function initializeFooter() {
  try {
    const footers = document.querySelectorAll('.footer');
    footers.forEach(footer => {
      renderFooterContent(footer);
    });
  } catch (error) {
    console.error("Error initializing footer:", error);
  }
}

function renderFooterContent(footerElement) {
  const footer = window.footerData && window.footerData.footer;
  if (!footer) return;
  const footerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="footer-content">
            <h5>${footer.leftColumn.title}</h5>
            <p>${footer.leftColumn.subtitle}</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="footer-hashtag">
            <h3>${footer.rightColumn.hashtag}</h3>
            <p>${footer.rightColumn.message}</p>
          </div>
        </div>
      </div>
      <hr class="footer-divider">
      <div class="row">
        <div class="col-12 text-center">
          <p class="footer-copyright">
            ${footer.copyright.text}
            <br>
            <small>${footer.copyright.attribution.text} <i class="${footer.copyright.attribution.icon}"></i> by <a href="${footer.copyright.attribution.linkUrl}" target="${footer.copyright.attribution.linkTarget}" rel="${footer.copyright.attribution.linkRel}" class="${footer.copyright.attribution.linkClass}">${footer.copyright.attribution.linkText}</a></small>
          </p>
        </div>
      </div>
    </div>
  `;
  footerElement.innerHTML = footerHTML;
}
