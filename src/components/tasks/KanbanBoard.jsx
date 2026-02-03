import React from 'react'

const KANBAN_COLUMNS = [
  { key: 'to_do', title: 'To Do' },
  { key: 'inprogress', title: 'In Progress' },
  { key: 'completed', title: 'Completed' },
  { key: 'pending', title: 'Pending' },
  { key: 'rejected', title: 'Rejected' },
  { key: 'auto', title: 'Auto' },
]

const KanbanBoard = ({ tasks, onSelect }) => {
  return (
    <div className="row  g-4">
    {/* <div className="row overflow-x-auto  flex-nowrap d-flex g-4"> */}
      {KANBAN_COLUMNS.map((col) => (
        <div key={col.key} className="col-md-4">
          <div className="card h-100">
            <div className="card-header fw-bold text-center">
              {col.title}
            </div>

            <div className="card-body d-flex flex-column gap-3">
              {tasks
                .filter((task) => task.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded cursor-pointer hover-shadow"
                    onClick={() => onSelect(task)}
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
                    </div>
                  </div>
                ))}

              {tasks.filter((t) => t.status === col.key).length === 0 && (
                <div className="text-muted fs-12 text-center">
                  No tasks
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
