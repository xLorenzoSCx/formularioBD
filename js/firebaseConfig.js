// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoT7p9dsRskvuWm9YzxJMFaW6afFq3Lik",
  authDomain: "testeforms-363e9.firebaseapp.com",
  databaseURL: "https://testeforms-363e9-default-rtdb.firebaseio.com",
  projectId: "testeforms-363e9",
  storageBucket: "testeforms-363e9.firebasestorage.app",
  messagingSenderId: "184367365137",
  appId: "1:184367365137:web:858b085c60c3cf938445b0",
  measurementId: "G-YJ2T82ZHTY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, app };
