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
  apiKey: "AIzaSyAauSvZZEFY4LCUXUcZ4naRhTpakHMkL84",
  authDomain: "book-app-react-afdba.firebaseapp.com",
  projectId: "book-app-react-afdba",
  storageBucket: "book-app-react-afdba.appspot.com",
  messagingSenderId: "777619475154",
  appId: "1:777619475154:web:96baee513e68b15cf1fb0b",
  measurementId: "G-6CTD8LXRM2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const provider = new FacebookAuthProvider();

export { db, auth, googleProvider, provider };