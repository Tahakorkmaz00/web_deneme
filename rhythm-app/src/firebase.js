// Firebase Configuration for StrumFlow
// Firebase Console'dan proje olusturup asagidaki degerleri guncellemelisiniz:
// https://console.firebase.google.com/

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD2Qhwi5OEgRsUNviWk8P2e7ySJqhc0kZw",
    authDomain: "guitar-68cef.firebaseapp.com",
    projectId: "guitar-68cef",
    storageBucket: "guitar-68cef.firebasestorage.app",
    messagingSenderId: "683415808555",
    appId: "1:683415808555:web:c7d13922458e75a306586e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
