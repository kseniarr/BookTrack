// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoXnpKrZySctxwilTHD49m3xTCvQbUH8E",
    authDomain: "local-catfish-350609.firebaseapp.com",
    projectId: "local-catfish-350609",
    storageBucket: "local-catfish-350609.appspot.com",
    messagingSenderId: "924011898371",
    appId: "1:924011898371:web:c7e1d9811cd65661d6d036"
  };

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };