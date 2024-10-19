// JavaScript code for task management and timer

let tasks = [];
let removedTasks = []; // Array to store removed tasks
let timer; // For the timer
let timerRunning = false;

// Function to add a task
function addTask() {
    const inputBox = document.getElementById("input-box");
    const priorityBox = document.getElementById("priority-box");
    const dateBox = document.getElementById("date-box");
    
    if (inputBox.value === "") {
        alert("Please add a task.");
        return;
    }

    const task = {
        name: inputBox.value,
        priority: priorityBox.value,
        date: dateBox.value,
        completed: false
    };
    
    tasks.push(task);
    inputBox.value = ""; // Clear the input box
    updateTaskList(); // Update the displayed task list
    updateProgress(); // Update task completion progress
}

// Function to remove a task
function removeTask(index) {
    const removedTask = tasks.splice(index, 1)[0]; // Remove task and get it
    removedTasks.push(removedTask); // Add to removed tasks
    updateTaskList(); // Update the displayed task list
    updateProgress(); // Update task completion progress
}

// Function to redo a task
function redoTask() {
    if (removedTasks.length === 0) {
        alert("No tasks to redo.");
        return;
    }
    const task = removedTasks.pop(); // Get the last removed task
    tasks.push(task); // Add it back to the tasks
    updateTaskList(); // Update the displayed task list
    updateProgress(); // Update task completion progress
}

// Function to mark a task as completed
function completeTask(index) {
    tasks[index].completed = true; // Mark the task as completed
    updateTaskList(); // Update the list display
    updateProgress(); // Update task completion progress
}

// Function to sort tasks by priority
function sortTasksByPriority() {
    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    };

    tasks.sort((a, b) => {
        // Sort first by completed status
        if (a.completed && !b.completed) return 1; // Keep completed tasks at the end
        if (!a.completed && b.completed) return -1;
        
        // Then sort by priority
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

// Function to update the task list display
function updateTaskList() {
    sortTasksByPriority(); // Sort tasks by priority before updating the list
    const listContainer = document.getElementById("list-container");
    listContainer.innerHTML = ""; // Clear the list before updating
    
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        
        // Create the task text element
        const taskText = document.createElement("span");
        taskText.textContent = `${task.name} (Due: ${task.date})`;
        
        // Add completed class if the task is completed
        if (task.completed) {
            taskText.classList.add("completed"); // Add the completed class
        }

        // Create the complete button
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.onclick = () => completeTask(index); // Mark the task as completed
        
        // Create the remove and redo buttons only for completed tasks
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeTask(index); // Remove the task

        const redoBtn = document.createElement("button");
        redoBtn.textContent = "Redo";
        redoBtn.onclick = () => redoTask(); // Redo the last removed task

        // Append buttons based on the task completion status
        if (task.completed) {
            li.appendChild(removeBtn); // Add the remove button
            li.appendChild(redoBtn); // Add the redo button
        } else {
            li.appendChild(taskText); // Append task text only for incomplete tasks
            li.appendChild(completeBtn); // Add the complete button
        }

        listContainer.appendChild(li);
    });
}

// Function to update progress
function updateProgress() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById("progress").innerText = `${progress.toFixed(0)}%`;

    // Show Mario GIF if all tasks are completed
    const marioGif = document.getElementById("mario-gif");
    if (progress === 100) {
        marioGif.style.display = "block"; // Show the GIF
    } else {
        marioGif.style.display = "none"; // Hide the GIF
    }
}

// Timer functions (startTimer, stopTimer, playCompletionSound)...
// Include the timer code as it was in your existing script.js

// Sound element
const completionSound = document.getElementById("completion-sound");

// Function to play the sound
function playCompletionSound() {
    completionSound.currentTime = 0;  // Rewind to the start
    completionSound.play();  // Play sound
}

// Function to start the timer
function startTimer() {
    if (timerRunning) return; // Prevent starting a new timer while one is running
    const minutes = parseInt(document.getElementById("minutes-input").value) || 0;
    const seconds = parseInt(document.getElementById("seconds-input").value) || 0;

    if (minutes < 0 || seconds < 0 || seconds >= 60) {
        alert("Please enter valid time.");
        return;
    }

    let totalTime = minutes * 60 + seconds;

    timer = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(timer);
            timerRunning = false;
            document.getElementById("timer-display").innerText = "00:00";
            playCompletionSound();  // Play sound on completion
            alert("Timer completed!");  // Pop-up notification
            return;
        }
        totalTime--;
        const mins = String(Math.floor(totalTime / 60)).padStart(2, '0');
        const secs = String(totalTime % 60).padStart(2, '0');
        document.getElementById("timer-display").innerText = `${mins}:${secs}`;
        timerRunning = true;
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timer);
    timerRunning = false;
    document.getElementById("timer-display").innerText = "00:00";
}
// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const container = document.querySelector('.container');
    const h2 = document.querySelector('h2');
    
    body.classList.toggle('dark-mode'); // Toggle dark mode class on body
    container.classList.toggle('dark-mode'); // Toggle dark mode class on container
    h2.classList.toggle('dark-mode'); // Toggle dark mode class on heading
}
