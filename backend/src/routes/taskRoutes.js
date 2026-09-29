const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// GET /api/tasks & POST /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// GET /api/tasks/:id, PUT /api/tasks/:id, DELETE /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
