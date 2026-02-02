import React from 'react'

const renderTree = (items = [], parentId = null) => {
  return (
    <ul className="list-unstyled">
      {items
        .filter((i) => (i.parent_task_id ?? null) === parentId)
        .map((item) => (
          <li key={item.task_id} className="mb-2">
            <div className="d-flex align-items-center">
              <i className="feather-layers me-2"></i>
              <div>
                <div className="fw-semibold text-truncate" title={item.task_title}>
                  {item.task_title}
                </div>
                <div className="text-muted small">
                  {item.start_date && item.due_date
                    ? `${new Date(item.start_date).toLocaleDateString()} → ${new Date(item.due_date).toLocaleDateString()}`
                    : 'No dates'}
                </div>
              </div>
            </div>
            {items.some((i) => i.parent_task_id === item.task_id) && (
              <div style={{ paddingLeft: 20 }}>
                {renderTree(items, item.task_id)}
              </div>
            )}
          </li>
        ))}
    </ul>
  )
}

const TaskTree = ({ tasks = [] }) => {
  if (!tasks || tasks.length === 0) {
    return <div className="text-muted">No tasks to display</div>
  }

  return <div>{renderTree(tasks)}</div>
}

export default TaskTree
