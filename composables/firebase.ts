// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_7ABb_47BsJ8g-PnTxFzbwL1pASXO7ks",
  authDomain: "yuipapa-learn.firebaseapp.com",
  projectId: "yuipapa-learn",
  storageBucket: "yuipapa-learn.firebasestorage.app",
  messagingSenderId: "21134317217",
  appId: "1:21134317217:web:9878b22332d99ce3c0c2e0",
  measurementId: "G-F5KYKPRX29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//@ts-ignore
self.FIREBASE_APPCHECK_DEBUG_TOKEN = __debug__;

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfdA-QqAAAAABf3UdvqDe6TVj4Qqv1D7e3KtTwA"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});
