/**
 * Firebase Configuration Module
 *
 * Initializes and configures Firebase services for the application:
 * - Firebase Authentication for user management
 * - Cloud Firestore for data storage
 *
 * Uses environment variables for secure configuration management.
 * Fallback values are provided for development purposes.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object with environment variable support
// Environment variables should be set in .env file for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication service
export const auth = getAuth(app);

// Initialize and export Cloud Firestore database service
export const db = getFirestore(app);

export default app;
