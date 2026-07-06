(function () {
    const learningStatsKey = "bcaHubLearningStats";
    const noteId = window.location.pathname.replace(/\\/g, "/");
    const title = document.querySelector("h1")?.textContent?.trim() ||
        document.querySelector("title")?.textContent?.trim() ||
        "Notes";

    function getLearningStats() {
        try {
            return JSON.parse(localStorage.getItem(learningStatsKey)) || {};
        } catch {
            return {};
        }
    }

    function markNoteRead() {
        const stats = {
            quizzes: [],
            notes: [],
            ...getLearningStats()
        };

        if (stats.notes.some((note) => note.noteId === noteId)) {
            return;
        }

        stats.notes.push({
            noteId,
            title,
            readAt: new Date().toISOString()
        });

        localStorage.setItem(learningStatsKey, JSON.stringify(stats));
    }

    window.setTimeout(markNoteRead, 12000);
})();
