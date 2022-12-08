// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBilZocIVk2lQQVyljg2_gPGeQivEcsU9Q",
  authDomain: "daily-planner-5f81a.firebaseapp.com",
  projectId: "daily-planner-5f81a",
  storageBucket: "daily-planner-5f81a.appspot.com",
  messagingSenderId: "311533139954",
  appId: "1:311533139954:web:f10aad76e0b6fc798cdd6b",
  measurementId: "G-B4P7KR8KFX",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };