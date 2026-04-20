import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import TasksDetails from '../tasks/TasksDetails'
// import { getDate } from 'date-fns'

const COLUMNS = [
    { key: 'to_do', title: 'To Dos' },
    { key: 'inprogress', title: 'In Progress' },
    { key: 'completed', title: 'Completed' },
    { key: 'pending', title: 'Pending' },
    { key: 'rejected', title: 'Rejected' },
    { key: 'auto', title: 'Auto' },
]

const KanbanBoard = ({ tasks = [], project_name }) => {
    const [boardTasks, setBoardTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [user_id, setUser_id] = useState(null)

    /* =========================
       INIT
    ========================== */
    useEffect(() => {
        setBoardTasks(tasks)
    }, [tasks])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUser_id(payload.user_id)
        } catch {
            console.error('Invalid token')
        }
    }, [])

    /* =========================
       DRAG & DROP
    ========================== */
    const onDragStart = (e, task) => {
        e.dataTransfer.setData('text/plain', task.task_id)
        e.dataTransfer.setData('fromStatus', task.status)
    }

    const onDragOver = (e) => {
        e.preventDefault()
    }

    const onDrop = async (e, newStatus) => {
        e.preventDefault()
        const taskId = Number(e.dataTransfer.getData('text/plain'))
        const fromStatus = e.dataTransfer.getData('fromStatus')
        if (!taskId || fromStatus === newStatus) return

        // ✅ optimistic UI
        setBoardTasks((prev) =>
            prev.map((t) =>
                t.task_id === taskId ? { ...t, status: newStatus } : t
            )
        )

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(
                `https://api-0ggv.onrender.com/api/tasks/${taskId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            toast.success('Task status updated')
        } catch (error) {
            // ❌ rollback
            setBoardTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId ? { ...t, status: fromStatus } : t
                )
            )
            toast.error('Failed to update status')
        }
    }
    const handleDeleteTask = (taskId) => {
        setBoardTasks((prev) => prev.filter((t) => t.task_id !== taskId))
        setSelectedTask(null) // optional: close details
    }
    /* =========================
       RENDER
    ========================== */
    return (
        <>
            <TasksDetails task={selectedTask} user_id={user_id} onDeleteTask={handleDeleteTask} project_name={project_name}/>

            <div className="row flex-nowrap overflow-x-auto g-4 h-100 ">
                {COLUMNS.map((col) => (
                    <div key={col.key} className="col-md-4 mb-4">
                        <div className="card h-100 overflow-y-auto  flex-nowrap">
                            <div className="card-header fw-bold text-center">
                                {col.title}
                            </div>

                            <div
                                className="card-body d-flex flex-column gap-3"
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, col.key)}
                            >
                                {boardTasks
                                    .filter((t) => t.status === col.key)
                                    .map((task) => {
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)

                                        const dueDate = task?.due_date ? new Date(task.due_date) : null

                                        let statusText = ""
                                        let badgeClass = "badge bg-secondary"

                                        if (task?.status === "completed") {
                                            statusText = "Completed"
                                            badgeClass = "badge bg-primary"
                                        } else if (dueDate) {
                                            dueDate.setHours(0, 0, 0, 0)

                                            if (dueDate < today) {
                                                statusText = "Overdue"
                                                badgeClass = "badge bg-danger"
                                            } else if (dueDate.getTime() === today.getTime()) {
                                                statusText = "Due Today"
                                                badgeClass = "badge bg-warning text-dark"
                                            } else {
                                                statusText = dueDate.toLocaleDateString()
                                                badgeClass = "badge bg-success"
                                            }
                                        }

                                        return (
                                            <div
                                                key={task.task_id}
                                                className="p-3 border rounded hover-shadow"
                                                draggable
                                                onDragStart={(e) => onDragStart(e, task)}
                                                onClick={() => setSelectedTask(task)}
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#tasksDetailsOffcanvas"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {/* TITLE */}
                                                <div className="fw-semibold mb-1">
                                                    {task.title || task?.task_title}
                                                </div>

                                                {/* DESCRIPTION */}
                                                <div className="fs-12 text-muted text-truncate mb-2">
                                                    {task.description}
                                                </div>

                                                {/* FOOTER */}
                                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                                                    {/* PRIORITY */}
                                                    <span
                                                        className={`badge bg-${task.priorityBgColor} text-${task.priorityColor}`}
                                                    >
                                                        {task.priority}
                                                    </span>

                                                    {/* ✅ YOUR TASK BADGE */}
                                                    {task.assignments?.some(
                                                        (a) => Number(a.user_id) === Number(user_id)
                                                    ) && (
                                                            <span className="badge bg-primary">
                                                                Your Task
                                                            </span>
                                                        )}

                                                    {/* ✅ DUE DATE BADGE */}
                                                    {statusText && task.status !== "completed" && (
                                                        <span className={badgeClass}>
                                                            {statusText}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}

                                {boardTasks.filter((t) => t.status === col.key).length === 0 && (
                                    <div className="text-muted fs-12 text-center">
                                        No Tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default KanbanBoard
