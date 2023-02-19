
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDtJMOIURYRl8I3J7Irg35OKL2N4LUJAbQ",
  authDomain: "krayennotion.firebaseapp.com",
  projectId: "krayennotion",
  storageBucket: "krayennotion.appspot.com",
  messagingSenderId: "1009808913425",
  appId: "1:1009808913425:web:67214e5cd054feb3daedb0",
  measurementId: "G-ZB4P0Q3T94"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
export { auth,db};

