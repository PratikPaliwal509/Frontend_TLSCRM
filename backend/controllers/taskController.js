import * as taskService from '../services/taskService.js'
import { verifyToken } from '../middleware/authMiddleware.js'

// Get all tasks for a specific project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      })
    }

    const tasks = await taskService.getProjectTasks(projectId)

    return res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    })
  } catch (error) {
    console.error('Error in getProjectTasks controller:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch project tasks',
    })
  }
}

// Get single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required',
      })
    }

    const task = await taskService.getTaskById(taskId)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      })
    }

    return res.status(200).json({
      success: true,
      data: task,
    })
  } catch (error) {
    console.error('Error in getTaskById controller:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task',
    })
  }
}

// Update task (for Gantt chart: dates and progress)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const updateData = req.body

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required',
      })
    }

    // Verify task exists
    const task = await taskService.getTaskById(taskId)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      })
    }

    // Update task
    const updatedTask = await taskService.updateTask(taskId, updateData)

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    })
  } catch (error) {
    console.error('Error in updateTask controller:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task',
    })
  }
}

// Create new task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params
    const taskData = req.body

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required',
      })
    }

    if (!taskData.task_title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      })
    }

    const newTask = await taskService.createTask(projectId, taskData)

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    })
  } catch (error) {
    console.error('Error in createTask controller:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task',
    })
  }
}

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required',
      })
    }

    // Verify task exists
    const task = await taskService.getTaskById(taskId)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      })
    }

    await taskService.deleteTask(taskId)

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    console.error('Error in deleteTask controller:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task',
    })
  }
}
