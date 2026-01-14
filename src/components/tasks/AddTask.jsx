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

const AddTask = () => {
    const token = localStorage.getItem('token')
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    // const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        project_id: '',
        task_title: '',
        description: '',
        start_date: null,
        due_date: null,
        estimated_hours: 0,
        status: 'to_do',
        priority: 'medium',
        labels: [],
        assignees: [],
    })

    /* =========================
       Fetch Managed Projects
    ========================== */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/project/managed', {
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

    /* =========================
       Create Task + Assign Users
    ========================== */
    const handleCreateTask = async () => {
        if (!formData.project_id || !formData.task_title) {
            // alert('Project and Task title are required')
            toast.error('Task created and assigned successfully');
            return
        }

        setLoading(true)

        try {
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
                }),
            })

            if (!res.ok) throw new Error('Task creation failed')

            const taskRes = await res.json()
            const taskId = taskRes?.data?.task_id || taskRes?.task_id

            /* -------- Assign Users -------- */
            if (formData.assignees.length > 0) {
                await fetch(`http://localhost:5000/api/tasks/${taskId}/assign`, {
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
                estimated_hours: 0,
                status: 'to_do',
                priority: 'medium',
                labels: [],
                assignees: [],
            })
            // setIsOpen(false);


        } catch (err) {
            console.error(err)
            // alert('Error creating task')
            toast.error(err.message || 'Error creating task');
        } finally {
            setLoading(false)
        }
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
                                min="0"
                                value={formData.estimated_hours}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        estimated_hours: Number(e.target.value),
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
                        <div className="mb-4">
                            <label className="form-label">Assignees</label>
                            <MultiSelectImg
                                options={users}
                                value={formData.assignees}
                                onChange={(v) =>
                                    setFormData({ ...formData, assignees: v })
                                }
                            />
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
