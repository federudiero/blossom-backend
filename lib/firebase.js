import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLBofxgt6Cv6MyNxTGbShqsiQbH_Rl4hA",
  authDomain: "blossom-b2a50.firebaseapp.com",
  projectId: "blossom-b2a50",
  storageBucket: "blossom-b2a50.firebasestorage.app",
  messagingSenderId: "352561796016",
  appId: "1:352561796016:web:87ad55da40784c66633c75"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);