// ==============================
// Get HTML Elements
// ==============================

const input = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const addButton = document.getElementById("addTask");

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

let draggedTask = null;

// ==============================
// Add Task
// ==============================

addButton.addEventListener("click", addTask);

function addTask() {

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = createTask(text, priority.value);

    todo.appendChild(task);

    saveTasks();

    input.value = "";
    priority.value = "High";
}

// ==============================
// Create Task
// ==============================

function createTask(text, level) {

    const card = document.createElement("div");
    card.className = "task";
    card.draggable = true;

    // Drag Start
    card.addEventListener("dragstart", function () {
        draggedTask = card;
    });

    // Drag End
    card.addEventListener("dragend", function () {
        draggedTask = null;
    });

    // Task Text
    const span = document.createElement("span");
    span.textContent = text;

    // Priority Badge
    const badge = document.createElement("span");
    badge.className = "priority";
    badge.textContent = level;

    if (level === "High") {
        badge.style.color = "#ff4d4d";
    }
    else if (level === "Medium") {
        badge.style.color = "orange";
    }
    else {
        badge.style.color = "lime";
    }

    // Left Side
    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "10px";

    left.appendChild(span);
    left.appendChild(badge);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete";

    deleteBtn.addEventListener("click", function () {

        card.remove();

        saveTasks();

    });

    card.appendChild(left);
    card.appendChild(deleteBtn);

    return card;
}

// ==============================
// Drag & Drop
// ==============================

const containers = [todo, progress, done];

containers.forEach(function (container) {

    container.addEventListener("dragover", function (e) {

        e.preventDefault();

        container.classList.add("drag-over");

    });

    container.addEventListener("dragleave", function () {

        container.classList.remove("drag-over");

    });

    container.addEventListener("drop", function () {

        container.classList.remove("drag-over");

        if (draggedTask) {

            container.appendChild(draggedTask);

            saveTasks();

        }

    });

});

// ==============================
// Save Tasks
// ==============================

function saveTasks() {

    const tasks = {

        todo: [],
        progress: [],
        done: []

    };

    saveColumn(todo, tasks.todo);
    saveColumn(progress, tasks.progress);
    saveColumn(done, tasks.done);

    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));

}

function saveColumn(column, array) {

    column.querySelectorAll(".task").forEach(function (card) {

        const text = card.querySelector("div span").textContent;

        const priority = card.querySelector(".priority").textContent;

        array.push({
            text: text,
            priority: priority
        });

    });

}

// ==============================
// Load Tasks
// ==============================

function loadTasks() {

    const saved = JSON.parse(localStorage.getItem("kanbanTasks"));

    if (!saved) return;

    saved.todo.forEach(function (task) {

        todo.appendChild(createTask(task.text, task.priority));

    });

    saved.progress.forEach(function (task) {

        progress.appendChild(createTask(task.text, task.priority));

    });

    saved.done.forEach(function (task) {

        done.appendChild(createTask(task.text, task.priority));

    });

}

loadTasks();