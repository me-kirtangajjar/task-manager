const express = require("express");
const app = express();
const allTasks = require("./task.json").tasks;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieve all tasks
app.get("/tasks", (req, res) => {
  return res
    .status(200)
    .send({ msg: "All task details fetched successfully", data: allTasks });
});

// Retrieve a single task by its ID.
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send({ msg: "Invalid task ID" });
  }

  const taskById = allTasks.find((task) => task.id === id);

  if (!taskById) return res.status(404).send({ msg: "Task not found" });

  return res
    .status(200)
    .send({ msg: "Task details fetched successfully", data: taskById });
});

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${process.env.PORT || 3000}`);
});

module.exports = app;
