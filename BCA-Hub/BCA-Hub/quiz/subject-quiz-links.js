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
        if (semester === "semester1") {
            return `../quizzes/${semester}/${dataSubject}/${quizId}.json`;
        }

        if (semester === "semester2") {
            return `../semester2/${dataSubject}/${quizId}.json`;
        }

        return `../quizzes/${semester}/${dataSubject}/${quizId}.json`;
    }

    function getMinutes(card) {
        const timeLine = Array.from(card.querySelectorAll("p"))
            .map((item) => item.textContent.trim())
            .find((text) => text.toLowerCase().includes("minute"));

        const minutes = Number(timeLine?.match(/\d+/)?.[0] || 10);
        return minutes;
    }

    document.querySelectorAll(".quiz-card").forEach((card) => {
        const title = card.querySelector("h3")?.textContent.trim() || "Quiz";
        const button = card.querySelector("button");
        const quizId = getQuizId(title);

        if (!button || !quizId) {
            return;
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
