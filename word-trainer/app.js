// word box app
const words = Vue.createApp({
    data() {
        return {
            wordArray: [],
            newWord: ""
        }
    }
})

const wordBox = words.mount("#words");

function addWord() {
    wordBox.newWord = wordBox.newWord.trim().toLowerCase(); 
    if (wordBox.newWord.length > 1 && !wordBox.wordArray.includes(wordBox.newWord)) {
        wordBox.wordArray.push(wordBox.newWord);
        wordBox.newWord = ""; 
    }
}
 

// word box app
const quiz = Vue.createApp({
    data() {
        return {
            isStarted: false,
            quizWord:"Go",
            answer: ""
        }
    }, 
    mounted() {
        this.quizWord = this.quizWord.replaceAll('', ' ');
    }
})
 
const quizBox = quiz.mount("#quiz");

// answers app
const answers = Vue.createApp({
    data() {
        return {
            correctAnswers: [],
            wrongAnswers: [],
        }
    }
})

const answerBox = answers.mount("#answers");

let buffer;
let totalWord = 0;
let correctAnswer = 0;
// start the game
function start() {
    if (wordBox.wordArray.length == 0) {
        alert("enter word to start");
        return;
    }
    totalWord = wordBox.wordArray.length;
    quiz.isStarted = true;
    play();
}

function play() {
    buffer = wordBox.wordArray.splice(generateRandomIndex(wordBox.wordArray.length), 1)[0];
    quizBox.quizWord = shuffle(buffer);
    quizBox.wordTemplate = generateTemplate(quizBox.quizWord.length); 
    quizBox.quizWord = quizBox.quizWord.replaceAll('', ' '); 
    quizBox.answer = "";
}

function check() {
    quizBox.answer = quizBox.answer.trim().toLowerCase(); 
    if (!quiz.isStarted || quizBox.answer.length != buffer.length) 
        return;
    if (buffer == quizBox.answer) {
        answerBox.correctAnswers.push(buffer);
        correctAnswer++;
    }
    else {
        answerBox.wrongAnswers.push(buffer);
    }
    if (wordBox.wordArray.length == 0) {
        const result = correctAnswer / totalWord * 100;
        alert("Your score: " + result.toFixed().toString() + " / 100");
    }
    if (wordBox.wordArray.length != 0)
        play();
}

function generateRandomIndex(lenth) {
    return Math.floor(Math.random() * lenth);
}

//shuffle given string's chars
function shuffle(str) {
    chars = str.split('');
    let shuffledStr = "";
    while (chars.length != 0) 
        shuffledStr += chars.splice(generateRandomIndex(chars.length), 1);
    return shuffledStr; 
}
 
function generateTemplate(length) {
    let template = "";
    for (let i = 0; i < length - 1; i++)
            template += "‾ ";
    return template + '‾' ;
}
