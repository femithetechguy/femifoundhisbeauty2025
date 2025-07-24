// Robust clipboard copy function
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern async clipboard API
    navigator.clipboard.writeText(text).then(
      function () {
        showNotification('Link copied to clipboard!', 'success');
      },
      function () {
        fallbackCopyToClipboard(text);
      }
    );
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  // Avoid scrolling to bottom
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    if (successful) {
      showNotification('Link copied to clipboard!', 'success');
    } else {
      showNotification('Unable to copy link. Please copy manually.', 'error');
    }
  } catch (err) {
    showNotification('Unable to copy link. Please copy manually.', 'error');
  }
  document.body.removeChild(textArea);
}
// Form handlers and blessing form logic
function handleFormSubmission(event, formType) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Add Formspree parameters to force JSON response
  formData.append("_format", "json");
  formData.append("_timestamp", new Date().toISOString());

  // Debug: Log form submission details
  console.log("Form type:", formType);
  console.log("Form action:", form.action);
  console.log("Form method:", form.method);
  console.log("Form data:", Object.fromEntries(formData));

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
  submitButton.disabled = true;

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        showNotification(
          `${
            formType.charAt(0).toUpperCase() + formType.slice(1)
          } form submitted successfully!`,
          "success"
        );
        form.reset();
      } else {
        return response
          .json()
          .then((data) => {
            console.log("Error response data:", data);
            if (Object.hasOwnProperty.call(data, "errors")) {
              showNotification(
                data["errors"].map((error) => error["message"]).join(", "),
                "error"
              );
            } else {
              showNotification(
                "Oops! There was a problem submitting your form",
                "error"
              );
            }
          })
          .catch(() => {
            showNotification(
              "Oops! There was a problem submitting your form",
              "error"
            );
          });
      }
    })
    .catch((error) => {
      console.error("Form submission error:", error);
      showNotification(
        "Oops! There was a problem submitting your form",
        "error"
      );
    })
    .finally(() => {
      // Restore button state
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    });
}

// Initialize copy buttons for zoom and livestream links
function initializeCopyButtons() {
  // Use event delegation to handle dynamically created buttons
  document.addEventListener("click", function (event) {
    if (
      event.target.closest(".copy-zoom-link") ||
      event.target.closest(".copy-livestream-link")
    ) {
      event.preventDefault();
      const button = event.target.closest("button");
      const link = button.getAttribute("data-link");
      if (link) {
        copyToClipboard(link);
      }
    }
  });
}
