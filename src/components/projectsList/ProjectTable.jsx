
import React, { useEffect, useMemo, useState } from 'react'
import Table from '@/components/shared/table/Table'
import {
    FiAlertOctagon,
    FiArchive,
    FiClock,
    FiEdit3,
    FiEye,
    FiMoreHorizontal,
    FiPrinter,
    FiTrash2
} from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

/* ---------------- ACTIONS ---------------- */
const actions = [
    { label: "View", icon: <FiEye /> },
    { label: "Edit", icon: <FiEdit3 /> },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 />, className: 'text-danger' },
]

/* ---------------- STATUS OPTIONS ---------------- */
const STATUS_OPTIONS = [
    { label: "Planning", value: "planning" },
    { label: "In Progress", value: "in_progress" },
    { label: "On Hold", value: "on_hold" },
    { label: "Completed", value: "completed" },
]

// Helper function to get status option from value
const getStatusOption = (statusValue) => {
    const found = STATUS_OPTIONS.find((s) => s.value === statusValue)
    return found || { label: "—", value: "" } // Return dash for unknown status
}

/* ---------------- SELECT CELL ---------------- */
const StatusTableCell = ({ options, defaultSelect, row, onStatusChange }) => {
    const [selectedOption, setSelectedOption] = useState(defaultSelect || getStatusOption(""))

    useEffect(() => {
        setSelectedOption(defaultSelect || getStatusOption(""))
    }, [defaultSelect, options])

    const handleChange = (option) => {
        
        // Handle both cases: option object or just the value string
        let selectedValue = option
        let selectedLabel = option
        
        if (typeof option === 'object' && option.value) {
            selectedValue = option.value
            selectedLabel = option.label
        }
        
        if (!selectedValue) {
            return
        }

        const toastId = toast(
            <div>
                <div>
                    Do you want to update status to "<strong>{selectedLabel}</strong>"?
                </div>

                <div className="mt-2 d-flex gap-2">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={async () => {

                            // ⛔ Disable buttons + show loader
                            toast.update(toastId, {
                                isLoading: true,
                                render: 'Updating status...',
                            })

                            try {
                                const projectId = row.raw.project_id || row.raw.id
                                const url = `http://localhost:5000/api/projects/${projectId}/status`
                                const payload = { status: selectedValue }

                                const res = await fetch(url, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                                    },
                                    body: JSON.stringify(payload),
                                })

                                const data = await res.json()

                                if (data.success) {
                                    setSelectedOption({ label: selectedLabel, value: selectedValue })
                                    onStatusChange(
                                        row.raw.project_id || row.raw.id,
                                        selectedValue
                                    )

                                    toast.update(toastId, {
                                        render: 'Status updated successfully',
                                        type: 'success',
                                        isLoading: false,
                                        autoClose: 2000,
                                    })
                                } else {
                                    toast.update(toastId, {
                                        render: 'Failed to update status',
                                        type: 'error',
                                        isLoading: false,
                                        autoClose: 3000,
                                    })
                                }
                            } catch (err) {
                                console.error(err)
                                toast.update(toastId, {
                                    render: 'Error updating status',
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
                position: 'top-right',
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                draggable: false,
            }
        )


    }

    return (
        <SelectDropdown
            options={options}
            selectedOption={selectedOption}
            onSelectOption={handleChange}
        />
    )
}

/* ---------------- UTILS ---------------- */
const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString()
}

const emptyValue = (value, fallback = '—') =>
    value === null || value === undefined || value === '' ? fallback : value

/* ---------------- MAIN COMPONENT ---------------- */
const ProjectTable = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    /* ---------- FETCH PROJECTS ---------- */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:5000/api/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const json = await res.json()
                setProjects(json?.data || [])
            } catch (error) {
                console.error('Fetch projects error', error)
                toast.error('Failed to load projects')
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    /* ---------- HANDLE STATUS CHANGE ---------- */
    const handleStatusChange = (projectId, newStatus) => {
        setProjects((prev) =>
            prev.map((proj) =>
                proj.project_id === projectId
                    ? { ...proj, status: newStatus }
                    : proj
            )
        )
    }

    /* ---------- TABLE DATA ---------- */
    // const tableData = useMemo(() => {
    //     return projects?.map((project) => ({
    //         id: project.project_id,

    //         project: {
    //             title: project.project_name,
    //             description: emptyValue(project.description, 'No description provided'),
    //         },

    //         clients: {
    //             name: project.client_id ? `Client #${project.client_id}` : 'Not Assigned',
    //             email: '',
    //         },

    //         start_date: formatDate(project.start_date),
    //         end_date: formatDate(project.end_date),

    //         status: {
    //             defaultSelect: getStatusOption(project.status),
    //             options: STATUS_OPTIONS,
    //         },

    //         raw: project, // Keep original data for reference
    //     }))
    // }, [projects])
    const tableData = useMemo(() => {
        return projects.map((project) => ({
            id: project.project_id,

            project: {
                title: project.project_name,
                description: emptyValue(project.description, 'No description provided'),
            },

            project_search: `${project.project_name} ${project.description || ''}`,

            clients: {
                name: project.client_id ? `Client #${project.client_id}` : 'Not Assigned',
                email: '',
            },

            start_date: formatDate(project.start_date),
            end_date: formatDate(project.end_date),

            status: {
                defaultSelect: getStatusOption(project.status),
                options: STATUS_OPTIONS,
            },

            raw: project,
        }))
    }, [projects])

    /* ---------- COLUMNS ---------- */
    const columns = [
        // {
        //     accessorKey: 'id',
        //     header: ({ table }) => (
        //         <input
        //             type="checkbox"
        //             className="custom-table-checkbox"
        //             checked={table.getIsAllRowsSelected()}
        //             onChange={table.getToggleAllRowsSelectedHandler()}
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <input
        //             type="checkbox"
        //             className="custom-table-checkbox"
        //             checked={row.getIsSelected()}
        //             onChange={row.getIsSelected()}
        //         />
        //     ),
        //     meta: { headerClassName: 'width-30' },
        // },
        
        // Add a hidden column in columns
        {
            accessorKey: 'project_search',
            enableSorting: false,
            enableColumnFilter: true,
            enableGlobalFilter: true,
            header: () => null,
            cell: () => null,
        }
        ,
        {
            accessorKey: 'project',
            header: 'Project',
            cell: ({ getValue, row }) => {
                const data = getValue()
                return (
                    <div>
                        <a
                            className="fw-semibold text-truncate-1-line"
                            onClick={() => navigate(`/projects/view/${row.original.id}`)}
                            style={{ cursor: 'pointer', color: 'inherit' }}
                        >
                            {emptyValue(data.title)}
                        </a>
                        <p className="fs-12 text-muted mt-1 text-truncate-2-line">
                            {emptyValue(data.description)}
                        </p>
                    </div>
                )
            },
        },

        {
            accessorKey: 'clients',
            header: 'Clients',
            cell: ({ getValue }) => <span>{emptyValue(getValue().name)}</span>,
        },

        {
            accessorKey: 'start_date',
            header: 'Start Date',
        },

        {
            accessorKey: 'end_date',
            header: 'End Date',
        },

        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const cellData = info.getValue()
                return (
                    <StatusTableCell
                        options={cellData.options}
                        defaultSelect={cellData.defaultSelect}
                        row={info.row.original}
                        onStatusChange={handleStatusChange}
                    />
                )
            },
        },

        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="hstack gap-2 justify-content-end">
                    {/* 👁 View */}
                    <span
                        className="avatar-text avatar-md"
                        title="View Project"
                        onClick={() => navigate(`/projects/view/${row.original.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <FiEye />
                    </span>

                    {/* ✏️ Edit */}
                    <span
                        className="avatar-text avatar-md"
                        title="Edit Project"
                        onClick={() => navigate(`/projects/edit/${row.original.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <FiEdit3 />
                    </span>

                    {/* ⋮ More Actions */}
                    {/* <Dropdown
                dropdownItems={[
                    {
                        label: 'View',
                        icon: <FiEye />,
                        onClick: () =>
                            navigate(`/projects/view/${row.original.id}`),
                    },
                    {
                        label: 'Edit',
                        icon: <FiEdit3 />,
                        onClick: () =>
                            navigate(`/projects/edit/${row.original.id}`),
                    },
                    ...actions, // keep existing actions
                ]}
                triggerIcon={<FiMoreHorizontal />}
                triggerClassName="avatar-md"
                triggerPosition="0,21"
            /> */}
                </div>
            ),
            meta: { headerClassName: 'text-end' },
        }

    ]

    return (
        <Table
            data={tableData}
            columns={columns}
            isLoading={loading}
            emptyMessage="No projects found"
        />
    )
}

export default ProjectTable