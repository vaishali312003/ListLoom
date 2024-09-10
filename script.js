// Select DOM elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress");

// Add Task
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        inputBox.value = "";
        updateProgress();
    }
}

// Update Progress
function updateProgress() {
    let totalTasks = listContainer.getElementsByTagName('li').length;
    let completedTasks = listContainer.getElementsByClassName('checked').length;
    let progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = progress + "%";
    progressText.innerText = Math.round(progress) + "%";
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Timer Functionality
let timer;
let isTimerRunning = false;

function startTimer() {
    if (isTimerRunning) return;

    let time = 25 * 60;
    const timerDisplay = document.getElementById("timer-display");

    timer = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.innerText = `${minutes}:${seconds}`;
        time--;

        if (time < 0) {
            clearInterval(timer);
            alert("Time's up! Take a short break.");
        }
    }, 1000);
    isTimerRunning = true;
}
