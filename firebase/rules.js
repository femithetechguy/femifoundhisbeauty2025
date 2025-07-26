rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if the user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Function to check if the user is an admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email in ['ewafemi@gmail.com'];
    }
    
    // RSVPs collection (your confirmed collection)
    match /rsvps/{document} {
      // Allow anyone to create RSVP entries
      allow create: if true;
      // Only allow admins to read, update, or delete entries
      allow read, update, delete: if isAdmin();
    }
    
    // Admin collection - only admin can read/write
    match /admin/{document} {
      allow read, write: if isAdmin();
    }
    
    // Any other collection - only admins can access
    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}