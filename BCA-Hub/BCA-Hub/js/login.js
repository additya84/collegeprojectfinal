const apiBaseUrl = "http://localhost:5000/api";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showMessage(message) {
    loginMessage.textContent = message;
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!loginForm.reportValidity()) {
        return;
    }

    try {
        showMessage("Logging in...");

        const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Login failed.");
            return;
        }

        localStorage.setItem("bcaHubToken", data.token);
        localStorage.setItem("bcaHubProfile", JSON.stringify(data.user));
        sessionStorage.setItem("bcaHubLoggedIn", "true");

        showMessage("Login successful.");

        window.setTimeout(() => {
            window.location.href = "profile/profile.html";
        }, 400);
    } catch {
        showMessage("Backend is not running. Start the backend server first.");
    }
});
