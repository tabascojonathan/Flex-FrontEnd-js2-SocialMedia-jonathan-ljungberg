import { getFirestore, collection, getDocs, doc, getDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config'; // Importerar konfigurationen

// Initialisera Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface StatusUpdate {
    id: string;
    content: string;
    timestamp: Timestamp;
}

// Funktion för att hämta användarposter
export const getUserPosts = async (userId: string): Promise<StatusUpdate[]> => {
    const postsCollection = collection(db, `users/${userId}/posts`);
    const postSnapshot = await getDocs(postsCollection);
    const postsList = postSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as StatusUpdate[];
    return postsList;
};

// Funktion för att hämta användarinformation
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

// Lägg till en funktion för att skapa en statusuppdatering
export const addStatusUpdate = async (userId: string, content: string) => {
    const postRef = await addDoc(collection(db, `users/${userId}/posts`), {
        content: content,
        timestamp: serverTimestamp(),
    });
    return postRef.id;
};