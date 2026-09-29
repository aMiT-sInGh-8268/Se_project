const Task = require('../models/Task');
const mongoose = require('mongoose');

/**
 * @desc   Get all tasks (with optional status filter)
 * @route  GET /api/tasks
 */
const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: error.message,
    });
  }
};

/**
 * @desc   Get single task by ID
 * @route  GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
      error: error.message,
    });
  }
};

/**
 * @desc   Create a new task
 * @route  POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
      error: error.message,
    });
  }
};

/**
 * @desc   Update existing task
 * @route  PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update task',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete task by ID
 * @route  DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
