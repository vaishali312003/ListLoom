const inputBox = document.getElementById("input-box");
const priorityBox = document.getElementById("priority-box");
const dateBox = document.getElementById("date-box");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const timerDisplay = document.getElementById("timer-display");
let timerInterval;
let timerSeconds = 25 * 60; // 25 minutes in seconds

function addTask() {
    if (inputBox.value === '') {
        alert("You must Write Something");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value + ' (Due: ' + dateBox.value + ')';
        li.setAttribute('data-priority', priorityBox.value);
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }

    inputBox.value = "";
    priorityBox.value = "low";
    dateBox.value = "";
    saveData();
    updateProgress();
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        updateProgress();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        updateProgress();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    updateProgress();
}

function updateProgress() {
    let totalTasks = listContainer.getElementsByTagName('li').length;
    let completedTasks = listContainer.getElementsByClassName('checked').length;
    let progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = progress + "%";
    progressText.innerText = Math.round(progress) + "%";
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time's up!");
            return;
        }
        timerSeconds--;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimerDisplay() {
    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.innerText = `${minutes}:${seconds}`;
}

loadDarkMode();
showTask();
updateTimerDisplay();

