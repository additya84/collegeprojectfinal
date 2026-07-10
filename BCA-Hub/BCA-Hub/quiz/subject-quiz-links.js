(function () {
    const pathParts = window.location.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1] || "";
    const semester = pathParts[pathParts.length - 2] || "";
    const subjectSlug = fileName.replace(".html", "");

    if (!semester.startsWith("semester") || fileName === "index.html") {
        return;
    }

    const subjectFolderMap = {
        "database-management-system": "dbms"
    };

    const dataSubject = subjectFolderMap[subjectSlug] || subjectSlug;
    const subjectLabel = document.querySelector(".badge")?.textContent.trim() ||
        document.querySelector("h1")?.textContent.trim() ||
        "BCA Quiz";

    function getQuizId(title) {
        const cleanTitle = title.toLowerCase();

        if (cleanTitle.includes("easy quiz 1")) return "easy1";
        if (cleanTitle.includes("easy quiz 2")) return "easy2";
        if (cleanTitle.includes("easy quiz 3")) return "easy3";
        if (cleanTitle.includes("moderate")) return "moderate";
        if (cleanTitle.includes("hard")) return "hard";
        if (cleanTitle.includes("mega")) return "mega";

        return "";
    }

    function getDataPath(quizId) {
        return `../quizzes/${semester}/${dataSubject}/${quizId}.json`;
    }

    function getMinutes(card) {
        const timeLine = Array.from(card.querySelectorAll("p"))
            .map((item) => item.textContent.trim())
            .find((text) => text.toLowerCase().includes("minute"));

        const minutes = Number(timeLine?.match(/\d+/)?.[0] || 10);
        return minutes;
    }

    const learningStatsKey = "bcaHubLearningStats";

    function getQuizResult(subject, title) {
        const quizId = `${subject}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        try {
            const stats = JSON.parse(localStorage.getItem(learningStatsKey));
            if (stats && stats.quizzes) {
                return stats.quizzes.find(q => q.quizId === quizId) || null;
            }
        } catch (e) {}
        return null;
    }

    function appendQuizResult(card, result) {
        const wrong = result.total - result.correct;
        const mins = Math.floor(result.timeTaken / 60);
        const secs = result.timeTaken % 60;
        const timeStr = secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;

        const div = document.createElement("div");
        div.className = "quiz-result";
        div.innerHTML =
            `<div class="qr-row"><span class="qr-correct">${result.correct} ✓</span><span class="qr-wrong">${wrong} ✗</span></div>` +
            `<div class="qr-row"><span class="qr-acc">${result.percent}% Accuracy</span><span class="qr-time">${timeStr}</span></div>`;
        card.appendChild(div);
    }

    document.querySelectorAll(".quiz-card").forEach((card) => {
        const title = card.querySelector("h3")?.textContent.trim() || "Quiz";
        const button = card.querySelector("button");
        const quizId = getQuizId(title);

        if (!button || !quizId) {
            return;
        }

        const result = getQuizResult(subjectLabel, title);
        if (result) {
            button.textContent = "Retake Quiz";
            appendQuizResult(card, result);
        }

        const data = getDataPath(quizId);
        const minutes = getMinutes(card);
        const back = `${semester}/${fileName}`;
        const quizUrl = `../quiz.html?data=${encodeURIComponent(data)}&subject=${encodeURIComponent(subjectLabel)}&title=${encodeURIComponent(title)}&time=${minutes * 60}&back=${encodeURIComponent(back)}`;

        button.type = "button";
        button.addEventListener("click", () => {
            window.location.href = quizUrl;
        });
    });
})();
