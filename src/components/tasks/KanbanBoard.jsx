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
  const userId = JSON.parse(localStorage.getItem('user'))?.user_id
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
    <div className="row overflow-x-auto  flex-nowrap g-4 h-100 ">
      {/* <div className="row overflow-x-auto  flex-nowrap d-flex g-4"> */}
      {KANBAN_COLUMNS.map((col) => (
        <div key={col.key} className="col-md-4 mb-4">
          <div className="card h-100  col overflow-y-auto  flex-nowrap d-flex g-4" >
            <div className="card-header fw-bold text-center">
              {col.title}
            </div>

            <div className="card-body d-flex flex-column gap-3" onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.key)}>
              {tasks2
                .filter((task) => task.status === col.key)
                .map((task) => {
                  return (
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

                        {/* ✅ YOUR TASK BADGE */}
                        {task.assignments?.some(
                          (a) => Number(a.user_id) === Number(userId)
                        ) && (
                            <span className="badge bg-primary ms-2">
                              Your Task
                            </span>
                          )}
                        <img
                          src={task.assignments.avatar_url || "data:image/jpeg;base64,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"}
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
                        {!task.client_approval_required ? task.client_approved && (
                          <div className="mt-2">
                            <span className="badge bg-secondary">
                              Client Approved
                            </span>
                          </div>) : (<div className="mt-2 bg-light ">
                            <span className="badge text-black">
                              Client Approval Required
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

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
