const learningStatsKey = "bcaHubLearningStats";
const profileKey = "bcaHubProfile";
const tokenKey = "bcaHubToken";
const apiBaseUrl = "https://collegeprojectfinal-1.onrender.com/api";

function getProfile() {
    try {
        return JSON.parse(localStorage.getItem(profileKey)) || {};
    } catch {
        return {};
    }
}

function getDisplayName(profile = getProfile()) {
    return profile.fullName || profile.name || "Student";
}

function getDashboardAvatar(profile) {
    const avatar = profile.avatar || "assets/images/profile.png";

    if (avatar.startsWith("../assets/")) {
        return avatar.replace("../assets/", "assets/");
    }

    return avatar;
}

function renderUserDetails() {
    const profile = getProfile();
    const displayName = getDisplayName(profile);
    const course = profile.course || "BCA Student";
    const avatar = getDashboardAvatar(profile);
    const topWelcome = document.querySelector(".top-left p");
    const bannerTitle = document.querySelector(".welcome-left h1");
    const profileName = document.querySelector(".profile-text h4");
    const profileCourse = document.querySelector(".profile-text span");
    const profileImage = document.querySelector(".profile img");
    const profileBox = document.querySelector(".profile");

    if (topWelcome) {
        topWelcome.textContent = `Welcome back, ${displayName}`;
    }

    if (bannerTitle) {
        bannerTitle.textContent = "";
        bannerTitle.append("Welcome Back,");
        bannerTitle.append(document.createElement("br"));
        bannerTitle.append(displayName);
    }

    if (profileName) {
        profileName.textContent = displayName;
    }

    if (profileCourse) {
        profileCourse.textContent = course;
    }

    if (profileImage) {
        profileImage.src = avatar;
    }

    if (profileBox) {
        profileBox.addEventListener("click", () => {
            window.location.href = "./profile/profile.html";
        });
    }
}

function getLearningStats() {
    try {
        return JSON.parse(localStorage.getItem(learningStatsKey)) || {};
    } catch {
        return {};
    }
}

function saveLearningStats(stats) {
    localStorage.setItem(learningStatsKey, JSON.stringify(stats));
}

function calculateProgress(stats) {
    const quizzes = Array.isArray(stats.quizzes) ? stats.quizzes : [];
    const notes = Array.isArray(stats.notes) ? stats.notes : [];
    const averageScore = quizzes.length
        ? Math.round(quizzes.reduce((total, quiz) => total + Number(quiz.percent || 0), 0) / quizzes.length)
        : 0;
    const progress = Math.min(
        100,
        Math.min(notes.length * 8, 35) +
        Math.min(quizzes.length * 12, 45) +
        Math.round(averageScore * 0.2)
    );

    return {
        progress,
        quizzesTaken: quizzes.length,
        notesRead: notes.length,
        averageScore
    };
}

function updateProfileProgress(progressData) {
    const savedProfile = localStorage.getItem(profileKey);

    if (!savedProfile) {
        return;
    }

    try {
        const profile = JSON.parse(savedProfile);
        profile.completedCourses = String(progressData.notesRead);
        profile.quizScore = String(progressData.averageScore);
        profile.progress = String(progressData.progress);
        localStorage.setItem(profileKey, JSON.stringify(profile));
        syncProfileProgress(profile);
    } catch {
        // Login/profile pages can rebuild this cache if it is invalid.
    }
}

async function syncProfileProgress(profile) {
    const token = localStorage.getItem(tokenKey);

    if (!token) {
        return;
    }

    try {
        await fetch(`${apiBaseUrl}/profile/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(profile)
        });
    } catch {
        // Dashboard should still work offline; it will retry next time it renders.
    }
}

function getProgressMessage(progress) {
    if (progress >= 80) {
        return "Strong progress. Keep revising and testing.";
    }

    if (progress >= 45) {
        return "Good pace. Add more notes and quizzes.";
    }

    return "Start with notes, then attempt a quiz.";
}

function renderProgress() {
    const progressData = calculateProgress(getLearningStats());
    const circle = document.querySelector(".circle");
    const circleValue = document.querySelector(".circle h1");
    const progressList = document.querySelector(".progress-list");
    const statCards = document.querySelectorAll(".stats-card .card-content h2");

    if (circle) {
        const degrees = Math.round((progressData.progress / 100) * 360);
        circle.style.background = `conic-gradient(#6d5dfc 0deg, #6d5dfc ${degrees}deg, #e2e8f0 ${degrees}deg, #e2e8f0 360deg)`;
    }

    if (circleValue) {
        circleValue.textContent = `${progressData.progress}%`;
    }

    if (statCards.length >= 4) {
        statCards[0].textContent = progressData.notesRead;
        statCards[1].textContent = progressData.quizzesTaken;
        statCards[3].textContent = `${progressData.averageScore}%`;
    }

    if (progressList) {
        progressList.innerHTML = `
            <p>Notes read: ${progressData.notesRead}</p>
            <p>Quizzes completed: ${progressData.quizzesTaken}</p>
            <p>Average quiz score: ${progressData.averageScore}%</p>
            <p>${getProgressMessage(progressData.progress)}</p>
        `;
    }

    updateProfileProgress(progressData);
}

document.querySelectorAll(".note-card button").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".note-card");
        const title = card?.querySelector("h3")?.textContent?.trim() || "Dashboard Note";
        const stats = {
            quizzes: [],
            notes: [],
            ...getLearningStats()
        };

        if (!stats.notes.some((note) => note.noteId === title)) {
            stats.notes.push({
                noteId: title,
                title,
                readAt: new Date().toISOString()
            });
            saveLearningStats(stats);
            renderProgress();
        }
    });
});

renderUserDetails();
renderProgress();
