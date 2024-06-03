

let currentBox = 0;
let questions = [];
let answer;
let lockedBoxes = [];
let completeBoxes = [];
let counter = 0;
let counterSelected = 0;
let counterWrong = 0;
const gridContainer = document.getElementById('grid');
const info = document.getElementById('content-info');
const gameinfo = document.getElementById('title');
const game = document.getElementById('game');
const topic = document.getElementById('topic');


gameinfo.onclick = function () {
    if (info.style.display === 'none') {
        info.style.display = 'block';
        console.log("A")

    } else {
        info.style.display = 'none';
        console.log("B")

    }
}


function loadDataset(topic) {

    // Clear previous loaded dataset
    // Reset all game-related variables
    questions = [];
    answer = "";
    currentBox = 0;
    lockedBoxes = [];
    completeBoxes = [];
    counter = 0;
    counterSelected = 0;
    counterWrong = 0;
    timeLeft = 90;
    // Clear existing boxes from the grid container
    gridContainer.innerHTML = '';


    // Hide modals

    info.style.display = 'block';

    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalTimeOut').style.display = 'none';
    document.getElementById('winner').style.display = 'none';

    // Reset timer display
    document.getElementById('timer').textContent = timeLeft;

    // Clear timer interval if it's running
    clearInterval(timerInterval);
    timerInterval = null;


    // Convert underscores to title case
    let titleCaseString = topic.split('_').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    console.log(titleCaseString);

    // Assuming there is an HTML element with the id "topic"
    let topicElement = document.getElementById("topic");
    if (topicElement) {
        topicElement.innerText = titleCaseString;
    } else {
        console.log("Element with id 'topic' not found.");
    }

    // If no option is selected or if the selected value is empty
    if (!topic) {
        // Load the default JSON dataset
        const defaultJsonFile = "data/capital_cities.json";
        fetch(defaultJsonFile)
            .then(response => response.json())
            .then(data => {
                // Display the JSON data
                document.getElementById("jsonDataDisplay").innerText = JSON.stringify(data, null, 2);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    } else {
        // Fetch the JSON data based on the selected value
        let jsonFile = "data/" + topic + ".json";
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                // Check if data contains questions array
                if (data && data.questions && Array.isArray(data.questions)) {
                    // Shuffle the questions array
                    const shuffledQuestions = shuffleArray(data.questions);
                    // Limit to only 20 questions
                    const limitedQuestions = shuffledQuestions.slice(0, 20);
                    questions = limitedQuestions;
                    answers = data.answers;
                    console.log(`length:` + questions.length)
                    console.log('Questions after loading:', questions);

                    createBoxes(questions.length);
                    revealAnswers(questions.length, answers);

                } else {
                    console.error('Invalid JSON data format');
                }
            })
            .catch(error => console.error('Error loading JSON:', error));

    }
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function createBoxes(numBoxes) {

    info.style.display = 'none';

    for (let i = 0; i < numBoxes; i++) {

        let colours = ['blue', 'yellow', 'orange', 'purple']
        let chosenTopic = document.getElementById('topic').innerText;
        let currentTopicBox = chosenTopic;

        randomColour = colours[Math.ceil(Math.random() * colours.length) - 1];
        const box = document.createElement('div');
        // Retrieve question and answer from JSON data
        const question = questions[i % questions.length].question;
        const answer = questions[i % questions.length].answer;

        // Check if answer exists, if yes, display it, otherwise display default text (question)
        const answerText = answer ? answer : 'Question ' + (i + 1);
        const questionText = question ? question : 'Question ' + (i + 1);


        box.classList.add('box', 'boxstyle', randomColour);
        box.id = 'box' + (i + 1);
        box.innerHTML = '<span class="boxcurrentTopic">' + chosenTopic + '</span>' + '<p class="boxQuestionNumber">Question ' + (i + 1) + '</p><br><p class="hide theQuestion" id="question' + (i + 1) + '">' + questionText + '</p><br><p class="hide theAnswer" id="answer' + (i + 1) + '">' + answerText + '</p>';





        box.onclick = function () {
            let answer = document.getElementById('answer');
            startTimer();
            openModal(i + 1);
            answer.focus();

        };

        gridContainer.appendChild(box);


    }

}

function openModal(boxNumber) {
    if (lockedBoxes.includes(boxNumber)) return;
    currentTopic = document.getElementById('topic').innerText;
    currentBox = boxNumber;
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('currentTopic').textContent = '' + currentTopic;
    console.log(currentTopic);
    document.getElementById('questionNo').textContent = 'Question ' + boxNumber;
    document.getElementById('question').textContent = questions[boxNumber - 1].question;
    // document.getElementById('response').style.display = 'none';
    document.getElementById('answer').value = '';

}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}


//**** CHECK ANSWER */
function checkAnswer() {
    const answer = document.getElementById('answer').value.toLowerCase();
    const correctAnswer = questions[currentBox - 1].answer.toLowerCase();


    if (answer === correctAnswer) {
        console.log("answer = " + answer)
        console.log("answered = " + correctAnswer)
        counterSelected += +1;
        counter += +1;
        console.log("checkanswer counter = " + counter)
        document.getElementById('response').textContent = 'Correct answer!';
        document.getElementById('response').style.color = 'green';
        document.getElementById('box' + currentBox).style.backgroundColor = '#7fff88';

        // Add to complete/correctly answered boxes
        completeBoxes.push(currentBox);
        console.log("push completeBoxes = " + completeBoxes.length)

        // Remove the correctly answered question from the array
        questions.splice(currentBox - 1, 1);
        console.log("spliced:" + currentBox)
    } else {
        counterSelected += +1;
        document.getElementById('response').textContent = 'Incorrect answer! Try again in 10 seconds.';
        console.log("answer = " + answer)
        console.log("wrong answer = " + answer)

        //  if (completeBoxes < 20) {
        counterWrong += 1;
        console.log("counterwrongg = " + counterWrong)
        // }

        /* Hide this counter
        if (counterSelected < 20) {
            counterSelected += 1;
        }*/

        document.getElementById('response').style.color = 'red';
        document.getElementById('box' + currentBox).style.backgroundColor = 'crimson';
        lockedBoxes.push(currentBox);

        setTimeout((current) => {
            document.getElementById('box' + current).style.backgroundColor = '#ccc'; // Change color back to grey
            const index = lockedBoxes.indexOf(current);
            if (index > -1) {
                lockedBoxes.splice(index, 1);
            }

            console.log('Total questions: ' + questions.length);
            console.log('User\'s answer:', answer);
        }, 5000, currentBox); // Lock for 5 seconds
    }

    document.getElementById('response').style.display = 'block';



    // Display next question

    const nextBox = (currentBox % questions.length) + 1;
    console.log("qlength:" + questions.length)
    console.log("timer left:" + timeLeft)
    console.log("timer interval:" + timerInterval)


    if (questions.length === 0) {
        console.log("you won")
        winner();

    } else {
        openModal(nextBox);
        console.log("nb: " + nextBox);
    }


    console.log('Current state of questions array:', questions);
    console.log('Completed:', completeBoxes);
    console.log('COUNTER SELECTED:', counterSelected);

}
/* end new check answer*/


// Display next question
function nextQuestion() {
    console.log("next ques")
    nextBox = (currentBox % questions.length) + 1;
    openModal(nextBox);
    console.log("nb: " + nextBox);
    console.log(nextBox)
}


// Timer

let timeLeft = 90;
let timerInterval;

function startTimer() {
    // Start the timer if it's not already running
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000); // Update timer every second
    }
}

function updateTimer() {
    // Update the timer display
    document.getElementById('timer').textContent = timeLeft;

    // Decrease time left
    timeLeft--;

    // Check if time is up
    if (timeLeft <= 0) {
        clearInterval(timerInterval); // Stop the timer
        document.getElementById('modal').style.display = 'none';
        document.getElementById('modalTimeOut').style.display = 'block';
        document.getElementById('counter').innerHTML = '<h3>Your Stats</h3><div><span class="greent material-icons-two-tone ">check_circle_outline</span>' + counter + ' out of 20<span class="bold">CORRECT</span><br><span class="material-icons-two-tone redt">report_gmailerrorred</span>' + counterWrong + ' questions were answered <span class="bold">INCORRECTLY</span><br><span class="material-icons-two-tone purplet">post_add</span>' + counterSelected + ' total<span class="bold">ATTEMPTS</span>were made</div>';
    } else if (completeBoxes === 20) { // Check if all questions are answered correctly
        winner(); // Invoke winner function
    }
}


// On Enter key press
document.addEventListener("keypress", function (event)
// question[q].addEventListener("mouseover", function run() {
{
    if (event.key == 'Enter') {
        checkAnswer();
    }

});

// On Escape key press
document.addEventListener("keydown", function (event)
// question[q].addEventListener("mouseover", function run() {
{
    if (event.key == 'Escape') {
        closeModal();
    }
});


function playAgain() {
    // Reset all game-related variables
    questions = [];
    answer = "";
    currentBox = 0;
    lockedBoxes = [];
    completeBoxes = [];
    counter = 0;
    counterSelected = 0;
    counterWrong = 0;
    timeLeft = 90;

    // Reset box colors
    const gridBoxes = document.querySelectorAll('.box');
    gridBoxes.forEach(box => {
        box.style.backgroundColor = ''; // Reset background color
    });

    // Hide modals

    info.style.display = 'block';
    document.getElementById('play').style.display = 'none';
    // document.getElementById('play').classList.add('hide');

    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalTimeOut').style.display = 'none';
    document.getElementById('winner').style.display = 'none';

    // Reset timer display
    document.getElementById('timer').textContent = timeLeft;

    // Clear timer interval if it's running
    clearInterval(timerInterval);
    timerInterval = null;
}


function winner() {
    clearInterval(timerInterval);
    counter = counter;
    console.log(counter);
    console.log("completeboxes:" + completeBoxes)
    counterWrong = counterWrong;
    console.log(counterWrong);
    counterSelected = counterSelected;
    console.log(counterSelected);
    confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        origin: {
            x: Math.random(),
            // since they fall down, start a bit higher than random
            y: Math.random() - 0.2
        }
    });
    document.getElementById('modal').style.display = 'none';
    document.getElementById('winner').style.display = 'block';
    document.getElementById('stats').innerHTML = '<h3>Your Stats</h3><h4>Amazing!</h4><div class="modal-content-bg"><p><span class="material-icons-two-tone">check_circle_outline</span>' + counter + ' out of 20<span class="bold">CORRECT</span </p><p><span class="material-icons-two-tone redt">report_gmailerrorred</span>' + counterWrong + ' questions were answered <span class="bold">INCORRECTLY</span></p><p><span class="material-icons-two-tone purplet">post_add</span>' + counterSelected + ' total<span class="bold">ATTEMPTS</span>were made</p></div>';
}



function revealAnswers() {
    // Hide modals
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalTimeOut').style.display = 'none';
    document.getElementById('winner').style.display = 'none';
    //  document.getElementById('play').style.display = 'block';
    document.getElementById('play').classList.add('show');
    document.getElementById('play').classList.remove('hide');



    // Reset timer display
    document.getElementById('timer').textContent = timeLeft;

    // Clear timer interval if it's running
    clearInterval(timerInterval);
    timerInterval = null;

}

// Get the button element
const revealAnswersButton = document.getElementById('revealanswers');

// Add an event listener to trigger the revealAnswers function when the button is clicked
revealAnswersButton.addEventListener('click', function () {
    revealAnswers();
    const answerElements = document.querySelectorAll('.theAnswer');
    const questionElements = document.querySelectorAll('.boxQuestionNumber');
    const questionsElements = document.querySelectorAll('.theQuestion');
    const boxElement = document.querySelectorAll('.box');

    // Show answers
    answerElements.forEach(element => {
        // element.style.display = 'block';
        element.classList.remove('hide');
        element.classList.add('show');
    });

    // styling for question number
    questionElements.forEach(element => {
        // element.style.display = 'block';
        element.classList.add('topic');
    });

    // Show questions
    questionsElements.forEach(element => {
        // element.style.display = 'block';
        element.classList.remove('hide');
        element.classList.add('show');
    });

    // Expand box width
    boxElement.forEach(element => {
        // element.style.display = 'block';
        //element.classList.remove('hide');
        element.classList.add('boxExpand');
    });

    const boxElements = document.querySelectorAll('.box');
    boxElements.forEach(element => {
        // element.style.display = 'block';
        // element.style.backgroundColor = "#992be8";
        // element.style.color = "#e7d0f7";
        element.style.color = "black";
    });

});






// Clickers
document.addEventListener('DOMContentLoaded', function () {
    const triggerItem = document.getElementById('title');
    const targetItem = document.getElementById('content-info');

    // Add click event listener to trigger item
    triggerItem.addEventListener('click', function () {
        // Scroll the target item into view when trigger item is clicked
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

