import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyACSAMvSWyEbJrKuRS0CwJVFm8MCFTI4uk",
    authDomain: "bitattendence.firebaseapp.com",
    projectId: "bitattendence",
    storageBucket: "bitattendence.appspot.com",
    messagingSenderId: "357500110658",
    appId: "1:357500110658:web:d073ae4cce5a5d6eda6adb",
    measurementId: "G-RZLTJY0LRT"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };