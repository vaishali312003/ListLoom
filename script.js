const inputBox = document.getElementById("input-box");
const priorityBox = document.getElementById("priority-box");
const dateBox = document.getElementById("date-box");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const timerDisplay = document.getElementById("timer-display");

// Map priority levels to numbers for sorting
const priorityValues = {
    high: 1,
    medium: 2,
    low: 3
};

let timer;  // Timer instance for the focus timer
let timerSeconds = 0;  // Initial timer value

// Add a new task to the list
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
        return;
    }

    // Create a new list item with priority and due date
    let li = document.createElement("li");
    li.innerHTML = `${inputBox.value} (Due: ${dateBox.value || 'No deadline'})`;
    li.setAttribute('data-priority', priorityBox.value);  // Store priority

    // Create a close (X) button for each task
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";  // Unicode for '×'
    li.appendChild(span);

    // Add the new task to the list container
    listContainer.appendChild(li);

    // Reset input fields
    inputBox.value = "";
    priorityBox.value = "low";
    dateBox.value = "";

    // Save, sort, and update the progress bar
    saveData();
    sortTasksByPriority();
    updateProgress();
}

// Sort tasks based on priority (high < medium < low)
function sortTasksByPriority() {
    let tasks = Array.from(listContainer.getElementsByTagName('li'));

    // Sort tasks by priority using the data attribute
    tasks.sort((a, b) => {
        let priorityA = priorityValues[a.getAttribute('data-priority')];
        let priorityB = priorityValues[b.getAttribute('data-priority')];
        return priorityA - priorityB;  // Ascending order
    });

    // Clear the list and re-add the sorted tasks
    listContainer.innerHTML = "";
    tasks.forEach(task => listContainer.appendChild(task));
}

// Save tasks to local storage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Load tasks from local storage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
    sortTasksByPriority();  // Ensure tasks are sorted on load
    updateProgress();
}

// Update the progress bar and display the completion percentage
function updateProgress() {
    let totalTasks = listContainer.getElementsByTagName('li').length;
    let completedTasks = listContainer.getElementsByClassName('checked').length;
    let progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    progressBar.style.width = progress + "%";
    progressText.innerText = Math.round(progress) + "%";
}

// Toggle dark mode and save the user's preference in local storage
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}

// Load dark mode preference from local storage
function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

// Handle task click events (check/uncheck or delete)
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        updateProgress();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        updateProgress();
    }
}, false);

// Start the focus timer with user-defined input
function startTimer() {
    let minutes = parseInt(document.getElementById("minutes-input").value) || 0;
    let seconds = parseInt(document.getElementById("seconds-input").value) || 0;
    timerSeconds = (minutes * 60) + seconds;

    if (timerSeconds <= 0) {
        alert("Please set a valid time.");
        return;
    }

    clearInterval(timer);  // Clear any previous timer
    timer = setInterval(updateTimer, 1000);  // Start a new timer
}

// Update the timer display every second
function updateTimer() {
    if (timerSeconds <= 0) {
        clearInterval(timer);
        timerDisplay.textContent = "00:00";

        // Play completion sound
        document.getElementById("completion-sound").play();
        alert("Focus time is up! Add completed tasks to your list.");
        addCompletedTasks();
        return;
    }

    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerSeconds--;
}

// Stop the timer and reset the display
function stopTimer() {
    clearInterval(timer);
    timerDisplay.textContent = "00:00";
}

// Move checked tasks to the completed tasks section
function addCompletedTasks() {
    const checkedItems = listContainer.querySelectorAll('li.checked');
    let completedList = document.getElementById("completed-tasks");

    if (!completedList) {
        completedList = document.createElement("div");
        completedList.id = "completed-tasks";
        completedList.innerHTML = "<h3>Completed Tasks Today</h3><ul id='completed-list'></ul>";
        document.querySelector(".todo-app").appendChild(completedList);
    }

    const completedListContainer = completedList.querySelector("#completed-list");
    checkedItems.forEach(item => {
        completedListContainer.appendChild(item.cloneNode(true));
        item.remove();  // Remove from original list
    });

    updateProgress();
}

// Initialize the app: load tasks and dark mode preferences
loadDarkMode();
showTask();
