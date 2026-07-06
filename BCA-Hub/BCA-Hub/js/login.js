const apiBaseUrl = "http://localhost:5059/api";
const storageKey = "bcaHubProfile";
const tokenKey = "bcaHubToken";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showLoginMessage(message, isError = false) {
    loginMessage.textContent = message;
    loginMessage.style.color = isError ? "#dc2626" : "#16a34a";
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value
    };

    try {
        showLoginMessage("Checking login...");

        const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem(tokenKey, data.token);
        localStorage.setItem(storageKey, JSON.stringify({
            fullName: data.user.name,
            email: data.user.email,
            rollNumber: data.user.rollNumber,
            semester: data.user.semester,
            course: "BCA Student"
        }));
        sessionStorage.setItem("bcaHubLoggedIn", "true");

        showLoginMessage("Login successful. Opening BCA Hub...");

        window.setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    } catch (error) {
        showLoginMessage(error.message, true);
    }
});
