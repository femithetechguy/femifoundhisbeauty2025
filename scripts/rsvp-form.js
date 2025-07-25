// RSVP Form functionality extracted from rsvp.html
export function toggleAttendanceDetails(attending) {
    const attendanceDetails = document.getElementById('attendanceDetails');
    if (attending) {
        attendanceDetails.style.display = 'block';
        document.getElementById('guestCount').required = true;
    } else {
        attendanceDetails.style.display = 'none';
        document.getElementById('guestCount').required = false;
    }
}

export function handleRSVPSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('_format', 'json');
    formData.append('_timestamp', new Date().toISOString());
    formData.append('_source', 'rsvp_inline_form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
    submitButton.disabled = true;
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        return response.text().then(text => {
            if (response.ok) {
                document.getElementById('rsvpForm').style.display = 'none';
                document.getElementById('confirmationMessage').style.display = 'block';
            } else {
                alert('There was an error submitting your RSVP. Please try again.');
            }
        });
    })
    .catch(error => {
        console.error('RSVP submission error:', error);
        alert('There was an error submitting your RSVP. Please check your connection and try again.');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

export function applyColorTheme() {
    fetch('./json/colors.json')
        .then(response => response.json())
        .then(colorData => {
            const root = document.documentElement;
            const cssVariables = colorData.cssVariables[':root'];
            Object.entries(cssVariables).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        })
        .catch(error => console.error('Error loading colors:', error));
}

export async function loadFooterContent() {
    try {
        const response = await fetch('./json/footer.json');
        const footerData = await response.json();
        const footer = footerData.footer;
        const footerElement = document.querySelector('.footer');
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
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}
