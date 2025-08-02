import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * Authentication Context for managing user authentication state
 * 
 * Provides authentication functionality including:
 * - User signup and login
 * - User logout
 * - Current user state management
 * - Firebase integration for user data storage
 * - Real-time authentication state listening
 */
const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * 
 * @returns {Object} Authentication context value with user state and methods
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication context to all child components.
 * Manages user authentication state and provides methods for authentication operations.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const AuthProvider = ({ children }) => {
  // Current authenticated user state
  const [currentUser, setCurrentUser] = useState(null);
  // Loading state to prevent rendering before auth state is determined
  const [loading, setLoading] = useState(true);

  /**
   * Creates a new user account with email and password
   * Also sets up user profile and stores additional data in Firestore
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} name - User's display name
   * @returns {Promise<UserCredential>} Firebase UserCredential object
   * @throws {Error} Firebase authentication errors
   */
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      await updateProfile(user, {
        displayName: name
      });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Authenticates an existing user with email and password
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<UserCredential>} Firebase UserCredential object
   */
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Signs out the current user
   * 
   * @returns {Promise<void>} Promise that resolves when user is signed out
   */
  const logout = () => {
    return signOut(auth);
  };

  /**
   * Retrieves user data from Firestore database
   * 
   * @param {string} uid - User's unique identifier
   * @returns {Promise<Object|null>} User data object or null if not found
   */
  const getUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  };

  // Effect: Set up Firebase authentication state listener
  // Automatically updates currentUser when authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // Context value containing all authentication methods and state
  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
