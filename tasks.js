// tasks.js
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const getTasksCollection = (req) => {
  return req.app.locals.tasksCollection;
};

router.get("/", async (req, res) => {
  const tasksCollection = getTasksCollection(req);
  const tasks = await tasksCollection.find({}).toArray();
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const newTask = req.body;

  const tasksCollection = getTasksCollection(req);
  const result = await tasksCollection.insertOne(newTask);
  const createdTask = result.ops[0];

  res.json(createdTask);
});

router.delete("/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  const tasksCollection = getTasksCollection(req);
  const deletedTask = await tasksCollection.findOneAndDelete({ _id: ObjectId(taskId) });

  res.json(deletedTask.value);
});

router.patch("/updateOrder", async (req, res) => {
  const {
    taskId,
    sourceList,
    destinationList,
    sourceIndex,
    destinationIndex,
  } = req.body;

  const tasksCollection = getTasksCollection(req);
  const task = await tasksCollection.findOne({ _id: ObjectId(taskId) });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Remove from source list
  const sourceTasks = await tasksCollection.find().toArray();
  sourceTasks.splice(sourceIndex, 1);

  // Add to destination list
  const destinationTasks = await tasksCollection.find().toArray();
  destinationTasks.splice(destinationIndex, 0, task);

  res.json({ success: true });
});

module.exports = router;
