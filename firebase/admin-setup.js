// Firebase admin authentication setup
// This script should be run once to create the admin user

const createAdminUser = async () => {
  try {
    const firebase = initFirebase();
    const auth = firebase.auth();
    
    // Admin credentials
    const email = 'ewafemi@gmail.com';
    const password = prompt('Enter password for admin user:');
    
    if (!password) {
      console.error('Password is required');
      return;
    }
    
    // Create user with email and password
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    console.log('Admin user created successfully:', userCredential.user.uid);
    
    // Set custom claims (needs to be done via Cloud Functions or Admin SDK)
    alert('Admin user created successfully. Note: You need to set admin privileges in Firebase Console.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    alert(`Error: ${error.message}`);
  }
};

// Function to test admin login
const testAdminLogin = async () => {
  try {
    const firebase = initFirebase();
    const auth = firebase.auth();
    
    // Admin credentials
    const email = 'ewafemi@gmail.com';
    const password = prompt('Enter admin password to test login:');
    
    if (!password) {
      console.error('Password is required');
      return;
    }
    
    // Sign in
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log('Admin sign in successful:', userCredential.user.uid);
    alert('Admin login successful!');
    
    // Sign out after successful test
    await auth.signOut();
    console.log('Signed out after successful test');
    
  } catch (error) {
    console.error('Error testing admin login:', error);
    alert(`Login Error: ${error.message}`);
  }
};

// Expose functions
window.adminSetup = {
  createAdminUser,
  testAdminLogin
};
