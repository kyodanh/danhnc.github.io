// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6kZeIRlFSTzmuXdB6-_1O4zesWtqux3w",
  authDomain: "blog-7acf4.firebaseapp.com",
  projectId: "blog-7acf4",
  storageBucket: "blog-7acf4.firebasestorage.app",
  messagingSenderId: "655626430493",
  appId: "1:655626430493:web:bf19af442941b583403ef4",
};

// Function to initialize Firebase
function initializeFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('Firebase library not loaded!');
            return false;
        }

        // Check if already initialized
        if (firebase.apps.length === 0) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase app initialized');
        }

        // Initialize Services
        window.firebaseAuth = firebase.auth();
        window.firebaseDB = firebase.firestore();
        window.firebaseStorage = firebase.storage();

        console.log('Firebase services initialized successfully');
        console.log('Storage bucket:', firebaseConfig.storageBucket);
        console.log('Storage ref:', window.firebaseStorage);

        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}

// Also expose the function globally
window.initializeFirebase = initializeFirebase;
