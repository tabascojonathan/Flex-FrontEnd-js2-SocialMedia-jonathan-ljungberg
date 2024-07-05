import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Initialisera Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Registrera ny användare
export const registerUser = async (email: string, password: string, username: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Skapa användarprofil i Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            username: username,
            bio: '', // Tom bio vid registrering
            profilePictureUrl: '' // Standard eller tom profilbild vid registrering
        });

        console.log("Användare registrerad med e-post:", email);
    } catch (error) {
        console.error("Fel vid registrering:", error);
    }
};

// Logga in användare
export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Inloggad användare:", userCredential.user);
        return true;
    } catch (error) {
        console.error("Fel vid inloggning:", error);
        return false;
    }
};

// Logga ut användare
export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
        console.log("Utloggad");
    } catch (error) {
        console.error("Fel vid utloggning:", error);
    }
};