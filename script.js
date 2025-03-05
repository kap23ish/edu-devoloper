// Quiz Generator
class QuizGenerator {
    constructor() {
        this.currentSubject = 'english';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLimit = 0;
        this.hintsEnabled = true;
        this.hintsRemaining = 3;
        this.startTime = null;
        this.timerInterval = null;
        this.userAnswers = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('generateQuiz').addEventListener('click', () => this.generateQuiz());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitQuiz').addEventListener('click', () => this.submitQuiz());
        document.getElementById('retryQuiz').addEventListener('click', () => this.retryQuiz());
        document.getElementById('newQuiz').addEventListener('click', () => this.newQuiz());
    }

    setSubject(subject) {
        this.currentSubject = subject;
        document.querySelectorAll('.subject-card').forEach(card => {
            card.classList.remove('selected');
            if (card.querySelector('span').textContent.toLowerCase().includes(subject)) {
                card.classList.add('selected');
            }
        });
    }

    generateQuiz() {
        const difficulty = document.getElementById('difficultySelect').value;
        const questionCount = parseInt(document.getElementById('questionCount').value);
        const category = document.getElementById('categorySelect').value;
        this.timeLimit = parseInt(document.getElementById('timeLimit').value);
        this.hintsEnabled = document.getElementById('hintsEnabled').value === 'true';
        this.hintsRemaining = 3;

        // Generate questions based on selected options
        this.questions = this.generateQuestions(questionCount, difficulty, category);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        // Show quiz container and hide generator
        document.querySelector('.quiz-generator').style.display = 'none';
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.display = 'block';

        // Update progress bar and score
        this.updateProgress();
        this.updateScore();
        this.updateHints();

        // Display first question
        this.displayQuestion();
    }

    generateQuestions(count, difficulty, category) {
        const questions = [];
        const questionTemplates = {
            english: {
                easy: [
                    { question: "Which of these is a proper noun?", options: ["book", "London", "happy", "run"], correct: 1 },
                    { question: "What is the past tense of 'run'?", options: ["runned", "ran", "running", "runs"], correct: 1 },
                    { question: "Which word is an adjective?", options: ["quickly", "quick", "quicken", "quickness"], correct: 1 }
                ],
                medium: [
                    { question: "What is a synonym for 'happy'?", options: ["sad", "joyful", "angry", "tired"], correct: 1 },
                    { question: "Which sentence is grammatically correct?", options: ["I am going to the store.", "I going to the store.", "I goes to the store.", "I go to the store."], correct: 0 },
                    { question: "What is the plural of 'child'?", options: ["childs", "children", "childes", "child"], correct: 1 }
                ],
                hard: [
                    { question: "What is the meaning of 'ephemeral'?", options: ["lasting forever", "lasting for a short time", "lasting for a long time", "lasting for a medium time"], correct: 1 },
                    { question: "Which literary device is used in 'The sun smiled down on us'?", options: ["metaphor", "simile", "personification", "hyperbole"], correct: 2 },
                    { question: "What is the main theme of 'Romeo and Juliet'?", options: ["love", "revenge", "friendship", "power"], correct: 0 }
                ]
            },
            math: {
                easy: [
                    { question: "What is 7 × 8?", options: ["54", "56", "58", "60"], correct: 1 },
                    { question: "What is the square root of 16?", options: ["2", "3", "4", "5"], correct: 2 },
                    { question: "What is 15% of 200?", options: ["25", "30", "35", "40"], correct: 1 }
                ],
                medium: [
                    { question: "Solve for x: 2x + 5 = 13", options: ["3", "4", "5", "6"], correct: 1 },
                    { question: "What is the area of a circle with radius 5?", options: ["25π", "50π", "75π", "100π"], correct: 0 },
                    { question: "What is the slope of y = 2x + 3?", options: ["1", "2", "3", "4"], correct: 1 }
                ],
                hard: [
                    { question: "What is the derivative of x²?", options: ["x", "2x", "x²", "2x²"], correct: 1 },
                    { question: "What is the value of sin(90°)?", options: ["0", "0.5", "1", "2"], correct: 2 },
                    { question: "What is the sum of the first 10 natural numbers?", options: ["45", "50", "55", "60"], correct: 2 }
                ]
            },
            science: {
                easy: [
                    { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "N2"], correct: 0 },
                    { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
                    { question: "What is the largest organ in the human body?", options: ["heart", "brain", "skin", "liver"], correct: 2 }
                ],
                medium: [
                    { question: "What is the process by which plants make their food?", options: ["photosynthesis", "respiration", "digestion", "absorption"], correct: 0 },
                    { question: "What is the atomic number of carbon?", options: ["4", "6", "8", "10"], correct: 1 },
                    { question: "What is the speed of light in meters per second?", options: ["299,792,458", "199,792,458", "399,792,458", "499,792,458"], correct: 0 }
                ],
                hard: [
                    { question: "What is the theory of relativity?", options: ["E=mc²", "F=ma", "PV=nRT", "a²+b²=c²"], correct: 0 },
                    { question: "What is quantum mechanics?", options: ["study of atoms", "study of light", "study of subatomic particles", "study of gravity"], correct: 2 },
                    { question: "What is the process of nuclear fusion?", options: ["splitting atoms", "combining atoms", "breaking bonds", "forming ions"], correct: 1 }
                ]
            },
            geography: {
                easy: [
                    { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
                    { question: "Which is the largest continent?", options: ["Africa", "Asia", "Europe", "North America"], correct: 1 },
                    { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 }
                ],
                medium: [
                    { question: "What is the highest mountain in the world?", options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"], correct: 1 },
                    { question: "Which country has the largest population?", options: ["India", "China", "USA", "Indonesia"], correct: 1 },
                    { question: "What is the capital of Brazil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: 2 }
                ],
                hard: [
                    { question: "What is the deepest ocean trench?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Tonga Trench"], correct: 0 },
                    { question: "Which country has the most islands?", options: ["Sweden", "Norway", "Finland", "Denmark"], correct: 0 },
                    { question: "What is the largest desert in the world?", options: ["Sahara", "Antarctic", "Arabian", "Gobi"], correct: 1 }
                ]
            },
            history: {
                easy: [
                    { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correct: 2 },
                    { question: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
                    { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 }
                ],
                medium: [
                    { question: "What was the Renaissance?", options: ["a war", "a cultural movement", "a scientific discovery", "a political revolution"], correct: 1 },
                    { question: "Who was the first Emperor of China?", options: ["Qin Shi Huang", "Han Wudi", "Tang Taizong", "Song Taizu"], correct: 0 },
                    { question: "When did the French Revolution begin?", options: ["1776", "1789", "1799", "1804"], correct: 1 }
                ],
                hard: [
                    { question: "What was the Silk Road?", options: ["a military route", "a trade route", "a migration route", "a pilgrimage route"], correct: 1 },
                    { question: "Who was the first woman to win a Nobel Prize?", options: ["Marie Curie", "Mother Teresa", "Jane Addams", "Pearl Buck"], correct: 0 },
                    { question: "What was the first civilization?", options: ["Egyptian", "Mesopotamian", "Chinese", "Indian"], correct: 1 }
                ]
            }
        };

        const templates = questionTemplates[this.currentSubject]?.[difficulty] || questionTemplates.english.easy;
        for (let i = 0; i < count; i++) {
            questions.push(templates[i % templates.length]);
        }

        return questions;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const questionContainer = document.querySelector('.question-container');
        const optionsContainer = document.querySelector('.options-container');
        const hintContainer = document.querySelector('.hint-container');

        // Update question text
        questionContainer.querySelector('.question-text').textContent = question.question;

        // Show/hide hint container
        hintContainer.style.display = this.hintsEnabled ? 'block' : 'none';
        hintContainer.querySelector('.hint-text').style.display = 'none';
        hintContainer.querySelector('.hint-button').onclick = () => this.showHint(question);

        // Generate options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => this.selectOption(index);
            optionsContainer.appendChild(button);
        });

        // Update progress
        this.updateProgress();

        // Show/hide buttons
        const nextButton = document.getElementById('nextQuestion');
        const submitButton = document.getElementById('submitQuiz');
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else {
            nextButton.style.display = 'none';
            submitButton.style.display = 'none';
        }

        // Start timer if enabled
        if (this.timeLimit > 0) {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        let timeLeft = this.timeLimit;
        const timerElement = document.querySelector('.timer');
        const timerContainer = document.querySelector('.timer-container');

        this.timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Add warning styles
            if (timeLeft <= 10) {
                timerElement.classList.add('danger');
                timerContainer.style.animation = 'pulse 0.5s infinite';
            } else if (timeLeft <= 30) {
                timerElement.classList.add('warning');
                timerContainer.style.animation = 'pulse 1s infinite';
            }

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.selectOption(-1); // Time's up
            }
        }, 1000);
    }

    showHint(question) {
        if (this.hintsRemaining > 0) {
            const hintText = question.hint || this.generateHint(question);
            const hintElement = document.querySelector('.hint-text');
            hintElement.textContent = hintText;
            hintElement.style.display = 'block';
            this.hintsRemaining--;
            this.updateHints();
        }
    }

    generateHint(question) {
        // Generate a hint based on the question type
        const correctAnswer = question.options[question.correct];
        switch (this.currentSubject) {
            case 'math':
                return `Try solving this step by step. The answer is between ${Math.min(...question.options.map(Number))} and ${Math.max(...question.options.map(Number))}.`;
            case 'english':
                return `Think about the context and meaning. The answer is ${correctAnswer.length} letters long.`;
            case 'science':
                return `Consider the scientific principles involved. The answer is related to ${correctAnswer.toLowerCase()}.`;
            case 'geography':
                return `Think about the location and characteristics. The answer is ${correctAnswer.length} letters long.`;
            case 'history':
                return `Consider the historical context. The answer is ${correctAnswer.length} letters long.`;
            default:
                return `The answer is ${correctAnswer.length} letters long.`;
        }
    }

    updateHints() {
        document.querySelector('.hints-count').textContent = this.hintsRemaining;
    }

    selectOption(index) {
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-button');
        const nextButton = document.getElementById('nextQuestion');

        // Store user's answer
        this.userAnswers[this.currentQuestionIndex] = index;

        // Disable all options
        options.forEach(option => option.disabled = true);

        // Show correct/incorrect states
        options.forEach((option, i) => {
            if (i === question.correct) {
                option.classList.add('correct');
            } else if (i === index) {
                option.classList.add('incorrect');
            }
        });

        // Update score
        if (index === question.correct) {
            this.score++;
            this.updateScore();
        }

        // Show next button
        nextButton.style.display = 'block';
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    submitQuiz() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Calculate final score
        const finalScore = Math.round((this.score / this.questions.length) * 100);
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;

        // Show review section
        document.querySelector('.quiz-container').style.display = 'none';
        const reviewSection = document.querySelector('.quiz-review');
        reviewSection.style.display = 'block';

        // Update summary
        document.querySelector('.final-score').textContent = `${finalScore}%`;
        document.querySelector('.time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.querySelector('.correct-answers').textContent = `${this.score}/${this.questions.length}`;

        // Show review of all questions
        const reviewQuestions = document.querySelector('.review-questions');
        reviewQuestions.innerHTML = this.questions.map((question, index) => `
            <div class="review-question">
                <div class="review-question-header">
                    <span class="review-question-text">Question ${index + 1}</span>
                    <span class="review-status ${this.userAnswers[index] === question.correct ? 'correct' : 'incorrect'}">
                        ${this.userAnswers[index] === question.correct ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <div class="review-options">
                    ${question.options.map((option, i) => `
                        <div class="review-option ${i === this.userAnswers[index] ? 'selected' : ''} ${i === question.correct ? 'correct' : ''}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    retryQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        document.querySelector('.quiz-review').style.display = 'none';
        document.querySelector('.quiz-container').style.display = 'block';
        this.displayQuestion();
    }

    newQuiz() {
        document.querySelector('.quiz-review').style.display = 'none';
        document.querySelector('.quiz-generator').style.display = 'block';
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
    }

    updateScore() {
        document.querySelector('.score').textContent = `Score: ${this.score}`;
    }
}

// Enhanced Math Problem Solver
class MathSolver {
    constructor() {
        this.setupEventListeners();
        this.mathjs = math;
    }

    setupEventListeners() {
        document.getElementById('solveMath').addEventListener('click', () => this.solveProblem());
    }

    insertSymbol(symbol) {
        const textarea = document.getElementById('mathProblem');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + symbol + text.substring(end);
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
        textarea.focus();
    }

    loadExample(example) {
        document.getElementById('mathProblem').value = example;
        this.solveProblem();
    }

    solveProblem() {
        const problem = document.getElementById('mathProblem').value;
        const resultDiv = document.getElementById('mathResult');
        
        resultDiv.innerHTML = '<div class="loading">Solving your problem...</div>';
        
        try {
            const scope = {};
            const result = this.mathjs.evaluate(problem, scope);
            resultDiv.innerHTML = this.formatResult(problem, result, scope);
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <p>Error: ${error.message}</p>
                    <p>Please check if your mathematical expression is valid.</p>
                    <div class="example-buttons">
                        <button onclick="mathSolver.loadExample('2 + 2')">Basic</button>
                        <button onclick="mathSolver.loadExample('x^2 + 2x + 1')">Algebra</button>
                        <button onclick="mathSolver.loadExample('sqrt(16)')">Square Root</button>
                    </div>
                </div>
            `;
        }
    }

    formatResult(problem, result, scope) {
        let html = `
            <div class="math-solution">
                <p class="problem">Problem: ${problem}</p>
                <p class="result">Result: ${result}</p>
                <div class="steps">
                    <h4>Steps:</h4>
                    <ol>
                        <li>Input: ${problem}</li>
        `;

        // Add variable assignments if any
        Object.entries(scope).forEach(([key, value]) => {
            if (key !== 'result') {
                html += `<li>${key} = ${value}</li>`;
            }
        });

        html += `
                        <li>Calculation: ${problem} = ${result}</li>
                    </ol>
                </div>
            </div>
        `;
        return html;
    }
}

// Enhanced Vocabulary Builder
class VocabularyBuilder {
    constructor() {
        this.words = [
            { word: 'Ephemeral', definition: 'Lasting for a very short time' },
            { word: 'Serendipity', definition: 'Finding something good without looking for it' },
            { word: 'Eloquent', definition: 'Fluent and persuasive in speaking or writing' },
            { word: 'Resilient', definition: 'Able to recover quickly from difficulties' },
            { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere' },
            { word: 'Meticulous', definition: 'Showing great attention to detail; very careful and precise' },
            { word: 'Enigmatic', definition: 'Difficult to interpret or understand; mysterious' },
            { word: 'Pragmatic', definition: 'Dealing with things sensibly and realistically' },
            { word: 'Tenacious', definition: 'Persistent; not readily letting go of or giving up' },
            { word: 'Benevolent', definition: 'Kind and generous; well-meaning' }
        ];
        this.currentIndex = 0;
        this.learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];
        this.currentMode = 'daily';
        this.currentCategory = null;
        this.categories = {
            academic: [
                { word: 'Phenomenon', definition: 'A fact or situation that is observed to exist or happen' },
                { word: 'Methodology', definition: 'A system of methods used in a particular area of study or activity' },
                // Add more academic words...
            ],
            business: [
                { word: 'Leverage', definition: 'Use something to maximum advantage' },
                { word: 'Synergy', definition: 'The interaction or cooperation of two or more organizations to produce a combined effect greater than the sum of their separate effects' },
                // Add more business words...
            ],
            technical: [
                { word: 'Algorithm', definition: 'A process or set of rules to be followed in calculations or other problem-solving operations' },
                { word: 'Quantum', definition: 'The smallest amount of many forms of energy' },
                // Add more technical words...
            ],
            literary: [
                { word: 'Ephemeral', definition: 'Lasting for a very short time' },
                { word: 'Serendipity', definition: 'Finding something good without looking for it' },
                // Add more literary words...
            ]
        };
        this.setupEventListeners();
        this.displayWord();
        this.updateProgress();
    }

    setupEventListeners() {
        document.getElementById('nextWord').addEventListener('click', () => this.nextWord());
        document.getElementById('showDefinition').addEventListener('click', () => this.showDefinition());
        document.getElementById('searchButton').addEventListener('click', () => this.searchWord());
        document.getElementById('wordSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWord();
        });
    }

    setMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(mode)) {
                btn.classList.add('active');
            }
        });
        this.displayWord();
    }

    setCategory(category) {
        this.currentCategory = category;
        this.currentIndex = 0;
        this.displayWord();
    }

    displayWord() {
        let currentWord;
        if (this.currentMode === 'daily') {
            currentWord = this.words[this.currentIndex];
        } else if (this.currentCategory && this.categories[this.currentCategory]) {
            currentWord = this.categories[this.currentCategory][this.currentIndex];
        }

        const wordDisplay = document.getElementById('wordDisplay');
        wordDisplay.style.animation = 'none';
        wordDisplay.offsetHeight;
        wordDisplay.style.animation = 'fadeIn 0.5s ease';
        
        wordDisplay.innerHTML = `
            <div class="word-content">
                <div class="word">${currentWord.word}</div>
                <div class="definition" style="display: none">${currentWord.definition}</div>
                <div class="word-categories">
                    <span class="word-category">${this.currentMode}</span>
                    ${this.currentCategory ? `<span class="word-category">${this.currentCategory}</span>` : ''}
                </div>
            </div>
        `;
    }

    nextWord() {
        const wordDisplay = document.getElementById('wordDisplay');
        wordDisplay.style.animation = 'flip 0.5s ease';
        
        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
            this.displayWord();
        }, 500);
    }

    showDefinition() {
        const definition = document.querySelector('.definition');
        definition.style.display = 'block';
        definition.style.animation = 'slideUp 0.5s ease';
        
        if (!this.learnedWords.includes(this.words[this.currentIndex].word)) {
            this.learnedWords.push(this.words[this.currentIndex].word);
            localStorage.setItem('learnedWords', JSON.stringify(this.learnedWords));
            this.updateProgress();
        }
    }

    async searchWord() {
        const searchInput = document.getElementById('wordSearch');
        const searchTerm = searchInput.value.toLowerCase().trim();
        const searchResult = document.getElementById('searchResult');
        
        if (searchTerm === '') {
            searchResult.innerHTML = '<p>Please enter a word to search</p>';
            return;
        }

        searchResult.innerHTML = '<div class="loading">Searching for word...</div>';

        try {
            // Try to find word in local database first
            const localWord = this.words.find(word => 
                word.word.toLowerCase() === searchTerm
            );

            if (localWord) {
                searchResult.innerHTML = this.formatSearchResult(localWord);
                return;
            }

            // If not found locally, fetch from dictionary API
            const dictionaryResult = await this.fetchWordDefinition(searchTerm);
            searchResult.innerHTML = this.formatSearchResult(dictionaryResult);
        } catch (error) {
            searchResult.innerHTML = `
                <div class="error-message">
                    <p>Error: ${error.message}</p>
                    <p>Please try another word or check your spelling.</p>
                </div>
            `;
        }
    }

    async fetchWordDefinition(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();
            
            if (!data || data.length === 0) {
                throw new Error('Word not found');
            }

            const entry = data[0];
            return {
                word: entry.word,
                definition: entry.meanings[0].definitions[0].definition,
                example: entry.meanings[0].definitions[0].example || '',
                phonetic: entry.phonetic || '',
                audio: entry.phonetics.find(p => p.audio)?.audio || ''
            };
        } catch (error) {
            throw new Error('Failed to fetch word definition. Please try again.');
        }
    }

    formatSearchResult(wordData) {
        return `
            <div class="search-result-item">
                <h4>${wordData.word}</h4>
                ${wordData.phonetic ? `<p class="phonetic">${wordData.phonetic}</p>` : ''}
                <p class="definition">${wordData.definition}</p>
                ${wordData.example ? `<p class="example">Example: ${wordData.example}</p>` : ''}
                ${wordData.audio ? `
                    <button class="btn-secondary" onclick="vocabularyBuilder.playAudio('${wordData.audio}')">
                        Listen to Pronunciation
                    </button>
                ` : ''}
            </div>
        `;
    }

    playAudio(audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }

    updateProgress() {
        const totalWords = Object.values(this.categories).reduce((acc, curr) => acc + curr.length, 0);
        const learnedCount = this.learnedWords.length;
        const percentage = Math.round((learnedCount / totalWords) * 100);
        
        document.getElementById('wordsLearned').textContent = learnedCount;
        document.getElementById('categoriesCompleted').textContent = 
            Object.keys(this.categories).filter(cat => 
                this.categories[cat].every(word => this.learnedWords.includes(word.word))
            ).length;
        
        // Calculate streak (you'll need to implement streak tracking)
        document.getElementById('learningStreak').textContent = this.calculateStreak();
        
        const progressStats = document.getElementById('progressStats');
        progressStats.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="progress-details">
                <div class="progress-stat">
                    <h5>Words Learned</h5>
                    <p>${learnedCount}</p>
                </div>
                <div class="progress-stat">
                    <h5>Total Words</h5>
                    <p>${totalWords}</p>
                </div>
                <div class="progress-stat">
                    <h5>Progress</h5>
                    <p>${percentage}%</p>
                </div>
            </div>
        `;
    }

    calculateStreak() {
        // Implement streak calculation based on daily learning
        return 0; // Placeholder
    }
}

// Programming Practice
class CodeEditor {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('runCode').addEventListener('click', () => this.runCode());
        document.getElementById('languageSelect').addEventListener('change', () => this.changeLanguage());
    }

    runCode() {
        const code = document.getElementById('codeEditor').value;
        const language = document.getElementById('languageSelect').value;
        const outputDisplay = document.getElementById('outputDisplay');

        try {
            switch (language) {
                case 'javascript':
                    outputDisplay.innerHTML = eval(code);
                    break;
                case 'html':
                    outputDisplay.innerHTML = code;
                    break;
                case 'css':
                    const style = document.createElement('style');
                    style.textContent = code;
                    document.head.appendChild(style);
                    outputDisplay.innerHTML = '<div class="css-preview">CSS Applied</div>';
                    break;
            }
        } catch (error) {
            outputDisplay.innerHTML = `Error: ${error.message}`;
        }
    }

    changeLanguage() {
        const language = document.getElementById('languageSelect').value;
        const editor = document.getElementById('codeEditor');
        
        switch (language) {
            case 'html':
                editor.value = '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>';
                break;
            case 'css':
                editor.value = 'body {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n}';
                break;
            case 'javascript':
                editor.value = 'console.log("Hello World!");';
                break;
        }
    }
}

// Intro Screen Transition
function startApp() {
    const introScreen = document.querySelector('.intro-screen');
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('main');

    // Fade out intro screen
    introScreen.style.animation = 'fadeOut 0.5s ease forwards';

    // Show navbar and main content after fade out
    setTimeout(() => {
        introScreen.style.display = 'none';
        navbar.style.display = 'flex';
        mainContent.style.display = 'block';
    }, 500);
}

// Automatically start the app after 2 seconds
setTimeout(() => {
    startApp();
}, 2000);

// Initialize all apps
const quizGenerator = new QuizGenerator();
const mathSolver = new MathSolver();
const vocabularyBuilder = new VocabularyBuilder();
const codeEditor = new CodeEditor(); 