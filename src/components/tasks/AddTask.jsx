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
    const [projectLoading, setProjectLoading] = useState(true)
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
        is_recurring: false,
        recurrence_type: '',
        interval: 1,
        daysOfWeek: [],

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
        { label: 'Billing', value: 'billing' },
    ]


    /* =========================
       Fetch Managed Projects
    ========================== */
    useEffect(() => {
        const fetchProjects = async () => {
            try {

                setProjectLoading(true)
                // const res = await fetch('http://localhost:5000/api/projects/managed', {
                const res = await fetch('http://localhost:5000/api/projects/projects-members', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setProjects(data?.data || data || [])
            } catch (err) {
                console.error('Fetch projects error', err)
            } finally {
                setProjectLoading(false)
            }
        }

        fetchProjects()
    }, [token])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/tasks', {
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
                const res = await fetch('http://localhost:5000/api/users/user', {
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
        // const hours = Number(formData.estimated_hours);

        // if (!hours || hours <= 0) {
        //     toast.error('Estimated hours must be greater than 0');
        //     return false;
        // }

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

        setLoading(true);

        try {
            let recurrence_pattern = null;

            if (formData.is_recurring) {
                recurrence_pattern = {
                    type: formData.recurrence_type,
                    interval: formData.interval || 1,
                    daysOfWeek: formData.daysOfWeek || [],
                    next_run_at: formData.due_date || new Date().toISOString()
                };
            }
            /* -------- Create Task -------- */
            const res = await fetch('http://localhost:5000/api/tasks', {
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

                    is_recurring: formData.is_recurring,
                    recurrence_pattern,

                    // ❌ REMOVE dependencies if recurring
                    depends_on: formData.is_recurring ? [] : formData.depends_on.map(d => d.value),
                    blocks: formData.is_recurring ? [] : formData.blocks.map(b => b.value),

                    visible_to_client: formData.visible_to_client,
                    client_approval_required: formData.client_approval_required,
                    // depends_on: formData.depends_on.map(d => d.value),
                    // blocks: formData.blocks.map(b => b.value),
                    // visible_to_client: formData.visible_to_client,
                    // client_approval_required: formData.client_approval_required,
                }),
            });

            if (!res.ok) throw new Error('Task creation failed');

            const taskRes = await res.json();
            const taskId = taskRes?.data?.task_id || taskRes?.task_id;

            /* ✅ Instant UI response */
            toast.success('Task has been created successfully');
            closeModal();

            /* -------- Assign Users (NON-BLOCKING) -------- */
            if (formData.assignees.length > 0) {
                fetch(`http://localhost:5000/api/tasks/${taskId}/assign`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_ids: formData.assignees.map(a => a.value),
                    }),
                }).catch(err => {
                    console.error('Assign failed:', err);
                });
            }

            /* -------- Reset Form -------- */
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
            });

            /* -------- Notify UI -------- */
            try {
                const created = taskRes?.data || taskRes;
                window.dispatchEvent(new CustomEvent('task:created', { detail: created }));
            } catch (e) { }

        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Error creating task');
        } finally {
            setLoading(false);
        }
    };

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
                            <label className="form-label">
                                Project<span className="text-danger">* </span>
                                <span className="text-xs text-gray-500">
                                    If the project is not visible to you, please ask your admin to add you as a project member.
                                </span>
                            </label>

                            {projectLoading ? (
                                <div className="border rounded p-3 text-center text-muted bg-light">
                                    Loading projects...
                                </div>
                            ) : projects.length > 0 ? (
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
                            ) : (
                                <div className="border rounded p-3 text-center text-muted bg-light">
                                    No projects available
                                </div>
                            )}
                        </div>

                        {/* Task Name */}
                        <div className="mb-4">
                            <label className="form-label">Task Title<span className="text-danger">*</span></label>
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
                            onChange={(start, end) => {
                                const addOneDay = (dateStr) => {
                                    if (!dateStr) return null
                                    const d = new Date(dateStr)
                                    d.setDate(d.getDate() + 1) // 🔥 add 1 day
                                    return d.toISOString()
                                }

                                setFormData({
                                    ...formData,
                                    start_date: addOneDay(start),
                                    due_date: addOneDay(end),
                                })
                            }}
                        />
                        <div className="mb-4" />

                        <div className="mb-4">
                            <label className="form-label">Estimated Hours <span className="text-xs text-gray-500 mt-1">(Optional — add only if you want to estimate effort or track time.)</span></label>
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
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isRecurring"
                                checked={formData.is_recurring}
                                onChange={(e) =>
                                    setFormData({ ...formData, is_recurring: e.target.checked })
                                }
                            />
                            <label className="form-check-label">Recurring Task <span className="text-xs text-gray-500">You set it once → it repeats daily/weekly/monthly automatically</span></label>
                        </div>

                        {formData.is_recurring && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Recurrence Type</label>
                                    <select
                                        className="form-control"
                                        value={formData.recurrence_type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, recurrence_type: e.target.value })
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                {formData.recurrence_type === 'weekly' && (
                                    <div className="mb-3">
                                        <label>Select Days</label>
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                            <div key={day}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.daysOfWeek.includes(day)}
                                                    onChange={() => {
                                                        const exists = formData.daysOfWeek.includes(day);
                                                        setFormData({
                                                            ...formData,
                                                            daysOfWeek: exists
                                                                ? formData.daysOfWeek.filter(d => d !== day)
                                                                : [...formData.daysOfWeek, day]
                                                        });
                                                    }}
                                                />
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {!formData.is_recurring && <>


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
                                    Mark as Milestone<span className="text-xs text-gray-500">
                                        (Marks this task as a key milestone in the project)
                                    </span>
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Depends On <span className="text-xs text-gray-500 mt-1">(Select tasks that must be completed before this task starts)</span></label>

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
                                <label className="form-label">Blocking Task <span className="text-xs text-gray-500">
                                    (Select tasks that will be blocked until this task is completed)
                                </span></label>

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
                        </>
                        }
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
