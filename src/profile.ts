import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Initialisera Firebase och Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funktion för att hämta en användares profilinformation
export const getUserProfile = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data();
    } else {
        console.log("Ingen sådan profil finns!");
        return null;
    }
};

// Funktion för att hämta en användares statusuppdateringar
export const getUserPosts = async (userId: string) => {
    const postsCollectionRef = collection(db, `users/${userId}/posts`);
    const querySnapshot = await getDocs(postsCollectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Funktion för att lägga till en ny statusuppdatering
export const addUserPost = async (userId: string, postContent: string) => {
    const postsCollectionRef = collection(db, `users/${userId}/posts`);
    const newPostRef = await addDoc(postsCollectionRef, {
        content: postContent,
        timestamp: Timestamp.fromDate(new Date()), // Använd Timestamp för att spara när posten skapades
    });

    return newPostRef.id; // Returnerar ID för den nya posten
};
