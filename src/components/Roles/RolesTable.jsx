import React, { useEffect, useState, memo } from 'react'
import Table from '@/components/shared/table/Table'
import Dropdown from '@/components/shared/Dropdown'
import {
    FiEye,
    FiEdit3,
    FiTrash2,
    FiMoreHorizontal,
    FiShield,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { canUser } from '@/utils/canUser'
import { toast } from 'react-toastify';
/* ---------------- TYPE BADGE ---------------- */

const RoleTypeBadge = memo(({ isSystem }) =>
    isSystem ? (
        <span className="badge bg-success">System</span>
    ) : (
        <span className="badge bg-secondary">Custom</span>
    )
)

/* ---------------- MAIN ---------------- */

const RolesTable = () => {
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')

            const res = await fetch('http://localhost:5000/api/roles', {
                headers: { Authorization: `Bearer ${token}` },
            })

            const data = await res.json()
            if (data.success) setRoles(data.data || [])
        } catch (err) {
            console.error('Fetch roles failed', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteRole = async role => {
        try {
            if (!canUser('roles', 'delete')) {
                toast.error('You do not have permission to delete roles.');
                return
            }

            if (!window.confirm('Delete this role?')) return

            const token = localStorage.getItem('token')

            const response = await fetch(`http://localhost:5000/api/roles/${role.role_id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })

            const data = await response.json();

            if (!response.ok) {
                // Handle backend errors
                toast.error(data?.message || 'Failed to delete role. Please try again.');
                return;
            }
            // Update UI and show success
            setRoles(prev => prev.filter(r => r.role_id !== role.role_id));
            toast.success(`Role "${role.role_name}" deleted successfully!`);

        } catch (err) {
            console.error('Delete role error:', err);
            toast.error(err?.message || 'Something went wrong while deleting the role.');
        }
    }
    const columns = [
        {
            accessorKey: 'role_name',
            header: () => 'Role',
            cell: ({ row }) => {
                const roleId = row.original.role_id
                return (

                    <div className="hstack gap-2">
                        <div className="avatar-text avatar-sm bg-primary-soft text-primary">
                            <FiShield />
                        </div>
                        <span className="cursor-pointer fw-semibold" onClick={() =>
              navigate(`/roles/view/${row.original.role_id}`, {
                state: { role: row.original },
              })
            }>
                            {row.original.role_name}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: 'role_description',
            header: () => 'Description',
            cell: info => (
                <span className="text-muted">
                    {info.getValue() || '—'}
                </span>
            ),
        },
        {
            accessorKey: 'is_system_role',
            header: () => 'Type',
            cell: info => (
                <RoleTypeBadge isSystem={info.getValue()} />
            ),
        },
        {
            accessorKey: 'actions',
            header: () => 'Actions',
            cell: ({ row }) => (
                <div className="hstack gap-2 justify-content-end">
                    <div
                        className="avatar-text avatar-md"
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                            navigate(`/roles/view/${row.original.role_id}`, {
                                state: { role: row.original },
                            })
                        }
                    >
                        <FiEye />
                    </div>

                    <Dropdown
                        triggerIcon={<FiMoreHorizontal />}
                        triggerClassNaclassName="avatar-md"
                        triggerPosition="0,21"
                        dropdownItems={[
                            canUser('roles', 'edit') && {
                                label: 'Edit',
                                icon: <FiEdit3 />,
                                onClick: () =>
                                    navigate(`/roles/edit/${row.original.role_id}`, {
                                        state: { role: row.original },
                                    }),
                            },
                            canUser('roles', 'delete') && {
                                label: 'Delete',
                                icon: <FiTrash2 />,
                                onClick: () => handleDeleteRole(row.original),
                            },
                        ].filter(Boolean)}
                    />
                </div>
            ),
            meta: {
                headerClassName: 'text-end',
            },
        },
    ]

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        )
    }

    return <Table data={roles} columns={columns} />
}

export default RolesTable
