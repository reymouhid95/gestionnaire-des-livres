// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAomAQvk9O6T4w6eJ7cHUxe8KEV4444zU0",
  authDomain: "app-gestion-react.firebaseapp.com",
  projectId: "app-gestion-react",
  storageBucket: "app-gestion-react.appspot.com",
  messagingSenderId: "930726634508",
  appId: "1:930726634508:web:8634b7e3653da88abcba29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default { app, db, auth };
