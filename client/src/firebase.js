// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-d5abf.firebaseapp.com",
  projectId: "mern-estate-d5abf",
  storageBucket: "mern-estate-d5abf.firebasestorage.app",
  messagingSenderId: "372500880719",
  appId: "1:372500880719:web:50244fda4ac4ca4487b93a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);