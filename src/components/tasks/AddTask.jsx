import React, { useEffect, useState } from 'react'
import TaskDateRange from './TaskDateRange'
import TaskStatus from './TaskStatus'
import MultiSelectTags from '@/components/shared/MultiSelectTags'
import MultiSelectImg from '@/components/shared/MultiSelectImg'
import {
    taskLabelsOptions,
    taskPriorityOptions,
    taskStatusOptions
} from '@/utils/options'
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap'
const AddTask = () => {
    const token = localStorage.getItem('token')
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])

    // const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        project_id: '',
        task_title: '',
        description: '',
        start_date: null,
        due_date: null,
        estimated_hours: '',
        status: 'to_do',
        priority: 'medium',
        labels: [],
        assignees: [],
        task_type: '',
        is_milestone: false,
        depends_on: [],
        blocks: [],
        visible_to_client: false,
        client_approval_required: false,

    })
    const taskTypeOptions = [
        { label: 'Content Creation', value: 'content creation' },
        { label: 'Design', value: 'design' },
        { label: 'SEO', value: 'seo' },
        { label: 'Social Media', value: 'social media' },
        { label: 'Reporting', value: 'reporting' },
        { label: 'Feature', value: 'feature' },
        { label: 'Bug', value: 'bug' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Review', value: 'review' },
        { label: 'Deployment', value: 'deployment' },
        { label: 'Support', value: 'support' },
    ]


    /* =========================
       Fetch Managed Projects
    ========================== */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // const res = await fetch('https://api-0ggv.onrender.com/api/projects/managed', {
                const res = await fetch('https://api-0ggv.onrender.com/api/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setProjects(data?.data || data || [])
            } catch (err) {
                console.error('Fetch projects error', err)
            }
        }

        fetchProjects()
    }, [token])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('https://api-0ggv.onrender.com/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()

                const options = (data?.data || data || []).map(t => ({
                    label: t.task_title,
                    value: t.task_id,
                }))

                setTasks(options)
            } catch (err) {
                console.error('Fetch tasks error', err)
            }
        }

        fetchTasks()
    }, [token])

    /* =========================
       Fetch Users
    ========================== */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('https://api-0ggv.onrender.com/api/users/user', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()

                const options = (data?.data || data || []).map(u => ({
                    label: u.full_name || u.username,
                    value: u.user_id,
                    img: u.avatar_url || null,
                }))
                setUsers(options)
            } catch (err) {
                console.error('Fetch users error', err)
            }
        }

        fetchUsers()
    }, [token])


    const closeModal = () => {
        const modalEl = document.getElementById('addNewTasks')

        if (modalEl) {
            const modalInstance =
                Modal.getInstance(modalEl) || new Modal(modalEl)
            modalInstance.hide()
        }
    }

    const validateForm = () => {
        if (!formData.project_id) {
            toast.error('Please select a project');
            return false;
        }

        if (!formData.task_title.trim()) {
            toast.error('Task title is required');
            return false;
        }

        if (
            formData.estimated_hours !== null &&
            formData.estimated_hours < 0
        ) {
            toast.error('Estimated hours cannot be negative');
            return false;
        }

        if (
            formData.start_date &&
            formData.due_date &&
            new Date(formData.start_date) > new Date(formData.due_date)
        ) {
            toast.error('Due date must be after start date');
            return false;
        }

        return true;
    };

    /* =========================
       Create Task + Assign Users
    ========================== */

    const handleCreateTask = async () => {
        if (!validateForm()) return;

        setLoading(true)

        try {
            /* -------- Create Task -------- */
            const res = await fetch('https://api-0ggv.onrender.com/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    project_id: formData.project_id,
                    task_title: formData.task_title,
                    description: formData.description,
                    start_date: formData.start_date,
                    due_date: formData.due_date,
                    estimated_hours: formData.estimated_hours,
                    status: formData.status,
                    priority: formData.priority,
                    labels: formData.labels.map(l => l.value),
                    task_type: formData.task_type,
                    is_milestone: formData.is_milestone,
                    depends_on: formData.depends_on.map(d => d.value),
                    blocks: formData.blocks.map(b => b.value),
                    visible_to_client: formData.visible_to_client,
                    client_approval_required: formData.client_approval_required,
                }),
            })

            if (!res.ok) throw new Error('Task creation failed')

            const taskRes = await res.json()
            const taskId = taskRes?.data?.task_id || taskRes?.task_id

            /* -------- Assign Users -------- */
            if (formData.assignees.length > 0) {
                await fetch(`https://api-0ggv.onrender.com/api/tasks/${taskId}/assign`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_ids: formData.assignees.map(a => a.value),
                    }),
                })
            }
            toast.success('Task created and assigned successfully');
            // alert('Task created and assigned successfully')

            /* -------- Reset -------- */
            setFormData({
                project_id: '',
                task_title: '',
                description: '',
                start_date: null,
                due_date: null,
                estimated_hours: '',
                status: 'to_do',
                priority: 'medium',
                labels: [],
                assignees: [],
                task_type: '',
                is_milestone: false,
                depends_on: [],
                blocks: [],
                visible_to_client: false,
                client_approval_required: false,
            })
            closeModal()
            // notify other components that a task was created
            try {
                const created = taskRes?.data || taskRes
                window.dispatchEvent(new CustomEvent('task:created', { detail: created }))
            } catch (e) {
                // ignore dispatch errors
            }
            // setIsOpen(false);


        } catch (err) {
            console.error(err)
            // alert('Error creating task')
            toast.error(err.message || 'Error creating task');
        } finally {
            setLoading(false)
        }
    }
    const dependsOnOptions = tasks.filter(
        t => !(formData.blocks || []).some(b => b.value === t.value)
    )

    const blocksOptions = tasks.filter(
        t => !(formData.depends_on || []).some(d => d.value === t.value)
    )

    const toggleDependsOn = (task) => {
        const exists = formData.depends_on.some(d => d.value === task.value)

        setFormData({
            ...formData,
            depends_on: exists
                ? formData.depends_on.filter(d => d.value !== task.value)
                : [...formData.depends_on, task],
        })
    }

    const toggleBlocks = (task) => {
        const exists = formData.blocks.some(b => b.value === task.value)

        setFormData({
            ...formData,
            blocks: exists
                ? formData.blocks.filter(b => b.value !== task.value)
                : [...formData.blocks, task],
        })
    }

    const toggleAssignee = (user) => {
        const exists = formData.assignees.some(a => a.value === user.value)

        setFormData({
            ...formData,
            assignees: exists
                ? formData.assignees.filter(a => a.value !== user.value)
                : [...formData.assignees, user],
        })
    }


    return (<>
        <div className="modal fade" id="addNewTasks" tabIndex="-1">
            {/* {isOpen && <div className="modal-backdrop fade show"> */}
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Task</h5>
                        <button className="btn-close" data-bs-dismiss="modal" />
                    </div>

                    {/* Body */}
                    <div className="modal-body">

                        {/* Project */}
                        <div className="mb-4">
                            <label className="form-label">Project</label>
                            <select
                                className="form-control"
                                value={formData.project_id || 0}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        project_id: Number(e.target.value),
                                    })
                                }
                            >
                                <option value={0}>Select Project</option>
                                {projects.map((p) => (
                                    <option key={p.project_id} value={p.project_id}>
                                        {p.project_name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Task Name */}
                        <div className="mb-4">
                            <label className="form-label">Task Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter task name"
                                value={formData.task_title}
                                onChange={(e) =>
                                    setFormData({ ...formData, task_title: e.target.value })
                                }
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                rows={1}
                                style={{ resize: 'none' }}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                onInput={(e) => {
                                    e.target.style.height = 'auto'
                                    e.target.style.height = e.target.scrollHeight + 'px'
                                }}
                            />
                        </div>

                        {/* Date Range */}
                        <TaskDateRange
                            onChange={(start, end) =>
                                setFormData({
                                    ...formData,
                                    start_date: start,
                                    due_date: end,
                                })
                            }
                        />
                        <div className="mb-4" />

                        <div className="mb-4">
                            <label className="form-label">Estimated Hours</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 12"
                                min={0}                        // prevents negative input
                                value={formData.estimated_hours ?? ''} // fallback to '' if null
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        estimated_hours: e.target.value === '' ? null : Number(e.target.value), // store as number
                                    })
                                }
                            />
                        </div>
                        {/* Status */}
                        <TaskStatus
                            label="Status:"
                            value={formData.status}
                            options={taskStatusOptions}
                            onChange={(v) =>
                                setFormData({ ...formData, status: v })
                            }
                        />

                        {/* Priority */}
                        <TaskStatus
                            label="Priority:"
                            value={formData.priority}
                            options={taskPriorityOptions}
                            onChange={(v) =>
                                setFormData({ ...formData, priority: v })
                            }
                        />

                        {/* Tags */}

                        <div className="mb-4">
                            <label className="form-label">Tags</label>
                            <MultiSelectTags
                                options={taskLabelsOptions}
                                value={formData.labels}            // controlled
                                onChange={(v) => setFormData({ ...formData, labels: v })}
                            />
                        </div>

                        {/* Assignees */}
                        {/* <div className="mb-4">
                            <label className="form-label">Assignees</label>
                            <MultiSelectImg
                                options={users}
                                value={formData.assignees}
                                onChange={(v) =>
                                    setFormData({ ...formData, assignees: v })
                                }
                            />
                        </div> */}
                        <div className="mb-4">
                            <label className="form-label">Assignees</label>

                            <div className="border rounded p-2" style={{ maxHeight: 180, overflowY: 'auto' }}>
                                {users.map(user => (
                                    <div
                                        key={user.value}
                                        className="form-check d-flex align-items-center gap-2 mb-1"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`assignee-${user.value}`}
                                            checked={formData.assignees.some(a => a.value === user.value)}
                                            onChange={() => toggleAssignee(user)}
                                        />

                                        {user.img ? (
                                            <img
                                                src={user.img}
                                                alt={user.label}
                                                width="28"
                                                height="28"
                                                className="rounded-circle"
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: 28, height: 28, fontSize: 12 }}
                                            >
                                                {user.label.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <label
                                            htmlFor={`assignee-${user.value}`}
                                            className="form-check-label"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {user.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Task Type</label>
                            <select
                                className="form-control"
                                value={formData.task_type}
                                onChange={(e) =>
                                    setFormData({ ...formData, task_type: e.target.value })
                                }
                            >
                                <option value="">Select Task Type</option>
                                {taskTypeOptions.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-check mb-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isMilestone"
                                checked={formData.is_milestone}
                                onChange={(e) =>
                                    setFormData({ ...formData, is_milestone: e.target.checked })
                                }
                            />
                            <label className="form-check-label" htmlFor="isMilestone">
                                Mark as Milestone
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Depends On</label>

                            <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: 'auto' }}>
                                {dependsOnOptions.map(task => (
                                    <div key={task.value} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`depends-${task.value}`}
                                            checked={formData.depends_on.some(d => d.value === task.value)}
                                            onChange={() => toggleDependsOn(task)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`depends-${task.value}`}
                                        >
                                            {task.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Blocks</label>

                            <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: 'auto' }}>
                                {blocksOptions.map(task => (
                                    <div key={task.value} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`blocks-${task.value}`}
                                            checked={formData.blocks.some(b => b.value === task.value)}
                                            onChange={() => toggleBlocks(task)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`blocks-${task.value}`}
                                        >
                                            {task.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="visibleToClient"
                                checked={formData.visible_to_client}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        visible_to_client: e.target.checked,
                                    })
                                }
                            />
                            <label className="form-check-label" htmlFor="visibleToClient">
                                Visible to Client
                            </label>
                            {formData.visible_to_client && (
                                <div className="form-check mb-4 ms-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="clientApprovalRequired"
                                        checked={formData.client_approval_required}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                client_approval_required: e.target.checked,
                                            })
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="clientApprovalRequired">
                                        Client approval required
                                    </label>
                                </div>
                            )}

                        </div>


                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button className="btn btn-danger" data-bs-dismiss="modal">
                            {/* <button  onClick={() => setIsOpen(false)}  className="btn btn-danger" data-bs-dismiss="modal"> */}
                            Discard
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleCreateTask}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Add Task'}
                        </button>
                    </div>

                </div>
            </div>
            {/* </div>}</> */}
        </div>
    </>
    )
}

export default AddTask
