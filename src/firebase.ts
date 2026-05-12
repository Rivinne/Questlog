import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKFblYt2sUePOLd_Hsqrj85PF1jyu9Cvo",
  authDomain: "questlog-6ee60.firebaseapp.com",
  projectId: "questlog-6ee60",
  storageBucket: "questlog-6ee60.firebasestorage.app",
  messagingSenderId: "716096270786",
  appId: "1:716096270786:web:cb587d63e2efa8807d665b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
