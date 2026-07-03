const questions = [
    {
        question: "What is a noun?",
        options: ["Run", "Book", "Quickly", "Beautiful"],
        answer: "Book"
    },
    {
        question: "Which sentence is correct?",
        options: [
            "He go to school",
            "He goes to school",
            "He going to school",
            "He gone to school"
        ],
        answer: "He goes to school"
    },
    {
        question: "Which word is an adjective?",
        options: [
            "Fast",
            "Table",
            "Jump",
            "Read"
        ],
        answer: "Fast"
    }
];

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionSpan = document.getElementById("total-question");
const progressFill = document.getElementById("progress-fill");

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

totalQuestionSpan.textContent = questions.length;

function loadQuestion() {

    const question = questions[currentQuestion];

    questionText.textContent = question.question;

    optionsContainer.innerHTML = "";

    question.options.forEach(option => {

        const optionDiv = document.createElement("div");

        optionDiv.classList.add("option");

        optionDiv.innerHTML = `
            <label>
                <input
                    type="radio"
                    name="answer"
                    value="${option}"
                    ${userAnswers[currentQuestion] === option ? "checked" : ""}
                >
                ${option}
            </label>
        `;

        optionsContainer.appendChild(optionDiv);

    });

    currentQuestionSpan.textContent = currentQuestion + 1;

    progressFill.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    prevBtn.disabled = currentQuestion === 0;

    if(currentQuestion === questions.length - 1){
        nextBtn.textContent = "Submit Quiz";
    }
    else{
        nextBtn.textContent = "Next";
    }
}

function saveAnswer() {

    const selectedOption =
        document.querySelector('input[name="answer"]:checked');

    if(selectedOption){
        userAnswers[currentQuestion] = selectedOption.value;
    }
}

nextBtn.addEventListener("click", () => {

    saveAnswer();

    if(currentQuestion === questions.length - 1){

        let score = 0;

        questions.forEach((question,index) => {

            if(userAnswers[index] === question.answer){
                score++;
            }

        });

        alert(
            `Quiz Completed!\n\nScore: ${score}/${questions.length}`
        );

        return;
    }

    currentQuestion++;

    loadQuestion();
});

prevBtn.addEventListener("click", () => {

    saveAnswer();

    if(currentQuestion > 0){
        currentQuestion--;
        loadQuestion();
    }

});

loadQuestion();