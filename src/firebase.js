// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjJgPPXx_U0LATEshUS3Z2z4iW4O5fBZs",
  authDomain: "monke-pod-song-list.firebaseapp.com",
  projectId: "monke-pod-song-list",
  storageBucket: "monke-pod-song-list.appspot.com",
  messagingSenderId: "872382148929",
  appId: "1:872382148929:web:fd3e7112cc489079e2f1c0",
  measurementId: "G-Y7M8XT5H56",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
