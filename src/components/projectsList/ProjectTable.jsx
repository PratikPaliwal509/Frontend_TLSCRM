import React, { useEffect, useMemo, useState } from 'react'
import {
    FiEye,
    FiEdit3,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../loader'

/* ---------------- STATUS OPTIONS ---------------- */

const STATUS_OPTIONS = [
    { label: 'Planning', value: 'planning' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Completed', value: 'completed' },
]

const getStatusOption = (value) => {
    return (
        STATUS_OPTIONS.find((s) => s.value === value) || {
            label: '—',
            value: '',
        }
    )
}

/* ---------------- CUSTOM SELECT DROPDOWN ---------------- */

const CustomSelect = ({ options, selected, onChange }) => {
    const [open, setOpen] = useState(false)

    return (
        <div style={{ position: 'relative', minWidth: 140 }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    border: '1px solid #ddd',
                    padding: '6px 10px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: '#fff',
                }}
            >
                {selected?.label}
            </div>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        right: 0,
                        border: '1px solid #ddd',
                        background: '#fff',
                        borderRadius: 6,
                        zIndex: 1000,
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt)
                                setOpen(false)
                            }}
                            style={{
                                padding: '8px 10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f1f1',
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ---------------- STATUS CELL ---------------- */

const StatusCell = ({ project, onStatusChange }) => {
    const [selected, setSelected] = useState(
        getStatusOption(project.status)
    )

    useEffect(() => {
        setSelected(getStatusOption(project.status))
    }, [project.status])

    const handleChange = (option) => {
        const toastId = toast(
            <div>
                <div>
                    Update status to <strong>{option.label}</strong>?
                </div>

                <div className="mt-2 d-flex gap-2">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={async () => {
                            toast.update(toastId, {
                                isLoading: true,
                                render: 'Updating...',
                            })

                            try {
                                const res = await fetch(
                                    `https://api-0ggv.onrender.com/api/projects/${project.project_id}/status`,
                                    {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem(
                                                'token'
                                            )}`,
                                        },
                                        body: JSON.stringify({ status: option.value }),
                                    }
                                )

                                const data = await res.json()

                                if (data.success) {
                                    setSelected(option)
                                    onStatusChange(project.project_id, option.value)

                                    toast.update(toastId, {
                                        render: 'Status updated successfully',
                                        type: 'success',
                                        isLoading: false,
                                        autoClose: 2000,
                                    })
                                } else {
                                    throw new Error()
                                }
                            } catch (err) {
                                toast.update(toastId, {
                                    render: 'Failed to update status',
                                    type: 'error',
                                    isLoading: false,
                                    autoClose: 3000,
                                })
                            }
                        }}
                    >
                        Yes
                    </button>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => toast.dismiss(toastId)}
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
    }

    return (
        <CustomSelect
            options={STATUS_OPTIONS}
            selected={selected}
            onChange={handleChange}
        />
    )
}

/* ---------------- UTIL ---------------- */

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '—'

/* ---------------- MAIN TABLE ---------------- */

const ProjectTable = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(
                    'https://api-0ggv.onrender.com/api/projects',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
                const json = await res.json()
                setProjects(json?.data || [])
            } catch (err) {
                toast.error('Failed to load projects')
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    const handleStatusChange = (id, newStatus) => {
        setProjects((prev) =>
            prev.map((p) =>
                p.project_id === id ? { ...p, status: newStatus } : p
            )
        )
    }

    if (loading) return <div><Loader/></div>

    if (!projects.length)
        return <div>No projects found</div>

    return (
        <div className="table-responsive">
            <table
                className="table"
                style={{
                    borderCollapse: 'collapse',
                    width: '100%',
                }}
            >
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Project</th>
                        <th>Client</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th style={{ width: '5%' }}>Status</th>
                        <th style={{ textAlign: 'right' }}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {projects.map((project) => (
                        <tr key={project.project_id}>
                            <td style={{ maxWidth: 300 }}>
                                <div>
                                    {/* Project Name */}
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        onClick={() =>
                                            navigate(`/projects/view/${project.project_id}`)
                                        }
                                        title={project.project_name}
                                    >
                                        {project.project_name}
                                    </div>

                                    {/* Description */}
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: '#777',
                                            marginTop: 4,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                        title={project.description}
                                    >
                                        {project.description || 'No description'}
                                    </div>
                                </div>
                            </td>


                            <td>
                                {project.client_id
                                    ? `Client #${project.client_id}`
                                    : 'Not Assigned'}
                            </td>

                            <td>
                                {formatDate(project.start_date)}
                            </td>

                            <td>
                                {formatDate(project.end_date)}
                            </td>

                            <td>
                                <StatusCell
                                    project={project}
                                    onStatusChange={
                                        handleStatusChange
                                    }
                                />
                            </td>

                            <td style={{ textAlign: 'right' }}>
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        marginRight: 10,
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/projects/view/${project.project_id}`
                                        )
                                    }
                                >
                                    <FiEye />
                                </span>

                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        navigate(
                                            `/projects/edit/${project.project_id}`
                                        )
                                    }
                                >
                                    <FiEdit3 />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProjectTable
