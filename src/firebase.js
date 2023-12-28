import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBw6MnG3XTKpDJJqVeD2BGD6hX5iR50elQ",
    authDomain: "collectify-e6bbe.firebaseapp.com",
    databaseURL: "https://collectify-e6bbe-default-rtdb.firebaseio.com",
    projectId: "collectify-e6bbe",
    storageBucket: "collectifybucket",
    messagingSenderId: "4418173781",
    appId: "1:4418173781:web:38cb8bbc84bdd8f86b4ddc",
    measurementId: "G-R8F12GZCJ0"
  }; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);