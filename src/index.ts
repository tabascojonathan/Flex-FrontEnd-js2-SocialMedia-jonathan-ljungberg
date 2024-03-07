import { loginUser } from "./auth";
import { registerUser } from "./auth";

document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("regEmail") as HTMLInputElement).value;
    const password = (document.getElementById("regPassword") as HTMLInputElement).value;
    //const username = (document.getElementById("username") as HTMLInputElement).value;

    await registerUser(email, password);
});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = (document.getElementById("email") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;
            await loginUser(email, password);
        });
    }
});
