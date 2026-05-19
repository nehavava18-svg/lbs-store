import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
import {
  getFirestore
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxRGvcYf3iUwII7nTjcxmf8m_kCmm1wiM",
  authDomain: "lbsstore.firebaseapp.com",
  projectId: "lbsstore",
  storageBucket: "lbsstore.firebasestorage.app",
  messagingSenderId: "555102148328",
  appId: "1:555102148328:web:eb7de60ee81aa8e4f29b5d",
  measurementId: "G-MKV7X1HSR8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);