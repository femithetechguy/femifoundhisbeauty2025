# 📝 Formspree Integration Setup Guide

This guide will help you configure Formspree for all forms in your wedding website.

## 🚀 Quick Setup

### 1. Create Formspree Account
1. Visit [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Verify your email address

### 2. Create Forms in Formspree Dashboard

You need to create **3 separate forms** in your Formspree dashboard:

#### Form 1: RSVP Form
- **Name**: "Wedding RSVP"
- **Description**: "Guest RSVP responses for Beauty & Femi 2025"

#### Form 2: Contact Form  
- **Name**: "Wedding Contact"
- **Description**: "General inquiries for Beauty & Femi 2025"

#### Form 3: Gallery Upload
- **Name**: "Photo Upload"
- **Description**: "Guest photo submissions for Beauty & Femi 2025"

### 3. Get Form IDs

After creating each form, Formspree will provide you with a unique form ID (looks like `xpzgkqyw`).

### 4. Update JSON Configuration

Edit `json/wedding_outline.json` and replace the placeholder IDs:

```json
{
  "sections": [
    {
      "id": "rsvp",
      "content": {
        "form": {
          "formspreeId": "YOUR_ACTUAL_RSVP_FORMSPREE_ID",
          "action": "https://formspree.io/f/YOUR_ACTUAL_RSVP_FORMSPREE_ID"
        }
      }
    },
    {
      "id": "contact",
      "content": {
        "form": {
          "formspreeId": "YOUR_ACTUAL_CONTACT_FORMSPREE_ID", 
          "action": "https://formspree.io/f/YOUR_ACTUAL_CONTACT_FORMSPREE_ID"
        }
      }
    },
    {
      "id": "gallery",
      "content": {
        "uploadForm": {
          "formspreeId": "YOUR_ACTUAL_GALLERY_FORMSPREE_ID",
          "action": "https://formspree.io/f/YOUR_ACTUAL_GALLERY_FORMSPREE_ID"
        }
      }
    }
  ]
}
```

## 📧 Email Configuration

### Notification Emails
Formspree will send form submissions to your email. Configure this in each form's settings:

1. **RSVP Form**: Set notification email to your wedding planning email
2. **Contact Form**: Set to your main contact email  
3. **Gallery Upload**: Set to email where you want photo submissions

### Auto-Reply Messages
Set up custom auto-reply messages for each form:

#### RSVP Auto-Reply
```
Subject: RSVP Confirmation - Beauty & Femi 2025

Thank you for your RSVP! We're so excited to celebrate with you on December 31st, 2025.

We'll be in touch with more details as the wedding approaches.

With love,
Beauty & Femi
```

#### Contact Auto-Reply
```
Subject: Thank you for contacting us - Beauty & Femi 2025

Thank you for reaching out! We've received your message and will get back to you soon.

Best regards,
Beauty & Femi
```

#### Gallery Auto-Reply
```
Subject: Photo Upload Received - Beauty & Femi 2025

Thank you for sharing your photos with us! We love seeing memories from our special day.

Your photos will be reviewed and added to our gallery soon.

Love,
Beauty & Femi
```

## 🔧 Advanced Configuration

### Spam Protection
Enable reCAPTCHA in Formspree settings for each form to prevent spam.

### Custom Redirects
Forms are configured to redirect back to your site with success parameters:
- RSVP: `yoursite.com/rsvp.html?success=true`
- Contact: `yoursite.com/index.html#contact`
- Gallery: `yoursite.com/gallery.html?success=true`

### File Upload Settings
For the gallery form, configure these settings in Formspree:
- **Max file size**: 10MB per file
- **Allowed file types**: JPG, PNG, GIF
- **Max files per submission**: 10

## 🎯 Form Field Mapping

### RSVP Form Fields
- `firstName` - Guest's first name
- `lastName` - Guest's last name  
- `email` - Guest's email address
- `phone` - Guest's phone number (optional)
- `attendance` - Yes/No attendance response
- `guestCount` - Number of guests (1-4)
- `mealPreference` - Meal choice selection
- `dietaryRestrictions` - Special dietary needs
- `message` - Special message from guest
- `guest2Name`, `guest3Name`, etc. - Additional guest names
- `_timestamp` - Form submission timestamp

### Contact Form Fields  
- `name` - Sender's name
- `email` - Sender's email
- `subject` - Message subject
- `message` - Message content
- `_timestamp` - Form submission timestamp

### Gallery Upload Fields
- `uploaderName` - Photo uploader's name
- `uploaderEmail` - Photo uploader's email  
- `photoCategory` - Photo category selection
- `photoFiles` - Uploaded image files
- `_timestamp` - Form submission timestamp

## 🚨 Testing

### Test Each Form
1. **RSVP Form**: Submit a test RSVP at `/rsvp.html`
2. **Contact Form**: Send a test message from the contact section
3. **Gallery Upload**: Upload a test photo at `/gallery.html`

### Verify Submissions
Check your Formspree dashboard to ensure submissions are received correctly.

## 📱 Features Included

✅ **Form Validation**: Client-side validation before submission  
✅ **Loading States**: Visual feedback during form submission  
✅ **Success Messages**: User-friendly confirmation messages  
✅ **Error Handling**: Graceful error messages for failed submissions  
✅ **Responsive Design**: Works perfectly on all devices  
✅ **Spam Protection**: Honeypot fields and reCAPTCHA support  
✅ **File Uploads**: Support for photo uploads in gallery  
✅ **Auto-redirect**: Seamless user experience after submission  

## 🎉 You're All Set!

Once you've updated the JSON file with your actual Formspree IDs, your wedding website will have fully functional forms that:

- Collect RSVP responses with meal preferences
- Handle contact inquiries 
- Accept photo uploads from guests
- Send confirmation emails
- Provide beautiful user feedback
- Work reliably across all devices

Your guests will have a smooth, professional experience when interacting with your wedding website!

---

**Need Help?** 
- Formspree Documentation: [docs.formspree.io](https://docs.formspree.io)
- Support: Contact Formspree support for technical issues
