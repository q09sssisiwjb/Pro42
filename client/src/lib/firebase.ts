// Firebase authentication configuration - based on blueprint:firebase_barebones_javascript
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCesMHXYJ9nFHi-AAK9ubKJ3bl2LcCCpSU",
  authDomain: "neuravision-auth.firebaseapp.com",
  databaseURL: "https://neuravision-auth-default-rtdb.firebaseio.com",
  projectId: "neuravision-auth",
  storageBucket: "neuravision-auth.firebasestorage.app",
  messagingSenderId: "349816412688",
  appId: "1:349816412688:web:c54637486be3a21994c895",
  measurementId: "G-N3XYP3F5E2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signUpWithEmailAndPassword = async (email: string, password: string, username: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, {
    displayName: username,
  });
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logOut = async () => {
  await signOut(auth);
};

// Google authentication functions
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const signUpWithGoogle = async () => {
  // For Google authentication, signup and signin are the same process
  return signInWithGoogle();
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};