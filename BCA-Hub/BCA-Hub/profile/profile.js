const apiBaseUrl = "https://collegeprojectfinal-1.onrender.com/api";
const storageKey = "bcaHubProfile";
const tokenKey = "bcaHubToken";

const defaultProfile = {
    fullName: "Student Name",
    email: "",
    rollNumber: "",
    college: "",
    course: "BCA Student",
    semester: "Semester 1",
    completedCourses: "0",
    quizScore: "0",
    progress: "0",
    skills: "",
    about: "",
    avatar: "../assets/images/profile.png"
};

const fields = [
    "fullName",
    "email",
    "rollNumber",
    "college",
    "course",
    "semester",
    "completedCourses",
    "quizScore",
    "progress",
    "skills",
    "about"
];

const form = document.getElementById("profileForm");
const saveButton = document.getElementById("saveProfile");
const resetButton = document.getElementById("resetProfile");
const logoutButton = document.getElementById("logoutBtn");
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const saveStatus = document.getElementById("saveStatus");
const progressValue = document.getElementById("progressValue");

function getToken() {
    return localStorage.getItem(tokenKey);
}

function getCachedProfile() {
    const savedProfile = localStorage.getItem(storageKey);

    if (!savedProfile) {
        return { ...defaultProfile };
    }

    try {
        return { ...defaultProfile, ...JSON.parse(savedProfile) };
    } catch {
        return { ...defaultProfile };
    }
}

function collectProfile() {
    const profile = getCachedProfile();

    fields.forEach((field) => {
        const element = document.getElementById(field);
        profile[field] = element.value.trim();
    });

    profile.avatar = avatarPreview.getAttribute("src") || defaultProfile.avatar;
    return profile;
}

function fillForm(profile) {
    fields.forEach((field) => {
        document.getElementById(field).value = profile[field] ?? "";
    });

    avatarPreview.src = profile.avatar || defaultProfile.avatar;
    updatePreview(profile);
}

function updatePreview(profile = collectProfile()) {
    document.getElementById("displayName").textContent = profile.fullName || "Student Profile";
    document.getElementById("cardName").textContent = profile.fullName || "Student Name";
    document.getElementById("cardCourse").textContent = profile.course || "BCA Student";
    document.getElementById("cardSemester").textContent = profile.semester || "Semester";
    document.getElementById("cardRoll").textContent = profile.rollNumber || "Roll No";
    document.getElementById("statCourses").textContent = profile.completedCourses || "0";
    document.getElementById("statScore").textContent = profile.quizScore || "0";
    document.getElementById("statProgress").textContent = `${profile.progress || 0}%`;
    progressValue.textContent = `${profile.progress || 0}%`;
}

function showStatus(message) {
    saveStatus.textContent = message;
}

async function requestProfile(path, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error("Login required");
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

async function loadProfileFromBackend() {
    fillForm(getCachedProfile());

    if (!getToken()) {
        showStatus("Please login first");

        window.setTimeout(() => {
            window.location.href = "../login.html";
        }, 700);
        return;
    }

    try {
        const data = await requestProfile("/profile/me");
        localStorage.setItem(storageKey, JSON.stringify(data.user));
        fillForm({ ...defaultProfile, ...data.user });
        showStatus("");
    } catch (error) {
        showStatus(error.message);
    }
}

async function saveProfile() {
    if (!form.reportValidity()) {
        return;
    }

    try {
        showStatus("Saving...");

        const profile = collectProfile();
        const data = await requestProfile("/profile/me", {
            method: "PUT",
            body: JSON.stringify(profile)
        });

        localStorage.setItem(storageKey, JSON.stringify(data.user));
        fillForm({ ...defaultProfile, ...data.user });
        showStatus("Saved to MongoDB");

        window.clearTimeout(saveProfile.statusTimer);
        saveProfile.statusTimer = window.setTimeout(() => {
            showStatus("");
        }, 1800);
    } catch (error) {
        showStatus(error.message);
    }
}

form.addEventListener("input", () => updatePreview());
form.addEventListener("change", () => updatePreview());
saveButton.addEventListener("click", saveProfile);

resetButton.addEventListener("click", () => {
    loadProfileFromBackend();
    showStatus("Reloaded from MongoDB");
});

logoutButton.addEventListener("click", () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem("bcaHubLoggedIn");
    window.location.href = "../login.html";
});

avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        showStatus("Please choose an image");
        avatarInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        avatarPreview.src = reader.result;
        updatePreview();
    });

    reader.readAsDataURL(file);
});

loadProfileFromBackend();
