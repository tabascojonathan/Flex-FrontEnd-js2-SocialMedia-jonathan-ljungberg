// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoGpJgdWrvewvXIbILWbVr1AIsKlb3FbE",
  authDomain: "socialmedia-javascript2.firebaseapp.com",
  projectId: "socialmedia-javascript2",
  storageBucket: "socialmedia-javascript2.appspot.com",
  messagingSenderId: "718105142531",
  appId: "1:718105142531:web:64165029cbbc71b6f67536",
  measurementId: "G-81TLN912SG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);