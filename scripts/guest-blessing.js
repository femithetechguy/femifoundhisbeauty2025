// Guest Blessing Form Module

export async function renderGuestBlessingForm() {
  // Find the guestbook card body in the Extras section
  const guestbookCard = document.querySelector('.extras-guestbook-form');
  if (!guestbookCard) return;
  try {
    const response = await fetch('json/guest_blessing.json');
    const data = await response.json();
    let formFields = data.form.fields.map(field => {
      if (field.type === 'textarea') {
        return `<div class="mb-3">
          <label for="${field.name}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
          <textarea class="form-control" id="${field.name}" name="${field.name}" rows="3" ${field.required ? 'required' : ''}></textarea>
        </div>`;
      } else {
        return `<div class="mb-3">
          <label for="${field.name}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
          <input type="${field.type}" class="form-control" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} />
        </div>`;
      }
    }).join('');
    guestbookCard.innerHTML += `
      <form id="guestBlessingForm" action="https://formspree.io/f/${data.formspreeId}" method="POST" class="mt-4">
        ${formFields}
        <button type="submit" class="btn btn-primary">${data.form.submitText}</button>
        <div id="guestBlessingMessage" class="mt-3" style="display:none;"></div>
      </form>
    `;
    document.getElementById('guestBlessingForm').onsubmit = async function(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        const messageDiv = document.getElementById('guestBlessingMessage');
        if (response.ok) {
          messageDiv.style.display = 'block';
          messageDiv.className = 'alert alert-success mt-3';
          messageDiv.innerHTML = `<i class='bi bi-emoji-heart-eyes'></i> ${data.successMessage}`;
          form.reset();
        } else {
          messageDiv.style.display = 'block';
          messageDiv.className = 'alert alert-danger mt-3';
          messageDiv.innerHTML = `<i class='bi bi-exclamation-triangle'></i> ${data.errorMessage}`;
        }
      } catch (err) {
        const messageDiv = document.getElementById('guestBlessingMessage');
        messageDiv.style.display = 'block';
        messageDiv.className = 'alert alert-danger mt-3';
        messageDiv.innerHTML = `<i class='bi bi-exclamation-triangle'></i> ${data.errorMessage}`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = data.form.submitText;
      }
    };
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Unable to load blessing form.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderGuestBlessingForm();
});
