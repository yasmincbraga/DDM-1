import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from './app';

const firebaseConfig = {
  apiKey: "AIzaSyDywBfZho0EUd0lSx7rKdxJ7Wq_ces0Z5g",
  authDomain: "auladdm-c05fb.firebaseapp.com",
  projectId: "auladdm-c05fb",
  storageBucket: "auladdm-c05fb.firebasestorage.app",
  messagingSenderId: "795946891916",
  appId: "1:795946891916:web:7c4aee27a55ba1253359a9"
};

export const auth = getAuth(app);
export const db = getFirestore(app);
