const inputBox = document.getElementById("input-box");
const priorityBox = document.getElementById("priority-box");
const dateBox = document.getElementById("date-box");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const timerDisplay = document.getElementById("timer-display");
const timeInput = document.getElementById("time-input"); // Time input field

let timer;
let timerSeconds = 25 * 60; // Default 25 minutes in seconds

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
    // Get user-defined time from input field
    let minutesInput = parseInt(document.getElementById("minutes-input").value) || 0;
    let secondsInput = parseInt(document.getElementById("seconds-input").value) || 0;
    timerSeconds = (minutesInput * 60) + secondsInput;
    
    if (timerSeconds <= 0) {
        alert("Please set a valid time.");
        return;
    }

    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (timerSeconds <= 0) {
        clearInterval(timer);
        timerDisplay.textContent = "00:00";
        
        // Play completion sound
        const completionSound = document.getElementById("completion-sound");
        completionSound.play();

        alert("Focus time is up! Add completed tasks to your list.");
        addCompletedTasks();
        return;
    }
    
    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerDisplay.textContent = minutes + ":" + seconds;
    
    timerSeconds--;
}


function stopTimer() {
    clearInterval(timer);
    timerSeconds = 0; // Reset to 0
    timerDisplay.textContent = "00:00";
}

function addCompletedTasks() {
    const checkedItems = listContainer.querySelectorAll('li.checked');
    checkedItems.forEach(item => {
        let completedList = document.getElementById("completed-tasks");
        if (!completedList) {
            completedList = document.createElement("div");
            completedList.id = "completed-tasks";
            completedList.innerHTML = "<h3>Completed Tasks Today</h3><ul id='completed-list'></ul>";
            document.querySelector(".todo-app").appendChild(completedList);
        }
        const completedListContainer = completedList.querySelector("#completed-list");
        completedListContainer.appendChild(item.cloneNode(true));
        item.remove(); // Remove from original list
    });
    updateProgress();
}

loadDarkMode();
showTask();
