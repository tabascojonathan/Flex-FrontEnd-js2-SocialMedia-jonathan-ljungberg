import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Initialisera Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Funktion för att registrera en ny användare
export const registerUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            password: password,
            email: email,
        })
        console.log("Registrerad användare:", userCredential.user);
    } catch (error) {
        console.error("Fel vid registrering:", error);
    }
};

// Funktion för att logga in en användare
export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Inloggad användare:", userCredential.user);

        // Anropa funktion för att visa profilsidan här
        showUserProfile(userCredential.user);
    } catch (error) {
        console.error("Fel vid inloggning:", error);
        alert("Fel vid inloggning: " + error);
    }
};

// Funktion som uppdaterar sidan för att visa användarens profil
const showUserProfile = (user) => {
    // Ersätt innehållet i #app (eller motsvarande element) med profilinformation
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `<h1>Välkommen, ${user.email}</h1>`;
        // Lägg till ytterligare profilinformation och interaktioner här
    }
};
