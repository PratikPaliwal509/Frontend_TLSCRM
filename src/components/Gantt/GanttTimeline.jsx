import React, { useState, useEffect } from 'react'
import { ViewMode, Gantt } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import TaskTree from './TaskTree'

const mapTasks = (tasks = []) =>
  tasks
    .filter((t) => t.start_date && t.due_date) // Only include tasks with valid dates
    .map((t) => ({
      id: String(t.task_id),
      name: t.task_title,
      start: new Date(t.start_date),
      end: new Date(t.due_date),
      progress: Math.min(100, Math.max(0, t.progress_percentage ?? 0)), // Ensure 0-100 range
      type: 'task',
      project: t.project_id ? String(t.project_id) : '',
      dependencies: t.depends_on && t.depends_on.length > 0 ? t.depends_on.map(String) : [],
    }))

const GanttTimeline = ({ projectId }) => {
  const [tasks, setTasks] = useState([])
  const [ganttTasks, setGanttTasks] = useState([])
  const [view, setView] = useState(ViewMode.Day)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (projectId) fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')

      const res = await fetch(`https://api-0ggv.onrender.com/api/tasks/project/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Failed to fetch tasks')

      const data = await res.json()
      setTasks(Array.isArray(data) ? data : data.data || [])
      setGanttTasks(mapTasks(Array.isArray(data) ? data : data.data || []))
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(err.message)
      setTasks([])
      setGanttTasks([])
    } finally {
      setLoading(false)
    }
  }

  const onDateChange = async (task) => {
    setGanttTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, start: task.start, end: task.end } : t
      )
    )

    try {
      const token = localStorage.getItem('token')
      await fetch(`https://api-0ggv.onrender.com/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: task.start.toISOString().split('T')[0],
          due_date: task.end.toISOString().split('T')[0],
        }),
      })
    } catch (err) {
      console.error('Error updating task dates:', err)
    }
  }

  const onProgressChange = async (task) => {
    setGanttTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, progress: task.progress } : t
      )
    )

    try {
      const token = localStorage.getItem('token')
      await fetch(`https://api-0ggv.onrender.com/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          progress_percentage: task.progress,
        }),
      })
    } catch (err) {
      console.error('Error updating task progress:', err)
    }
  }

  if (loading) return <div className="p-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>

  if (error) return <div className="p-4 alert alert-danger">Error: {error}</div>

  return (
    <div className="row">
      <div className="col-lg-3 mb-3">
        <div className="card">
          <div className="card-body">
            <h6 className="mb-3">Task Hierarchy</h6>
            {tasks.length > 0 ? (
              <TaskTree tasks={tasks} />
            ) : (
              <p className="text-muted">No tasks yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex mb-3 gap-2">
              <button
                className={`btn btn-sm ${view === ViewMode.Day ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setView(ViewMode.Day)}
              >
                Day
              </button>
              <button
                className={`btn btn-sm ${view === ViewMode.Week ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setView(ViewMode.Week)}
              >
                Week
              </button>
              <button
                className={`btn btn-sm ${view === ViewMode.Month ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setView(ViewMode.Month)}
              >
                Month
              </button>
            </div>

            {ganttTasks.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <Gantt
                  tasks={ganttTasks}
                  viewMode={view}
                  onDateChange={onDateChange}
                  onProgressChange={onProgressChange}
                  listCellWidth="200px"
                  columnWidth={view === ViewMode.Month ? 60 : view === ViewMode.Week ? 80 : 120}
                />
              </div>
            ) : (
              <div className="alert alert-info">No tasks with dates to display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GanttTimeline
