// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB5YOUcVf5MPzmFoxbsImQTqRrTTty63NI',
  authDomain: 'qurancms-ecf1e.firebaseapp.com',
  projectId: 'qurancms-ecf1e',
  storageBucket: 'qurancms-ecf1e.appspot.com',
  messagingSenderId: '338085357319',
  appId: '1:338085357319:web:9d2cbd9b22109fc7f807a2'
};
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export const surahCol = collection(db, 'surah');

export { app };
