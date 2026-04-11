import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVHdJMN_dJ0GGGtO-qCHCUDFsFAmAPlJw",
  authDomain: "fir-course-c5a50.firebaseapp.com",
  projectId: "fir-course-c5a50",
  storageBucket: "fir-course-c5a50.firebasestorage.app",
  messagingSenderId: "892770398416",
  appId: "1:892770398416:web:ff955c918695d177512ed5",
  measurementId: "G-B51KQ2W735",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
