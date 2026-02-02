import prisma from '../config/prismaClient.js'

export const getProjectTasks = async (projectId) => {
  try {
    return await prisma.task.findMany({
      where: {
        project_id: parseInt(projectId),
      },
      select: {
        task_id: true,
        task_title: true,
        task_number: true,
        description: true,
        task_type: true,
        priority: true,
        status: true,
        progress_percentage: true,
        start_date: true,
        due_date: true,
        completed_at: true,
        estimated_hours: true,
        actual_hours: true,
        is_billable: true,
        is_milestone: true,
        is_recurring: true,
        parent_task_id: true,
        depends_on: true,
        blocks: true,
        assigned_to: true,
        project_id: true,
        created_by: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: [
        { parent_task_id: 'asc' },
        { start_date: 'asc' },
      ],
    })
  } catch (error) {
    console.error('Error fetching project tasks:', error)
    throw new Error('Failed to fetch project tasks')
  }
}

export const getTaskById = async (taskId) => {
  try {
    return await prisma.task.findUnique({
      where: {
        task_id: parseInt(taskId),
      },
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    throw new Error('Failed to fetch task')
  }
}

export const updateTask = async (taskId, updateData) => {
  try {
    const data = { ...updateData }

    // Convert date strings to Date objects if present
    if (data.start_date && typeof data.start_date === 'string') {
      data.start_date = new Date(data.start_date)
    }
    if (data.due_date && typeof data.due_date === 'string') {
      data.due_date = new Date(data.due_date)
    }

    return await prisma.task.update({
      where: {
        task_id: parseInt(taskId),
      },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })
  } catch (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }
}

export const createTask = async (projectId, taskData) => {
  try {
    return await prisma.task.create({
      data: {
        project_id: parseInt(projectId),
        task_title: taskData.task_title,
        description: taskData.description,
        task_type: taskData.task_type || 'task',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'to_do',
        start_date: taskData.start_date ? new Date(taskData.start_date) : null,
        due_date: taskData.due_date ? new Date(taskData.due_date) : null,
        estimated_hours: taskData.estimated_hours,
        parent_task_id: taskData.parent_task_id,
        depends_on: taskData.depends_on || [],
        assigned_to: taskData.assigned_to || [],
        is_billable: taskData.is_billable ?? true,
        is_milestone: taskData.is_milestone ?? false,
        progress_percentage: taskData.progress_percentage || 0,
        created_by: taskData.created_by,
      },
    })
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }
}

export const deleteTask = async (taskId) => {
  try {
    return await prisma.task.delete({
      where: {
        task_id: parseInt(taskId),
      },
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    throw new Error('Failed to delete task')
  }
}
