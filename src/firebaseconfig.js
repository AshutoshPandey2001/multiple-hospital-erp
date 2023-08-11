/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import { getAuth } from 'firebase/auth'; // Corrected import
import { getStorage } from 'firebase/storage'; // Corrected import
import 'firebase/compat/messaging';

// Your web app's Firebase configuration

// const firebaseConfigdev = {
//     apiKey: "AIzaSyDKCtFuLl-YTb1xPEiFw3Q3FKITejLIwdw",
//     authDomain: "hospital-erp-5a15e.firebaseapp.com",
//     projectId: "hospital-erp-5a15e",
//     storageBucket: "hospital-erp-5a15e.appspot.com",
//     messagingSenderId: "648026008961",
//     appId: "1:648026008961:web:fd1815921112be1d674c80"
// };

// const firebaseConfigprod = {
//     apiKey: "AIzaSyDgw5mpEFcJWmfPFDadaXdy9kVDartD2mw",
//     authDomain: "hospital-erp-prod-95573.firebaseapp.com",
//     projectId: "hospital-erp-prod-95573",
//     storageBucket: "hospital-erp-prod-95573.appspot.com",
//     messagingSenderId: "284851097698",
//     appId: "1:284851097698:web:05c668d60899a6fce7413b"
// };
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
let app = firebase.initializeApp(firebaseConfig);
// let app = undefined;
// // Initialize Firebase
// if (process.env.NODE_ENV === 'development') {
//     app = firebase.initializeApp(firebaseConfigdev);
// } else {
//     app = firebase.initializeApp(firebaseConfigprod);
// }

export const auth = getAuth(app);
export const db = firebase.firestore();
export const storage = getStorage(app);
export const messaging = firebase.messaging();
export default app;