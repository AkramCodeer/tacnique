const Task = require("../models/Task");

const createTask = async (taskData) => {
  try {
    const task = await Task.create(taskData);

    return task;
  } catch (error) {
    throw error;
  }
};

const getAllTasks = async (userId) => {
  try {
    const tasks = await Task.find({ userId: userId });
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getTaskById = async (taskId, userId) => {
  try {
    const task = await Task.findOne({ userId: userId, _id: taskId });
    return task;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId, userId, updatedData) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId },
      { $set: updatedData },
      { new: true }
    );

    return task;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId, userId) => {
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId: userId });
    return task;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
