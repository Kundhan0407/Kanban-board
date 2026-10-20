const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

// Temporary task data
const tasks = [
    {
        id: 1,
        title: "Complete DSA",
        priority: "High"
    },
    {
        id: 2,
        title: "Work on Kanban Board",
        priority: "Medium"
    }
];

// GET /tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});
app.post("/tasks", (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        priority: req.body.priority
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});


app.delete("/tasks/:id", (req, res) => {

    const taskId = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === taskId);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });
});


app.put("/tasks/:id", (req, res) => {

    const taskId = Number(req.params.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const newTitle = req.body.title;

    if (typeof newTitle !== "string" || newTitle.trim() === "") {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    task.title = newTitle.trim();

    res.json(task);
});



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});