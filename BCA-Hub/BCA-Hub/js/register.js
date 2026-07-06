const apiBaseUrl = "http://localhost:5059/api";

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

function showRegisterMessage(message, isError = false) {
    registerMessage.textContent = message;
    registerMessage.style.color = isError ? "#dc2626" : "#16a34a";
}

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showRegisterMessage("Passwords do not match", true);
        return;
    }

    const payload = {
        name: document.getElementById("registerName").value.trim(),
        rollNumber: document.getElementById("registerRoll").value.trim(),
        semester: document.getElementById("registerSemester").value,
        email: document.getElementById("registerEmail").value.trim(),
        password
    };

    try {
        showRegisterMessage("Creating account...");

        const response = await fetch(`${apiBaseUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        showRegisterMessage("Account created. Redirecting to login...");

        window.setTimeout(() => {
            window.location.href = "login.html";
        }, 900);
    } catch (error) {
        showRegisterMessage(error.message, true);
    }
});
