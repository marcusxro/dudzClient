// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvQGqwPn5e-uYh-aFE1cp9NbYGHuu1IAw",
  authDomain: "auththree-a009c.firebaseapp.com",
  projectId: "auththree-a009c",
  storageBucket: "auththree-a009c.appspot.com",
  messagingSenderId: "1006676809341",
  appId: "1:1006676809341:web:65bbac38ae30ccc94c4314"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "Provider 1");

export const Authentication  = getAuth(app)



const adminConfig = {
  apiKey: "AIzaSyDGztUytTR3tanG7mPuopZpKHeAZbkWmA0",
  authDomain: "admin-c27d9.firebaseapp.com",
  projectId: "admin-c27d9",
  storageBucket: "admin-c27d9.appspot.com",
  messagingSenderId: "289783491216",
  appId: "1:289783491216:web:2a577b095389485916c615"
};

// Initialize Firebase
const admin = initializeApp(adminConfig, "Provider 2");

export const AdminAuth  = getAuth(admin)