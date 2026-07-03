const apiBaseUrl = "http://localhost:5000/api";

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

function showMessage(message) {
    registerMessage.textContent = message;
}

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("registerName").value.trim();
    const rollNumber = document.getElementById("registerRoll").value.trim();
    const semester = document.getElementById("registerSemester").value;
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!registerForm.reportValidity()) {
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Password and confirm password do not match.");
        return;
    }

    try {
        showMessage("Creating account...");

        const response = await fetch(`${apiBaseUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName,
                rollNumber,
                semester,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Registration failed.");
            return;
        }

        localStorage.setItem("bcaHubToken", data.token);
        localStorage.setItem("bcaHubProfile", JSON.stringify(data.user));
        sessionStorage.setItem("bcaHubLoggedIn", "true");

        showMessage("Account created. Opening your profile...");

        window.setTimeout(() => {
            window.location.href = "profile/profile.html";
        }, 500);
    } catch {
        showMessage("Backend is not running. Start the backend server first.");
    }
});
