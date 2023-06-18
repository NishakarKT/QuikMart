import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCyHMTpdSkMErh-WxGS-pkZ_ZR9SqWh5Lk",
    authDomain: "mycompany-d58f3.firebaseapp.com",
    projectId: "mycompany-d58f3",
    storageBucket: "mycompany-d58f3.appspot.com",
    messagingSenderId: "1084628427265",
    appId: "1:1084628427265:web:e65a61caaa42e16c845600",
    measurementId: "G-K84C6QSXW4"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();