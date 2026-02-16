import { verifyAccess } from '@/utils/verifyAccess'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
const KANBAN_COLUMNS = [
  { key: 'to_do', title: 'To Do' },
  { key: 'inprogress', title: 'In Progress' },
  { key: 'completed', title: 'Completed' },
  { key: 'pending', title: 'Pending' },
  { key: 'rejected', title: 'Rejected' },
  { key: 'auto', title: 'Auto' },
]

const KanbanBoard = ({ tasks, onSelect }) => {
  const [isClient, setIsClient] = useState(false)
  const [tasks2, setTasks] = useState(tasks || [])
  useEffect(() => {
    const checkPermission = async () => {
      const res = await verifyAccess('tasks', 'view', 'client')
      setIsClient(res)
    };
    checkPermission();
  }, []);
  useEffect(() => {
    setTasks(tasks)
  }, [tasks])

  const approveTask = async (taskId) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(
        `https://api-0ggv.onrender.com/api/tasks/${taskId}/approve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, client_approved: true }
            : task
        )
      )

      if (!res.ok) {
        throw new Error(data.message)
      }
      // ✅ SUCCESS TOAST
      toast.success(data?.message || 'Task approved successfully')
      return data
    } catch (error) {
      // ❌ ERROR TOAST
      toast.error(error.message || 'Something went wrong')
      throw error
    }
  }
  const onDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('fromStatus', task.status)
  }

  const onDragOver = (e) => {
    e.preventDefault() // REQUIRED to allow drop
  }
  const onDrop = async (e, newStatus) => {
    e.preventDefault()

    const taskId = e.dataTransfer.getData('taskId')
    const fromStatus = e.dataTransfer.getData('fromStatus')

    if (!taskId || fromStatus === newStatus) return

    // optimistic UI update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === Number(taskId)
          ? { ...task, status: newStatus }
          : task
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

      if (!res.ok) throw new Error(data.message || 'Status update failed')

      toast.success('Task status updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update status')

      // rollback if API fails
      setTasks((prev) =>
        prev.map((task) =>
          task.id === Number(taskId)
            ? { ...task, status: fromStatus }
            : task
        )
      )
    }
  }


  return (
    <div className="row overflow-x-auto  flex-nowrap g-4 h-100">
      {/* <div className="row overflow-x-auto  flex-nowrap d-flex g-4"> */}
      {KANBAN_COLUMNS.map((col) => (
        <div key={col.key} className="col-md-4">
          <div className="card h-100   col overflow-y-auto  flex-nowrap d-flex g-4">
            <div className="card-header fw-bold text-center">
              {col.title}
            </div>

            <div className="card-body d-flex flex-column gap-3" onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.key)}>
              {tasks2
                .filter((task) => task.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded cursor-pointer hover-shadow"
                    onClick={() => onSelect(task)}
                    draggable
                    onDragStart={(e) => onDragStart(e, task)}
                    style={{ cursor: 'pointer' }}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#tasksDetailsOffcanvas"
                  >
                    <div className="fw-semibold mb-1">
                      {task.title}
                    </div>

                    <div className="fs-12 text-muted mb-2 text-truncate">
                      {task.description}
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`badge bg-${task.priorityBgColor} text-${task.priorityColor}`}
                      >
                        {task.priority}
                      </span>

                      <img
                        src={task.user_img}
                        alt="user"
                        className="avatar-image avatar-xs"
                      />
                      {/* ✅ CLIENT APPROVAL */}
                      {isClient &&
                        task.client_approval_required &&
                        !task.client_approved && (
                          <div className="mt-2 text-end">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={(e) => {
                                e.stopPropagation()
                                // call approve API here
                                approveTask(task.id)
                              }}
                            >
                              Approve
                            </button>
                          </div>
                        )}

                      {/* ✅ Approved badge */}
                      {task.client_approved && (
                        <div className="mt-2">
                          <span className="badge bg-secondary">
                            Client Approved
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {tasks.filter((t) => t.status === col.key).length === 0 && (
                <div className="text-muted fs-12 text-center">
                  No Tasks
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default KanbanBoard
