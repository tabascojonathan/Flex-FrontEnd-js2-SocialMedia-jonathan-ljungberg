import { getFirestore, collection, getDocs, doc, getDoc, addDoc, serverTimestamp, Timestamp, updateDoc, deleteDoc, query, } from 'firebase/firestore';
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
interface User {
    id: string;
    username: string;
    email: string;
    profilePictureUrl: string;
    bio?: string;
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

// Lägg till en funktion för att uppdatera biografi
export const updateBio = async (userId: string, bio: string) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        bio: bio
    });
};

// Lägg till en funktion för att radera användarens data
export const deleteUserData = async (userId: string) => {
    // Radera användarens posts
    const postsQuery = query(collection(db, `users/${userId}/posts`));
    const postsSnapshot = await getDocs(postsQuery);
    const deletePromises = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Radera användardokumentet
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
};

// Lägg till en funktion för att hämta alla användare
export const getAllUsers = async (): Promise<User[]> => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersList: User[] = usersSnapshot.docs.map(doc => {
        const data = doc.data() as Omit<User, 'id'>;
        return { id: doc.id, ...data };
    });
    return usersList;
};