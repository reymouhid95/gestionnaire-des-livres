// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAclnGzuO1WBERhddl6pGLUmWfjIDSXDuw",
  authDomain: "app-book-react.firebaseapp.com",
  projectId: "app-book-react",
  storageBucket: "app-book-react.appspot.com",
  messagingSenderId: "703578951549",
  appId: "1:703578951549:web:c92d461dd9c37e54e5c614",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const provider = new FacebookAuthProvider();

export { db, auth, googleProvider, provider };