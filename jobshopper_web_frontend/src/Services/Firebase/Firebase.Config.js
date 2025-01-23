import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkC9m9LKWG0zsmuJaW7F0F9UuKqnE8mHg",
  authDomain: "jobsshopper-bb0c6.firebaseapp.com",
  projectId: "jobsshopper-bb0c6",
  storageBucket: "jobsshopper-bb0c6.appspot.com",
  messagingSenderId: "413907874410",
  appId: "1:413907874410:web:8f257fbbc96a3f0cd41013",
  measurementId: "G-SNR35DJV1W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);