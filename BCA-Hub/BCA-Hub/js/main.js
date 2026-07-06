const storageKey = "bcaHubProfile";
const tokenKey = "bcaHubToken";

const token = localStorage.getItem(tokenKey);
const savedProfile = localStorage.getItem(storageKey);

if (!token) {
    window.location.href = "login.html";
}

function getProfile() {
    if (!savedProfile) {
        return null;
    }

    try {
        return JSON.parse(savedProfile);
    } catch {
        return null;
    }
}

function updateLoggedInUi() {
    const profile = getProfile();

    if (!profile) {
        return;
    }

    const loginButton = document.getElementById("btn-1");
    const registerButton = document.getElementById("btn-2");
    const name = profile.fullName || profile.name || "Student";

    if (loginButton) {
        loginButton.textContent = name;
        loginButton.closest("a").href = "./profile/profile.html";
    }

    if (registerButton) {
        registerButton.textContent = "Logout";
        registerButton.closest("a").href = "#";
        registerButton.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem(tokenKey);
            localStorage.removeItem(storageKey);
            sessionStorage.removeItem("bcaHubLoggedIn");
            window.location.href = "login.html";
        });
    }
}

updateLoggedInUi();
