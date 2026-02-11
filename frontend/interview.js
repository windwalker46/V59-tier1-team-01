let flashcardsData = [];
let currentQuestions = [];
let currentIndex = 0;

let attemptsLeft = 2;
let correctCount = 0;
let wrongCount = 0;
let questionsShown = 0;
let pendingContinueAction = null;

const MAX_QUESTIONS = 5;

// Get selections from chosen options
function getSelections() {
  const params = new URLSearchParams(window.location.search);
  return {
    role: params.get("role"),
    tier: params.get("tier"),
    topic: params.get("topic")
  };
}

// Navigation function
function goHome() {
  window.location.href = "index.html";
}

// Feedback message
function clearFeedback() {
  const feedback = document.getElementById("answer_feedback");
  if (!feedback) return;

  feedback.classList.add("hidden");
  feedback.classList.remove("success", "error", "info");
  feedback.innerHTML = "";
  setContinueAction(null);
}

function setAnswerInputsDisabled(disabled) {
  document
    .querySelectorAll('input[name="answer"]')
    .forEach(input => {
      input.disabled = disabled;
    });
}

function setContinueAction(action) {
  pendingContinueAction = typeof action === "function" ? action : null;

  const continueButton = document.getElementById("continue_button");
  if (!continueButton) return;

  continueButton.disabled = pendingContinueAction === null;
}

function handleContinueClick() {
  if (typeof pendingContinueAction !== "function") return;

  const action = pendingContinueAction;
  clearFeedback();
  action();
}

// Show feedback message
function showFeedback(title, message, tone = "info", continueHandler = null) {
  const feedback = document.getElementById("answer_feedback");
  if (!feedback) return;

  const hasContinue = typeof continueHandler === "function";

  feedback.classList.remove("hidden", "success", "error", "info");
  feedback.classList.add(tone);
  feedback.innerHTML = `
    <p class="feedback_title">${title}</p>
    <p class="feedback_message">${message}</p>
  `;

  if (hasContinue) {
    document.getElementById("submit_answer").disabled = true;
    setAnswerInputsDisabled(true);
    setContinueAction(continueHandler);
    return;
  }

  setContinueAction(null);
  document.getElementById("submit_answer").disabled = false;
}

// Load JSON file
async function loadFlashcards() {
  const res = await fetch("flashcards.json");
  flashcardsData = await res.json();
}

// Get questions
function getQuestionsForRole(roleName) {
  const roleData = flashcardsData.find(r => r.role === roleName);
  return roleData ? roleData.flashcards : [];
}

// Show question and options
function showQuestion() {
  if (!currentQuestions.length) return;

  const q = currentQuestions[currentIndex];
  clearFeedback();
  document.getElementById("submit_answer").disabled = false;

  document.getElementById("question_progress").textContent =
    `Question ${questionsShown + 1} of ${MAX_QUESTIONS}`;

  document.getElementById("question_text").textContent = q.question;

  document.getElementById("attempts_text").textContent =
    `Attempts left: ${attemptsLeft}`;

  const container = document.getElementById("options_container");
  container.innerHTML = "";

  Object.entries(q.options).forEach(([letter, text]) => {
    const label = document.createElement("label");
    label.className = "option_row";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = letter;

    const textNode = document.createTextNode(` ${letter}) ${text}`);

    label.appendChild(input);
    label.appendChild(textNode);

    container.appendChild(label);
  });

  setAnswerInputsDisabled(false);
}

// Move to next question
function nextQuestion() {
  questionsShown++;

  if (questionsShown >= MAX_QUESTIONS) {
    showFinalScore();
    return;
  }

  attemptsLeft = 2;

  // pick another random question
  currentIndex = Math.floor(Math.random() * currentQuestions.length);

  showQuestion();
}

// Handle answer submission
function submitAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    showFeedback("Select an answer first", "Pick one option before submitting.", "info");
    return;
  }

  const q = currentQuestions[currentIndex];
  const chosen = selected.value;

  if (chosen === q.answer) {
    correctCount++;
    showFeedback("Correct", q.rationale, "success", nextQuestion);
  } else {
    attemptsLeft--;

    if (attemptsLeft <= 0) {
      wrongCount++;
      const message = `Correct answer: ${q.answer}\n\n${q.rationale}`;
      showFeedback("Out of attempts", message, "error", nextQuestion);
    } else {
      document.getElementById("attempts_text").textContent =
        `Attempts left: ${attemptsLeft}`;
      showFeedback("Not quite", `Try again. Attempts left: ${attemptsLeft}.`, "error");
    }
  }
}

// Show final score screen
function showFinalScore() {
  const container = document.getElementById("interview_container");

  const percent = Math.round((correctCount / MAX_QUESTIONS) * 100);

  container.innerHTML = `
    <h2>Interview Complete</h2>
    <h3>Results:</h3>

    <p>Correct: ${correctCount}</p>
    <p>Wrong: ${wrongCount}</p>
    <p>Total: ${MAX_QUESTIONS}</p>
    <p><strong>Percent: ${percent}%</strong></p>

    <div style="margin-top:20px;">
      <button onclick="window.location.href='index.html'">Back to Home</button>
    </div>
  `;
}

// Run when page has fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  const { role } = getSelections();

  await loadFlashcards();

  currentQuestions = getQuestionsForRole(role);

  currentIndex = Math.floor(Math.random() * currentQuestions.length);

  showQuestion();

  document
    .getElementById("submit_answer")
    .addEventListener("click", submitAnswer);

  document
    .querySelector(".back_button")
    .addEventListener("click", goHome);

  document
    .getElementById("continue_button")
    .addEventListener("click", handleContinueClick);
});
