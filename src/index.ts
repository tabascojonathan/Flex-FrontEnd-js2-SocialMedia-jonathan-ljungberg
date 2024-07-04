import { loginUser, registerUser, logoutUser } from "./auth";

// Create a variable to store the registered user's information
let registeredUser: { email: string, username: string, password: string } | null = null;

document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("regEmail") as HTMLInputElement;
    const passwordInput = document.getElementById("regPassword") as HTMLInputElement;
    const usernameInput = document.getElementById("username") as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    await registerUser(email, username, password);

    // Store the registered user's details
    registeredUser = { email, username, password };

    // Clear input fields after registration
    emailInput.value = '';
    passwordInput.value = '';
    usernameInput.value = '';
});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        const loginSuccessful = await loginUser(email, password);

        if (loginSuccessful) {
            document.getElementById("login-container")!.style.display = "none";
            document.getElementById("register-form")!.style.display = "none";
            const profilePage = document.getElementById("profile-page")!;
            profilePage.style.display = "block";
            const userEmailSpan = document.getElementById("email") as HTMLSpanElement;
            userEmailSpan.textContent = email;

            // Use the stored registeredUser object to get the username
            const usernameText = registeredUser ? registeredUser.username : 'Anonym';
            document.getElementById("username")!.textContent = usernameText;
        } else {
            alert("Inloggningen misslyckades. Försök igen.");
        }
    });

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn?.addEventListener("click", async () => {
        await logoutUser();

        document.getElementById("login-container")!.style.display = "block";
        document.getElementById("register-form")!.style.display = "block";
        document.getElementById("profile-page")!.style.display = "none";
    });
});