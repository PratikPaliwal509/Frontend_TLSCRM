
import React, { useEffect, useMemo, useState, memo } from 'react'
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

/* ---------------- ACTIONS ---------------- */
const actions = [
    { label: "View", icon: <FiEye /> },
    { label: "Edit", icon: <FiEdit3 /> },
    // { label: "Print", icon: <FiPrinter /> },
    // { type: "divider" },
    // { label: "Archive", icon: <FiArchive /> },
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

/* ---------------- SELECT CELL ---------------- */
const TableCell = memo(({ options, defaultSelect }) => {
    const [selectedOption, setSelectedOption] = useState(defaultSelect || null)

    return (
        <SelectDropdown
            options={options}
            defaultSelect={defaultSelect}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
        />
    )
})

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const json = await res.json()
                setProjects(json?.data || [])
            } catch (error) {
                console.error('Fetch projects error', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    /* ---------- TABLE DATA ---------- */
    const tableData = useMemo(() => {
        return projects.map((project) => ({
            id: project.project_id,

            project: {
                title: project.project_name,
                description: emptyValue(project.description, 'No description provided'),
            },

            clients: {
                name: project.client_id ? `Client #${project.client_id}` : 'Not Assigned',
                email: '',
            },

            start_date: formatDate(project.start_date),
            end_date: formatDate(project.end_date),

            assigned: {
                defaultSelect: null,
                assigned: [],
            },

            status: {
                defaultSelect: STATUS_OPTIONS.find(
                    (s) => s.value === project.status
                ),
                status: STATUS_OPTIONS,
            },

            raw: project, // keep full object
        }))
    }, [projects])

    /* ---------- COLUMNS ---------- */
    const columns = [
        {
            accessorKey: 'id',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            meta: { headerClassName: 'width-30' },
        },

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
            cell: ({ getValue }) => (
                <div>
                    <span>{emptyValue(getValue().name)}</span>
                </div>
            ),
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
            cell: (info) => (
                <TableCell
                    options={info.getValue().status}
                    defaultSelect={info.getValue().defaultSelect}
                />
            ),
        },

        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="hstack gap-2 justify-content-end">
                    <span
                        className="avatar-text avatar-md"
                        onClick={() => navigate(`/projects/view/${row.original.id}`)}
                    >
                        <FiEye />
                    </span>
                    <Dropdown
                        dropdownItems={actions}
                        triggerIcon={<FiMoreHorizontal />}
                        triggerClassName="avatar-md"
                        triggerPosition="0,21"
                    />
                </div>
            ),
            meta: { headerClassName: 'text-end' },
        },
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
