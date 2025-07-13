# Form Debugging Guide

## Forms Enhanced with Debugging
All forms in the wedding website now have enhanced debugging capabilities to help identify submission issues.

### Enhanced Forms
1. **RSVP Form** (`scripts/rsvp.js`)
2. **Contact Form** (`scripts/script.js`)
3. **Gallery Upload Form** (`scripts/gallery.js`)

### Debugging Features Added

#### Console Logging
All forms now log the following information to the browser console:
- Form type/action URL
- Form method (POST)
- Form data being submitted
- Response status and success state
- Error details if submission fails

#### Error Handling
Enhanced error handling that:
- Catches both network errors and Formspree validation errors
- Provides specific error messages from Formspree API
- Shows user-friendly fallback messages
- Restores form button states after completion

### How to Debug Form Issues

#### 1. Open Browser Developer Tools
- **Chrome/Safari**: Press `F12` or `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12` or `Cmd+Shift+I` (Mac)
- Go to the **Console** tab

#### 2. Submit a Form
When you submit any form, you'll see console output like:
```
Form type: rsvp
Form action: https://formspree.io/f/mgvzwven
Form method: POST
Form data: {name: "John Doe", email: "john@example.com", ...}
Response status: 200
Response ok: true
```

#### 3. Check for Errors
If there are issues, you'll see error logs like:
```
Response status: 422
Response ok: false
Error response data: {errors: [{message: "Email is required"}]}
```

### Common Issues and Solutions

#### 1. Form Not Submitting
**Symptoms**: No console logs appear when clicking submit
**Solutions**:
- Check if JavaScript files are loading properly
- Verify form has correct `id` attributes
- Ensure event listeners are attached

#### 2. Formspree Errors
**Symptoms**: Console shows 422 status with error messages
**Solutions**:
- Check required fields are filled
- Verify email addresses are valid
- Ensure file uploads aren't too large (Gallery form)

#### 3. Network Errors
**Symptoms**: Console shows "Form submission error" with network details
**Solutions**:
- Check internet connection
- Verify Formspree service status
- Try submitting from different browser/device

#### 4. Configuration Issues
**Symptoms**: Console shows incorrect action URLs or missing data
**Solutions**:
- Verify `wedding_outline.json` has correct Formspree IDs
- Check form configuration in JavaScript files
- Ensure JSON file is loading properly

### Current Formspree Configuration

From `wedding_outline.json`:
- **RSVP Form**: `mgvzwven`
- **Contact Form**: `xjkobkkb`
- **Gallery Form**: `mnnzanqe`

### Testing Checklist

1. ✅ Open browser developer tools
2. ✅ Navigate to form page
3. ✅ Fill out form with valid data
4. ✅ Submit form and check console logs
5. ✅ Verify success/error messages appear
6. ✅ Check Formspree dashboard for submissions

### Next Steps

If forms are still not working after these debugging enhancements:
1. Test each form individually with console open
2. Copy console output for analysis
3. Check Formspree dashboard for any received submissions
4. Verify form endpoints are active and properly configured

### Formspree Dashboard

Check your Formspree dashboard at https://formspree.io/forms to:
- View received submissions
- Check form configuration
- Monitor usage and errors
- Update form settings if needed
