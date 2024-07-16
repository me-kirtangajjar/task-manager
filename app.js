const express = require("express");
const app = express();
const allTasks = require("./task.json").tasks;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieve all tasks
app.get("/tasks", (req, res) => {
  return res.status(200).send(allTasks);
});

// Retrieve a single task by its ID.
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send({ msg: "Invalid task ID" });
  }

  const taskById = allTasks.find((task) => task.id === id);

  if (!taskById) return res.status(404).send({ msg: "Task not found" });

  return res.status(200).json(taskById);
});

app.get("/tasks/priority/:level", (req, res) => {
  const level = req.params.level;

  let priorityTasks = [];
  for (let index = 0; index < allTasks.length; index++) {
    if (allTasks[index].priority == level) {
      priorityTasks.push(allTasks[index]);
    }
  }

  return res.status(200).send(priorityTasks);
});

// Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, priority, completed } = req.body;

  if (Object.keys(req.body).length !== 4) {
    return res.status(400).send({
      msg: "Invalid request body: properties required - title, description, priority, completed",
    });
  }

  if (
    title.length === 0 ||
    description.length === 0 ||
    priority.length === 0 ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).send({ msg: "Invalid request body" });
  }

  const newTask = {
    id: allTasks.length + 1,
    title,
    description,
    priority,
    completed,
  };

  allTasks.push(newTask);
  return res.status(201).send(newTask);
});

// Update an existing task by its ID
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, priority, completed } = req.body;

  if (isNaN(id)) {
    return res.status(400).send({ msg: "Invalid request" });
  }

  if (Object.keys(req.body).length !== 4) {
    return res.status(400).send({
      msg: "Invalid request body: properties required - title, description, priority, completed",
    });
  }

  if (
    title.length === 0 ||
    description.length === 0 ||
    priority.length === 0 ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).send({ msg: "Invalid request body" });
  }

  const taskById = allTasks.find((task) => task.id === id);
  if (!taskById) {
    return res.status(404).send({ msg: "Task not found" });
  }

  const index = allTasks.indexOf(taskById);

  allTasks[index].title = title;
  allTasks[index].description = description;
  allTasks[index].priority = priority;
  allTasks[index].completed = completed;

  return res.status(200).send(allTasks[index]);
});

// Delete a task by its ID
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send({ msg: "Invalid request" });
  }

  const taskById = allTasks.find((task) => task.id === id);
  if (!taskById) {
    return res.status(404).send({ msg: "Task not found" });
  }

  const index = allTasks.indexOf(taskById);
  allTasks.splice(index, 1);

  return res.status(200).send(taskById);
});

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${process.env.PORT || 3000}`);
});

module.exports = app;
