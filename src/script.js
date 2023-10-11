// load tasks from local storage when page is loaded
document.addEventListener("DOMContentLoaded", function () {
    loadTasksFromSessionStorage();
});

let tasksList = [];                     // store multiple tasks in array

// add task
function addTask(event) {
    event.preventDefault();             // to prevent the tasks to be deleted after clicking on "Add Task"

    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var priority = document.getElementById("priority").value;

    if (title === "") {
        alert("The title cannot be empty!");
        return;
    } else if (priority === "") {
        alert("Please choose the priority!");
        return;
    }

    const task = {
        title: title,
        description: description,
        priority: priority,
        completed: false,
    };

    tasksList.push(task);
    displayTasks();
    clearInputFields();

    saveTasksToSessionStorage();
}

// save tasks into local storage
function saveTasksToSessionStorage() {
    sessionStorage.setItem("tasksList", JSON.stringify(tasksList));
}

// load tasks from local storage
function loadTasksFromSessionStorage() {
    const storedTasks = sessionStorage.getItem("tasksList");
    if (storedTasks) {
        tasksList = JSON.parse(storedTasks);
        displayTasks();
    }
}

// display task
function displayTasks() {
    const taskDisplay = document.querySelector(".task-display");
    taskDisplay.innerHTML = "";

    if (tasksList.length === 0) {
        const noTaskMessage = document.createElement("p");
        noTaskMessage.id = "no-task";
        noTaskMessage.textContent = "You have no tasks currently!";
        taskDisplay.appendChild(noTaskMessage);
    }

    // sort the tasks by priority (High -> Medium -> Low)
    tasksList.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (let i = 0; i < tasksList.length; i++) {
        const task = tasksList[i];

        const taskTab = document.createElement("div");
        taskTab.className = "task-tab" + (task.completed ? " completed" : "");

        const titleElement = document.createElement("p");
        titleElement.id = "task-title";
        titleElement.contentEditable = true;
        titleElement.textContent = task.title;

        const descElement = document.createElement("p");
        descElement.id = "task-description";
        descElement.contentEditable = true;
        descElement.textContent = task.description;

        const buttonComplete = document.createElement("button");
        buttonComplete.id = "complete-task";
        buttonComplete.innerHTML = "<img src='tick.png' />";
        buttonComplete.onclick = function () {
            completeTask(i);
        };

        const buttonDelete = document.createElement("button");
        buttonDelete.id = "delete-task";
        buttonDelete.innerHTML = "<img src='delete.png' />";
        buttonDelete.onclick = function () {
            deleteTask(i);
        };

        // if the task is completed, strikethrough the title and change the bg to lightgray
        if (task.completed) {
            titleElement.style.textDecoration = "line-through";
            taskTab.style.backgroundColor = "lightgray";
        }

        taskTab.appendChild(titleElement);
        taskTab.appendChild(descElement);
        taskTab.appendChild(buttonComplete);
        taskTab.appendChild(buttonDelete);

        taskDisplay.appendChild(taskTab);
    }
}

// completed task indication
function completeTask(i) {
    if (confirm("Are you sure want to mark this task as done?")) {
        tasksList[i].completed = true;
        displayTasks();

        saveTasksToSessionStorage();
    }
}

// delete task
function deleteTask(i) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasksList.splice(i, 1);
        displayTasks();

        saveTasksToSessionStorage();
    }
}

// clear input field after clicking on "Add Task"
function clearInputFields() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
}

// display task first after refreshing
document.addEventListener("DOMContentLoaded", function () {
    displayTasks();
});
