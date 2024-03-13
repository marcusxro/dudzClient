// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrx3Pn7R0AO5a6EDWJrSrB8DuMTyLIVXo",
  authDomain: "authtwo-b53ff.firebaseapp.com",
  projectId: "authtwo-b53ff",
  storageBucket: "authtwo-b53ff.appspot.com",
  messagingSenderId: "870425635204",
  appId: "1:870425635204:web:fab3a1f75475bbed3fd5d1",
  measurementId: "G-T1HC860EP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth  = getAuth(app)