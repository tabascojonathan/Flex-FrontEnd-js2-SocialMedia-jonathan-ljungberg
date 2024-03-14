import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signOut, AuthError } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Initialisera Firebase-appen med din projektconfig
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Registrera ny användare
export const registerUser = async (email: string, username: string, password: string): Promise<void> => {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Skapar användarprofil i Firestore efter framgångsrik registrering
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            username: username
            // Lägg till ytterligare fält här vid behov, t.ex. användarnamn
        });

        console.log("Användare registrerad med e-post:", email);
        alert('Du är nu registrerad!');
    } catch (error) {
        const e = error as AuthError;
        console.error("Fel vid registrering:", e.message);
        alert(`Registreringsfel: ${e.message}`);
    }
};


// Funktion för att logga in en användare
export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Inloggad användare:", email);
        return true;
    } catch (error) {
        const e = error as AuthError;
        console.error("Fel vid inloggning:", e.message);
        return false;
    }
};

// Funktion för att logga ut användaren
export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
        console.log("Utloggad");
    } catch (error) {
        console.error("Fel vid utloggning:", error);
    }
};
