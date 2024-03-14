import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {  firebaseConfig } from './firebase-config'; //Importerar konfigurationen

// Använd samma Firebase-konfiguration som tidigare
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funktion för att hämta användarposter
export const getUserPosts = async (userId: string) => {
    const postsCollection = collection(db, `Users/${userId}/Posts`);
    const postSnapshot = await getDocs(postsCollection);
    const postsList = postSnapshot.docs.map(doc => doc.data());
    return postsList;
};

