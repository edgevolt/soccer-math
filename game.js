/**
 * Soccer Math - Game Logic
 * A math game for 4th graders supporting multiplication and division
 */

// ========================================
// GAME CONFIGURATION
// ========================================

const CONFIG = {
    gameDuration: 600, // seconds (10 minutes)
    streakBonusThreshold: 3, // correct answers in a row for bonus

    // Difficulty levels with multiplication tables
    levels: {
        1: { name: 'Level 1', tables: [1, 2, 5, 10], minCorrect: 0 },
        2: { name: 'Level 2', tables: [3, 4, 6], minCorrect: 5 },
        3: { name: 'Level 3', tables: [7, 8, 9, 11, 12], minCorrect: 12 }
    },

    // Encouraging messages
    goalMessages: ['GOAL! ⚽', 'AMAZING! 🌟', 'BRILLIANT! ✨', 'SUPERSTAR! 🤩', 'HAT TRICK! 🎩'],
    missMessages: ['Try again!', 'So close!', 'Keep going!', 'You got this!']
};

// ========================================
// GAME STATE
// ========================================

let gameState = {
    isPlaying: false,
    score: 0,
    streak: 0,
    bestStreak: 0,
    currentLevel: 1,
    timeRemaining: CONFIG.gameDuration,
    totalQuestions: 0,
    correctAnswers: 0,
    currentQuestion: null,
    timerInterval: null,
    highScore: 0,

    // Game modes
    operationType: 'multiplication', // 'multiplication' or 'division'
    inputMode: 'typing', // 'choice' or 'typing' - determined by gameMode
    startingLevel: 1, // 1, 2, or 3
    gameMode: 'tournament' // 'practice' or 'tournament'
};

// ========================================
// DOM ELEMENTS
// ========================================

const elements = {
    // Screens
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameoverScreen: document.getElementById('gameover-screen'),

    // Start screen
    highScoreValue: document.getElementById('high-score-value'),
    startBtn: document.getElementById('start-btn'),
    operationToggle: document.getElementById('operation-toggle'),
    levelToggle: document.getElementById('level-toggle'),
    levelHint: document.getElementById('level-hint'),
    gameModeToggle: document.getElementById('game-mode-toggle'),
    gameModeHint: document.getElementById('game-mode-hint'),
    timerSection: document.getElementById('timer-section'),
    doneBtn: document.getElementById('done-btn'),

    // Game screen
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('timer'),
    streakDisplay: document.getElementById('streak'),
    streakFire: document.getElementById('streak-fire'),
    levelText: document.getElementById('level-text'),
    levelDots: [
        document.getElementById('dot-1'),
        document.getElementById('dot-2'),
        document.getElementById('dot-3')
    ],
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    operator: document.getElementById('operator'),
    questionCard: document.getElementById('question-card'),
    answersGrid: document.getElementById('answers-grid'),
    answerBtns: document.querySelectorAll('.answer-btn'),
    typingArea: document.getElementById('typing-area'),
    answerInput: document.getElementById('answer-input'),
    submitAnswerBtn: document.getElementById('submit-answer-btn'),
    ball: document.getElementById('ball'),
    goalArea: document.querySelector('.goal-area'),
    feedback: document.getElementById('feedback'),

    // Game over screen
    finalScore: document.getElementById('final-score'),
    finalStreak: document.getElementById('final-streak'),
    finalAccuracy: document.getElementById('final-accuracy'),
    newRecord: document.getElementById('new-record'),
    playAgainBtn: document.getElementById('play-again-btn'),
    homeBtn: document.getElementById('home-btn')
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Format seconds as M:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get a random item from an array
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ========================================
// LOCAL STORAGE
// ========================================

function getHighScoreKey() {
    return `soccerMath_${gameState.operationType}_${gameState.gameMode}_HighScore`;
}

function loadHighScore() {
    const key = getHighScoreKey();
    const saved = localStorage.getItem(key);
    gameState.highScore = saved ? parseInt(saved, 10) : 0;
    elements.highScoreValue.textContent = gameState.highScore;
}

function saveHighScore(score) {
    if (score > gameState.highScore) {
        gameState.highScore = score;
        localStorage.setItem(getHighScoreKey(), score.toString());
        return true; // New record
    }
    return false;
}

// ========================================
// MODE SELECTION
// ========================================

function initModeToggles() {
    // Operation toggle (multiplication / division)
    const operationBtns = elements.operationToggle.querySelectorAll('.toggle-btn');
    operationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            operationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.operationType = btn.dataset.value;
            loadHighScore(); // Update high score for selected mode
            updateLevelHint(); // Update hint to show correct operator
        });
    });

    // Level toggle (1 / 2 / 3)
    const levelBtns = elements.levelToggle.querySelectorAll('.toggle-btn');
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.startingLevel = parseInt(btn.dataset.value, 10);
            updateLevelHint();
        });
    });

    // Game mode toggle (practice / tournament)
    const gameModeBtns = elements.gameModeToggle.querySelectorAll('.toggle-btn');
    gameModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.gameMode = btn.dataset.value;
            // Set input mode based on game mode
            gameState.inputMode = btn.dataset.value === 'practice' ? 'choice' : 'typing';
            updateGameModeHint();
        });
    });
}

/**
 * Update the level hint text based on selected level and operation
 */
function updateLevelHint() {
    const level = gameState.startingLevel;
    const op = gameState.operationType === 'division' ? '÷' : '×';
    const tables = CONFIG.levels[level].tables;
    const hint = tables.map(t => `${op}${t}`).join(', ');
    elements.levelHint.textContent = hint;
}

/**
 * Update the game mode hint text
 */
function updateGameModeHint() {
    if (gameState.gameMode === 'practice') {
        elements.gameModeHint.textContent = 'Multiple choice • No timer';
    } else {
        elements.gameModeHint.textContent = 'Type answers • 10 minutes';
    }
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {
    // Hide all screens
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.gameoverScreen.classList.remove('active');

    // Show requested screen
    document.getElementById(screenId).classList.add('active');
}

// ========================================
// GAME LOGIC
// ========================================

/**
 * Determine current difficulty level based on score
 */
function updateLevel() {
    // Calculate what level should be based on correct answers
    let newLevel = gameState.startingLevel; // Never go below starting level

    if (gameState.correctAnswers >= CONFIG.levels[3].minCorrect) {
        newLevel = 3;
    } else if (gameState.correctAnswers >= CONFIG.levels[2].minCorrect) {
        newLevel = Math.max(2, gameState.startingLevel);
    }

    if (newLevel !== gameState.currentLevel) {
        gameState.currentLevel = newLevel;

        // Update UI
        elements.levelText.textContent = CONFIG.levels[newLevel].name;
        elements.levelDots.forEach((dot, index) => {
            dot.classList.toggle('active', index < newLevel);
        });
    }
}

/**
 * Generate a multiplication question based on current level
 */
function generateMultiplicationQuestion() {
    const level = CONFIG.levels[gameState.currentLevel];
    const tables = level.tables;

    // Pick a random multiplier from current level's tables
    const multiplier = randomChoice(tables);

    // Generate the other number (2-12 for 4th grade)
    const otherNum = randomInt(2, 12);

    // Randomly decide order
    const num1 = Math.random() > 0.5 ? multiplier : otherNum;
    const num2 = num1 === multiplier ? otherNum : multiplier;

    const correctAnswer = num1 * num2;

    // Generate distractor answers for multiple choice
    const distractors = generateMultiplicationDistractors(correctAnswer, num1, num2);
    const answers = shuffleArray([correctAnswer, ...distractors]);

    return {
        num1,
        num2,
        operator: '×',
        correctAnswer,
        answers
    };
}

/**
 * Generate a division question based on current level
 * Division is the inverse of multiplication to ensure whole number answers
 */
function generateDivisionQuestion() {
    const level = CONFIG.levels[gameState.currentLevel];
    const tables = level.tables;

    // Pick a divisor from current level's tables
    const divisor = randomChoice(tables);

    // Generate the quotient (result) - keep it reasonable for 4th grade
    const quotient = randomInt(2, 12);

    // Calculate the dividend (the number being divided)
    const dividend = divisor * quotient;

    // Generate distractor answers for multiple choice
    const distractors = generateDivisionDistractors(quotient, dividend, divisor);
    const answers = shuffleArray([quotient, ...distractors]);

    return {
        num1: dividend,
        num2: divisor,
        operator: '÷',
        correctAnswer: quotient,
        answers
    };
}

/**
 * Generate question based on current operation type
 */
function generateQuestion() {
    if (gameState.operationType === 'division') {
        return generateDivisionQuestion();
    }
    return generateMultiplicationQuestion();
}

/**
 * Generate plausible wrong answers for multiplication
 */
function generateMultiplicationDistractors(correct, num1, num2) {
    const distractors = new Set();

    // Common mistake patterns
    const patterns = [
        correct + num1,        // Added instead of multiplied once
        correct - num1,        // Subtracted once
        correct + num2,        // Added the other number
        correct - num2,        // Subtracted the other number  
        correct + 10,          // Off by 10
        correct - 10,          // Off by 10
        correct + 1,           // Off by 1
        correct - 1,           // Off by 1
        num1 + num2,           // Addition instead of multiplication
        (num1 + 1) * num2,     // Off by one on first number
        num1 * (num2 + 1),     // Off by one on second number
        (num1 - 1) * num2,     // Off by one (minus)
        num1 * (num2 - 1)      // Off by one (minus)
    ];

    // Add unique positive distractors
    for (const value of patterns) {
        if (value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
            if (distractors.size >= 3) break;
        }
    }

    // If still need more, add random nearby numbers
    while (distractors.size < 3) {
        const offset = randomInt(-15, 15);
        const value = correct + offset;
        if (value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
        }
    }

    return Array.from(distractors).slice(0, 3);
}

/**
 * Generate plausible wrong answers for division
 */
function generateDivisionDistractors(correct, dividend, divisor) {
    const distractors = new Set();

    // Common mistake patterns for division
    const patterns = [
        correct + 1,           // Off by 1
        correct - 1,           // Off by 1
        correct + 2,           // Off by 2
        correct - 2,           // Off by 2
        divisor,               // Confused divisor with quotient
        Math.floor(dividend / 10), // Wrong operation
        correct * 2,           // Double the answer
        Math.floor(correct / 2), // Half the answer
        dividend - divisor,    // Subtraction instead of division
        correct + divisor,     // Added divisor to answer
    ];

    // Add unique positive distractors
    for (const value of patterns) {
        if (Number.isInteger(value) && value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
            if (distractors.size >= 3) break;
        }
    }

    // If still need more, add random nearby numbers
    while (distractors.size < 3) {
        const offset = randomInt(-5, 5);
        const value = correct + offset;
        if (value > 0 && value !== correct && !distractors.has(value)) {
            distractors.add(value);
        }
    }

    return Array.from(distractors).slice(0, 3);
}

/**
 * Display a new question
 */
function showQuestion() {
    gameState.currentQuestion = generateQuestion();
    const q = gameState.currentQuestion;

    // Update question display
    elements.num1.textContent = q.num1;
    elements.num2.textContent = q.num2;
    elements.operator.textContent = q.operator;

    if (gameState.inputMode === 'choice') {
        // Multiple choice mode
        elements.answersGrid.style.display = 'grid';
        elements.typingArea.style.display = 'none';

        // Update answer buttons
        elements.answerBtns.forEach((btn, index) => {
            btn.textContent = q.answers[index];
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
    } else {
        // Typing mode
        elements.answersGrid.style.display = 'none';
        elements.typingArea.style.display = 'flex';

        // Clear and focus input
        elements.answerInput.value = '';
        elements.answerInput.classList.remove('correct', 'incorrect');
        elements.answerInput.disabled = false;
        elements.submitAnswerBtn.disabled = false;

        // Focus input after a short delay to ensure it's visible
        setTimeout(() => {
            elements.answerInput.focus();
        }, 100);
    }

    // Reset feedback
    elements.feedback.classList.remove('show', 'goal', 'miss');
}

/**
 * Handle answer selection (multiple choice mode)
 */
function handleAnswer(selectedIndex) {
    if (!gameState.isPlaying) return;

    const q = gameState.currentQuestion;
    const selectedAnswer = q.answers[selectedIndex];
    const isCorrect = selectedAnswer === q.correctAnswer;

    gameState.totalQuestions++;

    // Disable all buttons temporarily
    elements.answerBtns.forEach(btn => btn.disabled = true);

    // Find correct button
    const correctIndex = q.answers.indexOf(q.correctAnswer);

    if (isCorrect) {
        handleCorrectAnswer(selectedIndex);
    } else {
        handleIncorrectAnswer(selectedIndex, correctIndex);
    }

    // Show next question after delay (longer for incorrect so they can see the answer)
    const delay = isCorrect ? 800 : 2000;
    setTimeout(() => {
        if (gameState.isPlaying) {
            showQuestion();
        }
    }, delay);
}

/**
 * Handle typed answer submission (typing mode)
 */
function handleTypedAnswer() {
    if (!gameState.isPlaying) return;

    const q = gameState.currentQuestion;
    const typedValue = elements.answerInput.value.trim();

    // Ignore empty submissions
    if (typedValue === '') return;

    const typedAnswer = parseInt(typedValue, 10);
    const isCorrect = typedAnswer === q.correctAnswer;

    gameState.totalQuestions++;

    // Disable input temporarily
    elements.answerInput.disabled = true;
    elements.submitAnswerBtn.disabled = true;

    if (isCorrect) {
        handleCorrectTypedAnswer();
    } else {
        handleIncorrectTypedAnswer();
    }

    // Show next question after delay (longer for incorrect so they can see the answer)
    const delay = isCorrect ? 800 : 2000;
    setTimeout(() => {
        if (gameState.isPlaying) {
            showQuestion();
        }
    }, delay);
}

/**
 * Handle correct answer (multiple choice)
 */
function handleCorrectAnswer(buttonIndex) {
    gameState.score++;
    gameState.correctAnswers++;
    gameState.streak++;

    if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
    }

    // Update displays
    elements.scoreDisplay.textContent = gameState.score;
    elements.streakDisplay.textContent = gameState.streak;

    // Show streak fire if on a hot streak
    if (gameState.streak >= CONFIG.streakBonusThreshold) {
        elements.streakFire.classList.add('active');
    }

    // Button feedback
    elements.answerBtns[buttonIndex].classList.add('correct');

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('kick');

    // Goal celebration
    elements.goalArea.classList.add('goal-scored');
    setTimeout(() => elements.goalArea.classList.remove('goal-scored'), 400);

    // Feedback message
    const message = gameState.streak >= CONFIG.streakBonusThreshold
        ? `${gameState.streak}x STREAK! 🔥`
        : randomChoice(CONFIG.goalMessages);
    showFeedback(message, 'goal');

    // Check for level up
    updateLevel();
}

/**
 * Handle correct answer (typing mode)
 */
function handleCorrectTypedAnswer() {
    gameState.score++;
    gameState.correctAnswers++;
    gameState.streak++;

    if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
    }

    // Update displays
    elements.scoreDisplay.textContent = gameState.score;
    elements.streakDisplay.textContent = gameState.streak;

    // Show streak fire if on a hot streak
    if (gameState.streak >= CONFIG.streakBonusThreshold) {
        elements.streakFire.classList.add('active');
    }

    // Input feedback
    elements.answerInput.classList.add('correct');

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('kick');

    // Goal celebration
    elements.goalArea.classList.add('goal-scored');
    setTimeout(() => elements.goalArea.classList.remove('goal-scored'), 400);

    // Feedback message
    const message = gameState.streak >= CONFIG.streakBonusThreshold
        ? `${gameState.streak}x STREAK! 🔥`
        : randomChoice(CONFIG.goalMessages);
    showFeedback(message, 'goal');

    // Check for level up
    updateLevel();
}

/**
 * Handle incorrect answer (multiple choice)
 */
function handleIncorrectAnswer(buttonIndex, correctIndex) {
    gameState.streak = 0;

    // Update streak display
    elements.streakDisplay.textContent = gameState.streak;
    elements.streakFire.classList.remove('active');

    // Button feedback
    elements.answerBtns[buttonIndex].classList.add('incorrect');
    elements.answerBtns[correctIndex].classList.add('correct');

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('miss');

    // Feedback message
    showFeedback(randomChoice(CONFIG.missMessages), 'miss');
}

/**
 * Handle incorrect answer (typing mode)
 */
function handleIncorrectTypedAnswer() {
    gameState.streak = 0;

    // Update streak display
    elements.streakDisplay.textContent = gameState.streak;
    elements.streakFire.classList.remove('active');

    // Input feedback - show correct answer
    elements.answerInput.classList.add('incorrect');
    elements.answerInput.value = gameState.currentQuestion.correctAnswer;

    // Ball animation
    elements.ball.classList.remove('kick', 'miss');
    void elements.ball.offsetWidth; // Force reflow
    elements.ball.classList.add('miss');

    // Feedback message
    showFeedback(randomChoice(CONFIG.missMessages), 'miss');
}

/**
 * Show feedback message
 */
function showFeedback(message, type) {
    const feedbackText = elements.feedback.querySelector('.feedback-text');
    feedbackText.textContent = message;

    elements.feedback.classList.remove('show', 'goal', 'miss');
    void elements.feedback.offsetWidth; // Force reflow
    elements.feedback.classList.add('show', type);

    // Hide after delay
    setTimeout(() => {
        elements.feedback.classList.remove('show');
    }, 700);
}

// ========================================
// TIMER
// ========================================

function startTimer() {
    gameState.timeRemaining = CONFIG.gameDuration;
    updateTimerDisplay();

    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();

        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    elements.timerDisplay.textContent = formatTime(gameState.timeRemaining);

    // Warning state when time is low
    if (gameState.timeRemaining <= 10) {
        elements.timerDisplay.classList.add('warning');
    } else {
        elements.timerDisplay.classList.remove('warning');
    }
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// ========================================
// GAME FLOW
// ========================================

function startGame() {
    // Set input mode based on game mode
    gameState.inputMode = gameState.gameMode === 'practice' ? 'choice' : 'typing';

    // Reset game state
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.currentLevel = gameState.startingLevel; // Use selected starting level
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;

    // Reset UI
    elements.scoreDisplay.textContent = '0';
    elements.streakDisplay.textContent = '0';
    elements.streakFire.classList.remove('active');
    elements.levelText.textContent = CONFIG.levels[gameState.startingLevel].name;
    elements.levelDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < gameState.startingLevel);
    });
    elements.timerDisplay.classList.remove('warning', 'practice');

    // Configure for practice vs tournament mode
    if (gameState.gameMode === 'practice') {
        // Practice mode: show Done button, hide timer
        elements.timerSection.style.display = 'none';
        elements.doneBtn.style.display = 'block';
        elements.timerDisplay.textContent = '∞';
    } else {
        // Tournament mode: show timer, hide Done button
        elements.timerSection.style.display = 'block';
        elements.doneBtn.style.display = 'none';
    }

    // Show game screen
    showScreen('game-screen');

    // Start game
    showQuestion();

    // Only start timer in tournament mode
    if (gameState.gameMode === 'tournament') {
        startTimer();
    }
}

function endGame() {
    gameState.isPlaying = false;
    stopTimer();

    // Calculate final stats
    const accuracy = gameState.totalQuestions > 0
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)
        : 0;

    // Check for new high score
    const isNewRecord = saveHighScore(gameState.score);

    // Update game over screen
    elements.finalScore.textContent = gameState.score;
    elements.finalStreak.textContent = gameState.bestStreak;
    elements.finalAccuracy.textContent = `${accuracy}%`;

    if (isNewRecord) {
        elements.newRecord.classList.add('show');
    } else {
        elements.newRecord.classList.remove('show');
    }

    // Show game over screen
    showScreen('gameover-screen');
}

function goHome() {
    loadHighScore(); // Refresh displayed high score
    showScreen('start-screen');
}

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
    // Start button
    elements.startBtn.addEventListener('click', startGame);

    // Answer buttons (multiple choice)
    elements.answerBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => handleAnswer(index));
    });

    // Typing mode - submit button
    elements.submitAnswerBtn.addEventListener('click', handleTypedAnswer);

    // Typing mode - enter key
    elements.answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTypedAnswer();
        }
    });

    // Done button (practice mode)
    elements.doneBtn.addEventListener('click', endGame);

    // Game over buttons
    elements.playAgainBtn.addEventListener('click', startGame);
    elements.homeBtn.addEventListener('click', goHome);

    // Prevent double-tap zoom on mobile
    document.addEventListener('touchend', (e) => {
        if (e.target.classList.contains('btn') || e.target.classList.contains('answer-btn')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
    initModeToggles();
    loadHighScore();
    initEventListeners();
    showScreen('start-screen');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
