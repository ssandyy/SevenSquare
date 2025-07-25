// SSMart/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDo2XY9ivKQpgJGtO7m93ykrgYEdz71cgc",
    authDomain: "ecommerce-react-ssmart.firebaseapp.com",
    projectId: "ecommerce-react-ssmart",
    storageBucket: "ecommerce-react-ssmart.firebasestorage.app",
    messagingSenderId: "465600198228",
    appId: "1:465600198228:web:222b0b1db844926ffedfc1",
    measurementId: "G-HC6FXW4ZQH"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);