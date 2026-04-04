import React, { useEffect, useState, useMemo } from 'react'
import { FiMoreVertical, FiStar } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import PerfectScrollbar from 'react-perfect-scrollbar'
import TaskHeader from './TaskHeader'
import Footer from '@/components/shared/Footer'
// import TaskSidebar from './TaskSidebar'
import ToastProvider from '../ToastProvider'
import TasksDetails from './TasksDetails'
import CheckList from '../CheckList'
import { toast } from 'react-toastify';
import KanbanBoard from './KanbanBoard'
import CalendarConteent from './CalendarContent '
const actions = [
    { label: 'Edit Task', icon: '' },
    { label: 'View Task', icon: '' },
    { label: 'Delete Task', icon: '' },
]


const TaskContent = () => {
    const [viewMode, setViewMode] = useState('kanban') // list | kanban
    const [loading, setLoading] = useState(true)

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
    const fetchTasks = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await fetch('https://api-0ggv.onrender.com/api/tasks/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }
            const json = await res.json()
            console.log(JSON.stringify(json.data))
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
                    taskType: task.task_type || 'Feature',
                    taskTypeColor: 'primary',
                    taskTypeBgColor: 'soft-primary',
                    user_img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z',
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
                    visible_to_client: task?.visible_to_client,
                    client_approval_required: task?.client_approval_required,
                    client_approved: task?.client_approved,
                    projectName: task?.project?.project_name,    
                }))
                : []
            setTasks(formattedTasks)
        } catch (error) {
            console.error('Fetch tasks error:', error);
            toast.error(error.message || 'Something went wrong while fetching tasks');
        } finally {
            setLoading(false)
        }
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

    useEffect(() => {
        const onTaskCreated = () => {
            fetchTasks()
        }

        fetchTasks()
        getUserIdFromToken()

        window.addEventListener('task:created', onTaskCreated)
        return () => window.removeEventListener('task:created', onTaskCreated)
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
    const hasNoTasks = !loading && filteredTasks.length === 0
    const handleTaskStatusUpdate = (taskId, newStatus) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };
    const handleTaskPriorityUpdate = (taskId, newPriority) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === taskId ? { ...task, priority: newPriority } : task
            )
        );
    };
    return (
        <>
            {/* <TaskSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onFilterChange={setActiveFilter}
                activeFilter={activeFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
            /> */}


            <ToastProvider />
            <TasksDetails task={selectedTask} user_id={user_id} onStatusChange={handleTaskStatusUpdate} onPriorityChange={handleTaskPriorityUpdate} />

            <div className="content-area">
                <PerfectScrollbar>
                    <TaskHeader setSidebarOpen={setSidebarOpen}
                        sidebarOpen={sidebarOpen}
                        onFilterChange={setActiveFilter}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        viewMode={viewMode}
                        setViewMode={setViewMode} />

                    <div className="px-4 pt-4   overflow-hidden" style={
                        // <div className="content-area-body   overflow-hidden" style={
                        viewMode === 'kanban'
                            ? { height: '66vh' }
                            : {}
                    }>
                        {/* <div className="content-area-body   overflow-hidden" style={{ height: '67vh' }}> */}
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : viewMode === 'kanban' ? (
                            <KanbanBoard
                                tasks={filteredTasks}
                                onSelect={(task) => setSelectedTask(task)}
                            />
                        ) : hasNoTasks ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
                                <div className="fs-5 fw-semibold mb-2">No tasks found</div>
                                <div className="fs-13">
                                    Try changing filters or create a new task
                                </div>
                            </div>) : viewMode === 'calendar' ? (<div >  <CalendarConteent
                                tasks={filteredTasks}
                                onSelect={(task) => setSelectedTask(task)}
                            /></div>) : (
                            Object.keys(groupedTasks).map((group) =>
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
                            )
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
                                <a href="#"
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


