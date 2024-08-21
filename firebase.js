import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDmZiaQc0SrGquabFIOP2Ghv6ydcHRpjbI",
  authDomain: "flashcard-saas-a4125.firebaseapp.com",
  projectId: "flashcard-saas-a4125",
  storageBucket: "flashcard-saas-a4125.appspot.com",
  messagingSenderId: "1097979790908",
  appId: "1:1097979790908:web:32fa8b7929500e308b2539",
  measurementId: "G-5PV2F9BQKM"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app,db };
