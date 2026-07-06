const params = new URLSearchParams(window.location.search);
const dataPath = params.get("data");
const subjectName = params.get("subject") || "BCA Quiz";
const quizTitle = params.get("title") || "Quiz";
const backPath = params.get("back") || "index.html";
const totalSeconds = Number(params.get("time") || 600);

let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let remainingSeconds = totalSeconds;
let timerId = null;
let startedAt = Date.now();
let submitted = false;
const learningStatsKey = "bcaHubLearningStats";

const subjectNameEl = document.getElementById("subject-name");
const quizTitleEl = document.getElementById("quiz-title");
const timerEl = document.getElementById("timer");
const questionNumberEl = document.getElementById("question-number");
const questionTextEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionSpan = document.getElementById("total-question");
const progressFill = document.querySelector(".progress-fill");
const nextBtn = document.getElementById("next-btn");
const nextBtnText = document.getElementById("next-btn-text");
const prevBtn = document.getElementById("prev-btn");
const resultPanel = document.getElementById("result-panel");

subjectNameEl.textContent = subjectName;
quizTitleEl.textContent = quizTitle;
document.title = `${subjectName} - ${quizTitle}`;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
}

function normalizeAnswer(answer) {
    return typeof answer === "number" ? answer : String(answer);
}

function getCorrectAnswer(question) {
    return normalizeAnswer(question.answer);
}

function isCorrectAnswer(question, selectedIndex) {
    if (selectedIndex === null || selectedIndex === undefined) {
        return false;
    }

    if (typeof question.answer === "number") {
        return selectedIndex === question.answer;
    }

    return question.options[selectedIndex] === question.answer;
}

function setError(message) {
    questionNumberEl.textContent = "Quiz not available";
    questionTextEl.textContent = message;
    optionsContainer.innerHTML = "";
    nextBtn.disabled = true;
    prevBtn.disabled = true;
}

async function loadQuiz() {
    if (!dataPath) {
        setError("Quiz data link missing hai.");
        return;
    }

    try {
        const response = await fetch(dataPath);

        if (!response.ok) {
            throw new Error("Quiz file not found");
        }

        questions = await response.json();

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("Quiz file empty hai");
        }

        userAnswers = new Array(questions.length).fill(null);
        totalQuestionSpan.textContent = questions.length;
        timerEl.textContent = formatTime(remainingSeconds);
        startedAt = Date.now();
        loadQuestion();
        startTimer();
    }
    catch (error) {
        setError("Is quiz ka JSON data load nahi ho paya. Local server se open karke try karo.");
    }
}

function startTimer() {
    clearInterval(timerId);

    timerId = setInterval(() => {
        remainingSeconds--;
        timerEl.textContent = formatTime(remainingSeconds);

        if (remainingSeconds <= 60) {
            timerEl.style.color = "#ef4444";
        }

        if (remainingSeconds <= 0) {
            submitQuiz();
        }
    }, 1000);
}

function loadQuestion() {
    const question = questions[currentQuestion];

    questionNumberEl.textContent = `Question ${currentQuestion + 1}`;
    questionTextEl.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestion + 1;
    progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const optionId = `option-${index}`;
        const optionDiv = document.createElement("div");
        optionDiv.className = "option";

        if (userAnswers[currentQuestion] === index) {
            optionDiv.classList.add("selected");
        }

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.id = optionId;
        input.value = index;
        input.checked = userAnswers[currentQuestion] === index;

        const label = document.createElement("label");
        label.htmlFor = optionId;
        label.textContent = option;

        optionDiv.append(input, label);

        optionDiv.addEventListener("click", () => {
            userAnswers[currentQuestion] = index;
            loadQuestion();
        });

        optionsContainer.appendChild(optionDiv);
    });

    prevBtn.disabled = currentQuestion === 0;
    nextBtnText.textContent = currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next";
}

function saveAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (selectedOption) {
        userAnswers[currentQuestion] = Number(selectedOption.value);
    }
}

function submitQuiz() {
    if (submitted) {
        return;
    }

    submitted = true;
    saveAnswer();
    clearInterval(timerId);

    let correct = 0;

    questions.forEach((question, index) => {
        if (isCorrectAnswer(question, userAnswers[index])) {
            correct++;
        }
    });

    const total = questions.length;
    const wrong = total - correct;
    const percent = Math.round((correct / total) * 100);
    const timeTaken = Math.min(totalSeconds, Math.floor((Date.now() - startedAt) / 1000));
    saveQuizProgress({
        quizId: `${subjectName}-${quizTitle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        subject: subjectName,
        title: quizTitle,
        correct,
        total,
        percent,
        timeTaken,
        completedAt: new Date().toISOString()
    });

    document.getElementById("score-percent").textContent = `${percent}%`;
    document.getElementById("correct-count").textContent = correct;
    document.getElementById("wrong-count").textContent = wrong;
    document.getElementById("total-count").textContent = total;
    document.getElementById("time-taken").textContent = formatTime(timeTaken);
    document.getElementById("result-message").textContent =
        percent >= 80 ? "Great work, strong performance." :
        percent >= 50 ? "Good effort, keep practicing." :
        "Keep revising and try again.";

    resultPanel.hidden = false;
}

function getLearningStats() {
    try {
        return JSON.parse(localStorage.getItem(learningStatsKey)) || {};
    } catch {
        return {};
    }
}

function saveQuizProgress(result) {
    const stats = {
        quizzes: [],
        notes: [],
        ...getLearningStats()
    };

    const existingIndex = stats.quizzes.findIndex((quiz) => quiz.quizId === result.quizId);

    if (existingIndex >= 0) {
        stats.quizzes[existingIndex] = result;
    } else {
        stats.quizzes.push(result);
    }

    localStorage.setItem(learningStatsKey, JSON.stringify(stats));
}

nextBtn.addEventListener("click", () => {
    saveAnswer();

    if (currentQuestion === questions.length - 1) {
        submitQuiz();
        return;
    }

    currentQuestion++;
    loadQuestion();
});

prevBtn.addEventListener("click", () => {
    saveAnswer();

    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

document.getElementById("retry-btn").addEventListener("click", () => {
    window.location.reload();
});

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = backPath;
});

loadQuiz();
