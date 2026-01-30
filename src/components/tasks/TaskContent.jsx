import React, { useEffect, useState, useMemo } from 'react'
import { FiMoreVertical, FiStar } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import PerfectScrollbar from 'react-perfect-scrollbar'
import TaskHeader from './TaskHeader'
import Footer from '@/components/shared/Footer'
import TaskSidebar from './TaskSidebar'
import ToastProvider from '../ToastProvider'
import TasksDetails from './TasksDetails'
import CheckList from '../CheckList'

const actions = [
    { label: 'Edit Task', icon: '' },
    { label: 'View Task', icon: '' },
    { label: 'Delete Task', icon: '' },
]


const TaskContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [tasks, setTasks] = useState([])
    const [user_id, setUser_id] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)
    const [activeFilter, setActiveFilter] = useState({
        type: 'status',
        value: 'all',
    })

    /* =========================
       FETCH TASKS
    ========================== */
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:5000/api/tasks/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const json = await res.json()

            const formattedTasks = Array.isArray(json.data)
                ? json.data.map((task) => ({
                    id: task.task_id,
                    title: task.task_title,
                    description: task.description || '—',
                    priority: task.priority,
                    priorityColor:
                        task.priority === 'high'
                            ? 'danger'
                            : task.priority === 'medium'
                                ? 'warning'
                                : 'success',
                    priorityBgColor:
                        task.priority === 'high'
                            ? 'soft-danger'
                            : task.priority === 'medium'
                                ? 'soft-warning'
                                : 'soft-success',
                    statusColor:
                        task.status === 'completed'
                            ? 'success'
                            : task.status === 'inprogress'
                                ? 'info'
                                : task.status === 'pending'
                                    ? 'warning'
                                    : 'primary',
                    statusBgColor:
                        task.status === 'completed'
                            ? 'soft-success'
                            : task.status === 'inprogress'
                                ? 'soft-info'
                                : task.status === 'pending'
                                    ? 'soft-warning'
                                    : 'soft-primary',
                    taskType: task.task_type || 'Task',
                    taskTypeColor: 'primary',
                    taskTypeBgColor: 'soft-primary',
                    user_img: '/images/avatar/1.png',
                    assigned_date: new Date(task.assigned_date),
                    due_date: new Date(task.due_date),
                    assigned_to: task.assigned_to,
                    start_date: new Date(task.start_date),
                    tags: task.tags || [],
                    status: task.status || 'to_do',
                    checklist: task.checklist || [],
                    created_at: task.created_at,
                    task_type: task.task_type,
                    project_id: task.project_id,
                    assignments: task?.assignments,
                    created_by: task?.created_by,
                }))
                : []
            setTasks(formattedTasks)
        }
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    setUser_id(payload.user_id)
    return payload.user_id
  } catch (e) {
    return null
  }
}
fetchTasks()
getUserIdFromToken()
    }, [])

    /* =========================
       APPLY FILTER
    ========================== */
    const filteredTasks = useMemo(() => {
        if (activeFilter.value === 'all') return tasks

        if (activeFilter.type === 'status') {
            return tasks.filter((t) => t.status === activeFilter.value)
        }

        if (activeFilter.type === 'priority') {
            return tasks.filter((t) => t.priority === activeFilter.value)
        }

        return tasks
    }, [tasks, activeFilter])

    const groupedTasks = groupTasksByDate(filteredTasks)

    return (
        <>
            <TaskSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onFilterChange={setActiveFilter}
            />

            <ToastProvider />
            <TasksDetails task={selectedTask} user_id={user_id} />

            <div className="content-area">
                <PerfectScrollbar>
                    <TaskHeader setSidebarOpen={setSidebarOpen} />

                    <div className="content-area-body">
                        {Object.keys(groupedTasks).map((group, index) =>
                            groupedTasks[group].length > 0 ? (
                                <div key={group} className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">{group}</h5>
                                    </div>

                                    <div className="card-body">
                                        <ul className="list-unstyled mb-0">
                                            {groupedTasks[group].map((task) => (
                                                <List
                                                    key={task.id}
                                                    {...task}
                                                    onSelect={() => setSelectedTask(task)}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>

                    <Footer />
                </PerfectScrollbar>
            </div>
        </>
    )
}

export default TaskContent


/* =========================
   TASK ITEM
========================== */
const List = ({
    title,
    description,
    priority,
    taskType,
    user_img,
    priorityColor,
    priorityBgColor,
    taskTypeColor,
    taskTypeBgColor,
    statusBgColor,
    statusColor,
    onSelect,
    tags,
    status
}) => {
    return (
        <li className="single-task-list p-3 mb-3 border border-dashed rounded-3">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3 me-3">
                    <div className="d-flex align-items-center gap-3">
                        <FiStar />
                        <a
                            href="#"
                            className="single-task-list-link"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#tasksDetailsOffcanvas"
                            onClick={onSelect}
                        >
                            <div className="fs-13 fw-bold text-truncate-1-line">
                                {title}
                                <span
                                    className={`ms-2 badge bg-${priorityBgColor} text-${priorityColor} text-capitalize`}
                                >
                                    {priority}
                                </span>

                            </div>
                            <div className="fs-12 fw-normal text-muted text-truncate-1-line">
                                {description}
                            </div>
                        </a>
                        {/* <div>
                            <div className="fs-13 fw-bold">
                                {title}
                                <span
                                    className={`ms-2 badge bg-${priorityBgColor} text-${priorityColor} text-capitalize`}
                                >
                                    {priority}
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <span
                        className={`badge bg-${statusBgColor} text-${statusColor} text-capitalize`}
                    >
                        {status}
                    </span>
                    <span
                        className={`badge bg-${taskTypeBgColor} text-${taskTypeColor} text-capitalize`}
                    >
                        {taskType}
                    </span>

                    <img
                        src={user_img}
                        alt="user"
                        className="avatar-image avatar-md"
                    />
                    <div className="dropdown">
                        <button
                            className="btn p-0 border-0 bg-transparent"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FiMoreVertical size={18} />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            {/* <li>
                                <button
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                >
                                    Edit Task
                                </button>
                            </li> */}

                            <li>
                                <a  href="#"
                            className="single-task-list-link"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#tasksDetailsOffcanvas"
                            onClick={onSelect}>
                                <button
                                
                                    className="dropdown-item"
                                   >
                                    View Task
                                </button>
                                </a>
                            </li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={(e) => {
                                        // e.stopPropagation()
                                        console.log('Delete Task')
                                    }}
                                >
                                    Delete Task
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* <Dropdown dropdownItems={actions} /> */}
                </div>
            </div>
        </li>
    )
}

/* =========================
   GROUPING LOGIC
========================== */
const groupTasksByDate = (tasks = []) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const groupedTasks = {
        'Recently Assigned': [],
        Yesterday: [],
    }

    tasks.forEach((task) => {
        const taskDate = new Date(task.created_at)
        if (taskDate.toDateString() === today.toDateString()) {
            groupedTasks['Recently Assigned'].push(task)
        } else if (taskDate.toDateString() === yesterday.toDateString()) {
            groupedTasks['Yesterday'].push(task)
        } else {
            const key = getStartOfWeekGroup(taskDate).toDateString()
            if (!groupedTasks[key]) groupedTasks[key] = []
            groupedTasks[key].push(task)
        }
    })

    return groupedTasks
}

const getStartOfWeekGroup = (date) => {
    const d = new Date(date)
    d.setDate(d.getDate() - (d.getDate() % 7))
    return d
}


