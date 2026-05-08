import React, { useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table'
import { FiEdit3, FiEye, FiMoreHorizontal } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import { useNavigate } from 'react-router-dom'
import Loader from '../loader'
import { toast } from 'react-toastify'

/* ---------- Status Dropdown ---------- */
const TableCell = ({ value, onChange, disabled }) => {
    console.log("TableCell value:", value)
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="form-select"
            disabled={disabled}
        >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
    )
}

const UsersListTable = ({ users, setUsers }) => {
    const [loading, setLoading] = useState(true)
    const [updatingStatusId, setUpdatingStatusId] = useState(null)

    const navigate = useNavigate()

    /* ---------- FETCH USERS ---------- */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token')

                const res = await fetch('https://api-0ggv.onrender.com/api/users/user', {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const result = await res.json()
                console.log(result.data)
                if (result.data) {

                    const mapped = result.data.map(user => ({
                        id: user.user_id,

                        user: {
                            name: `${user.first_name} ${user.last_name}`,
                        },

                        email: user.email,
                        phone: user.mobile || "-",

                        role: user.role?.role_name,
                        department: user.department?.department_name || "-",

                        date: user.date_of_joining
                            ? new Date(user.date_of_joining).toLocaleDateString("en-GB").replace(/\//g, "-")
                            : "-",

                        status: user.is_active ? "active" : "inactive"

                    }))
                    console.log(mapped)
                    setUsers(mapped)
                }

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    /* ---------- STATUS UPDATE ---------- */
   const handleStatusUpdate = async (userId, newStatus) => {
    const confirmUpdate = window.confirm(
        `Change status to "${newStatus}"?`
    )
    if (!confirmUpdate) return

    try {
        setUpdatingStatusId(userId)

        const token = localStorage.getItem('token')

        const res = await fetch(
            `https://api-0ggv.onrender.com/api/users/${userId}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    is_active: newStatus === "active"
                })
            }
        )

        const data = await res.json()

        // ❌ Handle HTTP errors
        if (!res.ok) {
            throw new Error(data.message || "Failed to update status")
        }

        // ✅ Success
        toast.success(data.message || "Status updated!")

        // 🔥 IMPORTANT: fix structure (your bug here)
        setUsers(prev =>
            prev.map(u =>
                u.id === userId
                    ? {
                        ...u,
                        status: {
                            ...u.status,
                            status: newStatus
                        }
                    }
                    : u
            )
        )

    } catch (err) {
        console.error("Status update error:", err)

        toast.error(err.message || "Something went wrong")
    } finally {
        setUpdatingStatusId(null)
    }
}
    /* ---------- TABLE COLUMNS ---------- */
    const columns = [
        {
            accessorKey: 'user',
            header: () => 'User',
            cell: (info) => {
                const user = info.getValue()
                const id = info.row.original.id

                return (
                    <span
                        className="cursor-pointer fw-semibold"
                        onClick={() => navigate(`/user/view/${id}`)}
                    >
                        {user.name}
                    </span>
                )
            }
        },

        {
            accessorKey: 'email',
            header: () => 'Email',
        },

        {
            accessorKey: 'phone',
            header: () => 'Phone',
        },

        {
            accessorKey: 'role',
            header: () => 'Role',
        },

        {
            accessorKey: 'department',
            header: () => 'Department',
        },

        {
            accessorKey: 'date',
            header: () => 'Joining Date',
        },

        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => {
                console.log("info.row.original:", info.row.original.status)
                const row = info.row.original
                const isLoading = updatingStatusId === row.id

                return (
                    <div>
                        {!isLoading ? (
                            <TableCell
                                value={row.status}
                                onChange={(val) => handleStatusUpdate(row.id, val)}
                            />
                        ) : (
                            <div className="spinner-border spinner-border-sm" />
                        )}
                    </div>
                )
            }
        },

        {
            accessorKey: 'actions',
            header: () => 'Actions',
            cell: ({ row }) => {
                const id = row.original.id

                const actions = [
                    {
                        label: "Edit",
                        icon: <FiEdit3 />,
                        onClick: () => navigate(`/user/edit/${id}`)
                    }
                ]

                return (
                    <div className="hstack gap-2 justify-content-end">
                        <FiEye
                            className="cursor-pointer"
                            onClick={() => navigate(`/user/view/${id}`)}
                        />

                        <Dropdown
                            dropdownItems={actions}
                            triggerIcon={<FiMoreHorizontal />}
                        />
                    </div>
                )
            }
        }
    ]

    if (loading) return <Loader />

    return <Table data={users} columns={columns} />
}

export default UsersListTable