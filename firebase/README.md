# Firebase Integration for Wedding RSVP System

This directory contains the Firebase implementation for the wedding RSVP system, including form submission and admin dashboard.

## Files and Structure

### Firebase Configuration
- `firebase/config.js` - Firebase configuration and initialization

### RSVP Submission
- `scripts/rsvp-firebase.js` - Handles RSVP form submissions to Firebase Firestore

### Admin Dashboard
- `admin.html` - Admin dashboard user interface
- `firebase/admin.js` - Admin dashboard functionality
- `admin-setup.html` - Admin user setup interface
- `firebase/admin-setup.js` - Admin user creation and setup

## How It Works

1. **RSVP Form Submission**
   - Users fill out the RSVP form on the main page
   - Form data is submitted to Firebase Firestore
   - Conditional fields are handled based on attendance selection

2. **Admin Dashboard**
   - Secure login for admin users
   - View all RSVP submissions
   - Export data to CSV
   - Delete individual submissions
   - View summary statistics

## Authentication

Admin access is restricted to authorized email addresses as specified in the Firebase security rules.
