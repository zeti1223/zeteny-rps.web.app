import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC6TuOgoVvleURMGpiU8GsAsvc4J-VhFv0",
    authDomain: "zeteny-rps.firebaseapp.com",
    projectId: "zeteny-rps",
    storageBucket: "zeteny-rps.firebasestorage.app",
    messagingSenderId: "341298757176",
    appId: "1:341298757176:web:137960b09a7beb341cf0cd",
    measurementId: "G-PZ4CGXGNJ9"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
