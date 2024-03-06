

let currentBox = 0;
let questions = [];
let lockedBoxes = [];
let counter = 0;
let counterSelected = 0;
let counterWrong = 0;
const gridContainer = document.getElementById('grid');



// topic selected
function loadDataset() {
    const selectElement = document.getElementById("dataset-select");
    let selectedValue = selectElement.value;

    // If no option is selected or if the selected value is empty
    if (!selectedValue) {
        // Load the default JSON dataset
        const defaultJsonFile = "capital_cities.json";
        fetch(defaultJsonFile)
            .then(response => response.json())
            .then(data => {
                // Display the JSON data
                document.getElementById("jsonDataDisplay").innerText = JSON.stringify(data, null, 2);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    } else {
        // Fetch the JSON data based on the selected value
        var jsonFile = selectedValue + ".json";
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                answers = data.answers;

                createBoxes(questions.length);
            })
            .catch(error => console.error('Error loading JSON:', error));

    }
}



function createBoxes(numBoxes) {
    for (let i = 0; i < numBoxes; i++) {

        let colours = ['blue', 'yellow', 'orange', 'purple']

        randomColour = colours[Math.ceil(Math.random() * colours.length) - 1];
        const box = document.createElement('div');
        box.classList.add('box', 'boxstyle', randomColour);
        box.id = 'box' + (i + 1);
        box.textContent = 'Question ' + (i + 1);
        box.onclick = function () {
            let answer = document.getElementById('answer');
            startTimer();
            openModal(i + 1);
            answer.focus();

        };
        gridContainer.appendChild(box);

    }
}

// If all questions answered
function count() {
    if (counter <= 19) {
        counter += +1;
    }
    else if (counter == 20) {
        winner();
        updateTimer();
        /*clearInterval(timerInterval); // Stop the timer*/
    }
    if (counterSelected <= 19) {
        counterSelected += +1;
    }
    else {
        counterSelected = 20;
    }

}



function openModal(boxNumber) {
    if (lockedBoxes.includes(boxNumber)) return;
    currentBox = boxNumber;
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('questionNo').textContent = 'Question ' + boxNumber;
    document.getElementById('question').textContent = questions[boxNumber - 1].question;
    document.getElementById('response').style.display = 'none';
    document.getElementById('answer').value = '';

}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function checkAnswer() {
    const answer = document.getElementById('answer').value.toLowerCase();
    const correctAnswer = questions[currentBox - 1].answer.toLowerCase();

    if (answer === correctAnswer) {
        count();


        console.log(`counter: ` + counter);
        console.log(`counterSelected: ` + counterSelected);
        document.getElementById('response').textContent = 'Correct answer!';
        document.getElementById('response').style.color = 'green';
        document.getElementById('box' + currentBox).style.backgroundColor = '#7fff88';
        lockedBoxes.push(currentBox);


        // hide immediately
        document.getElementById('modal').style.display = 'none';

        closeModal();

    } else {
        document.getElementById('response').textContent = 'Incorrect answer! Try again in 10 seconds.';
        if (counterWrong < 20) {
            counterWrong += +1;
        }

        if (counterSelected < 20) {
            counterSelected += +1;
        }

        console.log(`counterWrong: ` + counterWrong);
        console.log(`counterSelected: ` + counterSelected);
        setTimeout(() => {
            document.getElementById('modal').style.display = 'none';
        }, 1000); // clear box after for 1 seconds

        document.getElementById('response').style.color = 'red';
        document.getElementById('box' + currentBox).style.backgroundColor = 'crimson';
        lockedBoxes.push(currentBox);
        setTimeout(() => {
            document.getElementById('box' + currentBox).style.backgroundColor = '#ccc';
            const index = lockedBoxes.indexOf(currentBox);
            if (index > -1) {
                lockedBoxes.splice(index, 1);
            }
        }, 1000); // Lock for 10 seconds
    }

    document.getElementById('response').style.display = 'block';

}




// Timer

let timeLeft = 89;
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
    if (timeLeft < 0 || counter == 20) {
        winner();
        clearInterval(timerInterval); // Stop the timer
        counter = counter; // correct counter
        counterWrong = counterWrong;
        counterSelected = counterSelected;

        document.getElementById('modal').style.display = 'none';
        document.getElementById('modalTimeOut').style.display = 'block';
        document.getElementById('counter').innerHTML = '<h3>Your Stats</h3><p><span class="material-icons-two-tone">check_circle_outline</span>' + counter + ' out of 20<span class="bold">CORRECT</span </p><p><span class="material-icons-two-tone redt">report_gmailerrorred</span>' + counterWrong + ' out of ' + counterSelected + ' questions<span class="bold">INCORRECT</span></p><p><span class="material-icons-two-tone purplet">post_add</span>' + counterSelected + ' total questions <span class="bold">SELECTED</span>';

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
    currentBox = 0;
    lockedBoxes = [];
    counter = 0;
    counterSelected = 0;
    counterWrong = 0;
    timeLeft = 20;

    // Reset box colors
    const gridBoxes = document.querySelectorAll('.box');
    gridBoxes.forEach(box => {
        box.style.backgroundColor = ''; // Reset background color
    });

    // Hide modals
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
    counter = counter;
    console.log(counter);
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
    document.getElementById('stats').innerHTML = '<h3>Your Stats</h3><h4>Amazing!</h4><p><span class="material-icons-two-tone">check_circle_outline</span>' + counter + ' out of 20<span class="bold">CORRECT</span </p><p><span class="material-icons-two-tone redt">report_gmailerrorred</span>' + counterWrong + ' out of ' + counterSelected + ' questions<span class="bold">INCORRECT</span></p><p><span class="material-icons-two-tone purplet">post_add</span>' + counterSelected + ' total questions <span class="bold">SELECTED</span>';
}


function revealAnswers() {
    let revBox = document.getElementById('box')
    for (let i = 0; i < revBox; i++) {

        revBox.id = 'revBox' + (i + 1);
        revBox.textContent = 'Question ' + (i + 1) + answers;

    };
    gridContainer.appendChild(box);

    // Hide modals
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalTimeOut').style.display = 'none';
    document.getElementById('winner').style.display = 'none';

    // Reset timer display
    document.getElementById('timer').textContent = timeLeft;

    // Clear timer interval if it's running
    clearInterval(timerInterval);
    timerInterval = null;
    console.log(answers)
}