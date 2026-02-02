import express from 'express'
import * as taskController from '../controllers/taskController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET all tasks for a project
router.get('/project/:projectId', verifyToken, taskController.getProjectTasks)

// GET single task by ID
router.get('/:taskId', verifyToken, taskController.getTaskById)

// POST create new task
router.post('/project/:projectId', verifyToken, taskController.createTask)

// PUT update task
router.put('/:taskId', verifyToken, taskController.updateTask)

// DELETE task
router.delete('/:taskId', verifyToken, taskController.deleteTask)

export default router
