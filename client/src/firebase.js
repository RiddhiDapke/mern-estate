// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-project-5ff47.firebaseapp.com",
  projectId: "estate-project-5ff47",
  storageBucket: "estate-project-5ff47.firebasestorage.app",
  messagingSenderId: "754687381060",
  appId: "1:754687381060:web:5e7837c3b2e59b1cf5b611"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);