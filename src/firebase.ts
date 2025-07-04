// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6fWSTXppHQunlBMROUh2WNdWFaiBT1IQ",
  authDomain: "gestaoimobiliaria-98f0e.firebaseapp.com",
  projectId: "gestaoimobiliaria-98f0e",
  storageBucket: "gestaoimobiliaria-98f0e.firebasestorage.app",
  messagingSenderId: "699051241081",
  appId: "1:699051241081:web:8a631fdea55e4fac9ceea8",
  measurementId: "G-SP84JVWDD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app);