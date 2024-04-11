import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
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

export const getUserInfo = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data(); // Returnerar hela användardokumentet
    } else {
        console.log("Ingen sådan användare finns!");
        return null;
    }
};