import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import TasksDetails from '../tasks/TasksDetails'
import { getDate } from 'date-fns'

const COLUMNS = [
    { key: 'to_do', title: 'To Do' },
    { key: 'inprogress', title: 'In Progress' },
    { key: 'completed', title: 'Completed' },
    { key: 'pending', title: 'Pending' },
    { key: 'rejected', title: 'Rejected' },
    { key: 'auto', title: 'Auto' },
]

const KanbanBoard = ({ tasks = [] }) => {
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
        console.log("hi",e.dataTransfer.getData('text/plain'))
        const taskId = Number(e.dataTransfer.getData('text/plain'))
        const fromStatus = e.dataTransfer.getData('fromStatus')
        console.log(taskId, fromStatus)
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
                `http://localhost:5000/api/tasks/${taskId}/status`,
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

    /* =========================
       RENDER
    ========================== */
    return (
        <>
            <TasksDetails task={selectedTask} user_id={user_id} />

            <div className="row flex-nowrap overflow-x-auto g-4 h-100">
                {COLUMNS.map((col) => (
                    <div key={col.key} className="col-md-4">
                        <div className="card h-100">
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
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-3 border rounded hover-shadow"
                                            draggable
                                            onDragStart={(e) => onDragStart(e, task)}
                                            onClick={() => setSelectedTask(task)}
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#tasksDetailsOffcanvas"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="fw-semibold mb-1">
                                                {task.title}
                                            </div>

                                            <div className="fs-12 text-muted text-truncate mb-2">
                                                {task.description}
                                            </div>

                                            <span
                                                className={`badge bg-${task.priorityBgColor} text-${task.priorityColor}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>
                                    ))}

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
