// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-9eed2.firebaseapp.com",
  projectId: "blog-9eed2",
  storageBucket: "blog-9eed2.firebasestorage.app",
  messagingSenderId: "670368737068",
  appId: "1:670368737068:web:d6a9f2c6e464e643722e89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);