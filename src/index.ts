import { getAuth, deleteUser } from 'firebase/auth';
import { loginUser, registerUser, logoutUser } from "./auth";
import { getUserInfo, addStatusUpdate, getUserPosts, updateBio, deleteUserData, getAllUsers } from "./database";

// Variabel för att lagra användarens ID
let userId: string | null = null;

// Variabel för att lagra registrerad användarinformation
let registeredUser: { email: string, username: string, password: string, profilePictureUrl: string } | null = null;

// Hantera registrering
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("regEmail") as HTMLInputElement;
    const passwordInput = document.getElementById("regPassword") as HTMLInputElement;
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const profilePictureSelect = document.getElementById("profilePicture") as HTMLSelectElement;

    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;
    const profilePictureUrl = profilePictureSelect.value;

    await registerUser(email, password, username, profilePictureUrl);

    // Lagra registrerad användarinformation
    registeredUser = { email, username, password, profilePictureUrl };

    // Rensa inputfält efter registrering
    emailInput.value = '';
    passwordInput.value = '';
    usernameInput.value = '';
    profilePictureSelect.value = '';
});


// Hantera inloggning
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    const loginSuccessful = await loginUser(email, password);

    if (loginSuccessful) {
        const user = getAuth().currentUser;
        if (user) {
            userId = user.uid;

            document.getElementById("login-container")!.style.display = "none";
            document.getElementById("register-form")!.style.display = "none";
            const profilePage = document.getElementById("profile-page")!;
            profilePage.style.display = "block";
            const userEmailSpan = document.getElementById("user-email") as HTMLSpanElement;
            userEmailSpan.textContent = email;

            // Hämta användarinformation från Firestore
            const userInfo = await getUserInfo(userId);
            console.log("Hämtad användarinformation:", userInfo);
            if (userInfo) {
                document.getElementById("user-username")!.textContent = userInfo.username || 'Anonym';
                document.getElementById("user-email")!.textContent = userInfo.email || '';
                document.getElementById("user-bio")!.textContent = userInfo.bio || 'Ingen biografi tillgänglig.';

                                // Hantera profilbild
                                const profilePictureElement = document.getElementById("profile-picture") as HTMLImageElement;
                                if (userInfo.profilePictureUrl) {
                                    profilePictureElement.src = userInfo.profilePictureUrl;
                                } else {
                                    profilePictureElement.src = 'fallback-profile-picture-url.jpg';
                                }
            } else {
                console.log("Användarinformation kunde inte hämtas.");
            }

            // Ladda statusuppdateringar
            loadStatusUpdates(userId);
// Ladda användarlista
loadUserList();
}
} else {
alert("Inloggningen misslyckades. Försök igen.");
}
});

// Hantera utloggning
document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await logoutUser();

    document.getElementById("login-container")!.style.display = "block";
    document.getElementById("register-form")!.style.display = "block";
    document.getElementById("profile-page")!.style.display = "none";
});

// Hantera statusuppdateringar
document.getElementById("status-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!userId) {
        alert("Du måste vara inloggad för att posta en statusuppdatering.");
        return;
    }
    const content = (document.getElementById("status-content") as HTMLTextAreaElement).value;
    await addStatusUpdate(userId, content);
    // Rensa formuläret efter att statusen har postats
    (document.getElementById("status-content") as HTMLTextAreaElement).value = "";
    // Ladda om statusuppdateringar
    loadStatusUpdates(userId);
});

// Hantera biografibyte
document.getElementById("edit-bio-btn")?.addEventListener("click", () => {
    document.getElementById("bio-form")!.style.display = "block";
});

document.getElementById("bio-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!userId) {
        alert("Du måste vara inloggad för att ändra din biografi.");
        return;
    }
    const bioContent = (document.getElementById("bio-content") as HTMLTextAreaElement).value;
    await updateBio(userId, bioContent);
    document.getElementById("user-bio")!.textContent = bioContent;
    document.getElementById("bio-form")!.style.display = "none";
});

// Hantera radering av konto
document.getElementById("delete-account-btn")?.addEventListener("click", async () => {
    if (!userId) {
        alert("Du måste vara inloggad för att radera ditt konto.");
        return;
    }

    const confirmation = confirm("Är du säker på att du vill radera ditt konto? Detta kan inte ångras.");
    if (confirmation) {
        try {
            // Radera användardata från Firestore
            await deleteUserData(userId);

            // Radera användarkonto från Authentication
            const user = getAuth().currentUser;
            if (user) {
                await deleteUser(user);
                alert("Ditt konto har raderats.");
                document.getElementById("login-container")!.style.display = "block";
                document.getElementById("register-form")!.style.display = "block";
                document.getElementById("profile-page")!.style.display = "none";
            }
        } catch (error) {
            console.error("Fel vid radering av konto:", error);
            alert("Ett fel uppstod vid radering av ditt konto. Försök igen.");
        }
    }
});

// Funktion för att ladda statusuppdateringar
const loadStatusUpdates = async (userId: string) => {
    const statusUpdatesContainer = document.getElementById("status-updates");
    const statusUpdates = await getUserPosts(userId);

    if (statusUpdatesContainer) {
        statusUpdatesContainer.innerHTML = ""; // Rensa befintligt innehåll
        statusUpdates.forEach((update) => {
            const updateElement = document.createElement("div");
            updateElement.textContent = `${update.timestamp.toDate().toLocaleString()}: ${update.content}`;
            statusUpdatesContainer.appendChild(updateElement);
        });
    }
};

// Funktion för att ladda användarlista
const loadUserList = async () => {
    const userListContainer = document.getElementById('user-list');
    const users = await getAllUsers();
    if (userListContainer) {
        userListContainer.innerHTML = ""; // Rensa befintligt innehåll
        users.forEach((user) => {
            const userElement = document.createElement("li");
            userElement.textContent = user.username;
            userElement.className = "user-list-item";
            userElement.addEventListener("click", () => {
                loadOtherUserProfile(user.id);
            });
            userListContainer.appendChild(userElement);
        });
    }
};

// Funktion för att ladda annan användares profil
const loadOtherUserProfile = async (otherUserId: string) => {
    const profilePage = document.getElementById('profile-page');
    const otherProfilePage = document.getElementById('other-profile-page');
    if (profilePage) profilePage.style.display = "none";
    if (otherProfilePage) otherProfilePage.style.display = "block";

    const otherUserInfo = await getUserInfo(otherUserId);

    if (otherUserInfo) {
        document.getElementById("other-user-username")!.textContent = otherUserInfo.username || 'Anonym';
        document.getElementById("other-user-email")!.textContent = otherUserInfo.email || '';
        document.getElementById("other-user-bio")!.textContent = otherUserInfo.bio || 'Ingen biografi tillgänglig.';

        const otherProfilePictureElement = document.getElementById("other-profile-picture") as HTMLImageElement;
        if (otherUserInfo.profilePictureUrl && otherUserInfo.profilePictureUrl.trim() !== '') {
            otherProfilePictureElement.src = otherUserInfo.profilePictureUrl;
        } else {
            otherProfilePictureElement.src = 'fallback-profile-picture-url.jpg';
        }

        const otherStatusUpdatesContainer = document.getElementById("other-status-updates");
        const otherUserPosts = await getUserPosts(otherUserId);

        if (otherStatusUpdatesContainer) {
            otherStatusUpdatesContainer.innerHTML = ""; // Rensa befintligt innehåll
            otherUserPosts.forEach((post) => {
                const postElement = document.createElement("div");
                postElement.textContent = `${post.timestamp.toDate().toLocaleString()}: ${post.content}`;
                otherStatusUpdatesContainer.appendChild(postElement);
            });
        }
    }
};
// Hantera tillbaka-knappen på annan användares profil
document.getElementById('back-to-profile')?.addEventListener('click', () => {
    document.getElementById('profile-page')!.style.display = 'block';
    document.getElementById('other-profile-page')!.style.display = 'none';
    });