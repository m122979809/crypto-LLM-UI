// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPIOrhoxaq2mtmNNFH-Ei7E-zcQl0P_WM",
  authDomain: "llm-backend-9ffb9.firebaseapp.com",
  projectId: "llm-backend-9ffb9",
  storageBucket: "llm-backend-9ffb9.firebasestorage.app",
  messagingSenderId: "512392006352",
  appId: "1:512392006352:web:c1674d850014df6aeaacd5",
  measurementId: "G-N8YD8KJ4ZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider() 