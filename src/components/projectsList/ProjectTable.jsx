import React, { useEffect, useMemo, useState } from 'react'
import Table from '@/components/shared/table/Table'
import { FiEye, FiEdit3 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../loader'

const TableCell = ({ value, onChange, disabled }) => {
  return (
    <select
      value={value.status}
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
      disabled={disabled}
    >
      <option value="planning">Planning</option>
      <option value="in_progress">In Progress</option>
      <option value="on_hold">On Hold</option>
      <option value="finished">Completed</option>
    </select>
  )
}

const ProjectTable = ({ statusFilter, projects, setProjects }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  /* -------- FETCH -------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('https://api-0ggv.onrender.com/api/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        const result = await res.json()

        if (result.success) {
          const mapped = result.data.map(p => ({
            id: p.project_id,

            project: {
              name: p.project_name,
              description: p.description,
            },

            client: {
              name: p.client_id ? `Client #${p.client_id}` : "Not Assigned",
              img: null,
            },

            start: p.start_date
              ? new Date(p.start_date).toLocaleDateString()
              : "—",

            end: p.end_date
              ? new Date(p.end_date).toLocaleDateString()
              : "—",

            status: {
              status: p.status,
            },
          }))

          setProjects(mapped)
        }
      } catch {
        toast.error("Failed to fetch projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  /* -------- FILTER -------- */
  const filteredProjects = useMemo(() => {
    if (statusFilter === "all") return projects

    return projects.filter(p => p.status?.status === statusFilter)
  }, [projects, statusFilter])

  /* -------- STATUS UPDATE -------- */
  const handleStatusUpdate = async (id, newStatus, currentStatus) => {
    if (!window.confirm(`Change status from "${currentStatus}" to "${newStatus}"?`)) return

    try {
      setUpdatingStatusId(id)

      const res = await fetch(
        `https://api-0ggv.onrender.com/api/projects/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!res.ok) throw new Error()

      toast.success("Status updated")

      setProjects(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: { status: newStatus } }
            : p
        )
      )
    } catch {
      toast.error("Failed to update")
    } finally {
      setUpdatingStatusId(null)
    }
  }

  /* -------- COLUMNS -------- */
  const columns = [
    {
      accessorKey: 'project',
      header: 'Project',
      cell: (info) => {
        const p = info.getValue()
        const id = info.row.original.id

        return (
          <div>
            <div
              className="fw-semibold cursor-pointer"
              onClick={() => navigate(`/projects/view/${id}`)}
            >
              {p.name}
            </div>

            <div className="text-muted small">
              {p.description || "No description"}
            </div>
          </div>
        )
      }
    },

    {
      accessorKey: 'client',
      header: 'Client',
      cell: (info) => {
        const c = info.getValue()

        return (
          <div className="hstack gap-2">
            <div className="avatar-text avatar-md">
              {c?.name?.charAt(0)}
            </div>
            {c?.name}
          </div>
        )
      }
    },

    { accessorKey: 'start', header: 'Start Date' },
    { accessorKey: 'end', header: 'End Date' },

    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const row = info.row.original
        const isLoading = updatingStatusId === row.id

        return isLoading ? (
          <div className="spinner-border spinner-border-sm" />
        ) : (
          <TableCell
            value={row.status}
            onChange={(value) =>
              handleStatusUpdate(row.id, value, row.status.status)
            }
          />
        )
      }
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <div className="hstack gap-2 justify-content-center">
            <FiEye
              className="cursor-pointer"
              onClick={() => navigate(`/projects/view/${id}`)}
            />
            <FiEdit3
              className="cursor-pointer"
              onClick={() => navigate(`/projects/edit/${id}`)}
            />
          </div>
        )
      }
    }
  ]

  if (loading) return <Loader />

  return <Table data={filteredProjects} columns={columns} />
}

export default ProjectTable