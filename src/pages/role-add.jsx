import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import RolesCreateHeader from '@/components/Roles/RolesCreateHeader'
import RolesCreateContent from '@/components/Roles/RolesCreateContent'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import { toast } from 'react-toastify'
import Footer from '@/components/shared/Footer'

/* ============================
   VIEW SCOPES CONFIG
============================ */
const VIEW_SCOPES = {
    clients: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
    projects: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
    tasks: ['all', 'agency', 'department', 'team', 'assigned', 'own', 'client'],
    teams: ['all', 'agency', 'department', 'team', 'own'],
    departments: ['all', 'agency', 'department', 'team', 'own'],
}

/* ============================
   PERMISSION CONFIG
============================ */
export const permissionPages = [
    { key: 'dashboard', label: 'Dashboard', actions: ['view'] },
    { key: 'users', label: 'Users', actions: ['view', 'create', 'edit', 'delete'] },
    {
        key: 'clients',
        label: 'Clients',
        actions: ['view', 'create', 'edit', 'delete', 'assign'],
        viewScopes: VIEW_SCOPES.clients,
    },
    {
        key: 'projects',
        label: 'Projects',
        actions: ['view', 'create', 'edit', 'delete'],
        viewScopes: VIEW_SCOPES.projects,
    },
    {
        key: 'tasks',
        label: 'Tasks',
        actions: ['view', 'create', 'edit', 'delete', 'assign'],
        viewScopes: VIEW_SCOPES.tasks,
    },
    {
        key: 'teams',
        label: 'Teams',
        actions: ['view', 'create', 'edit', 'delete'],
        viewScopes: VIEW_SCOPES.teams,
    },
    {
        key: 'departments',
        label: 'Departments',
        actions: ['view', 'create', 'edit', 'delete'],
        viewScopes: VIEW_SCOPES.departments,
    },
    { key: 'roles', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
]

/* ============================
   COMPONENT
============================ */
const RolesCreate = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        role_name: '',
        role_description: '',
        is_system_role: false,
        permissions: {},
    })

    /* ============================
       PAGE PERMISSION CHECK
    ============================ */
    useEffect(() => {
        verifyPagePermission('roles', 'create', navigate)
    }, [])

    /* ============================
       TOGGLE ACTION
    ============================ */
    const toggleActionPermission = (page, action) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [page]: {
                    ...prev.permissions?.[page],
                    [action]: !prev.permissions?.[page]?.[action],
                },
            },
        }))
    }

    /* ============================
       VIEW SCOPE
    ============================ */
    const handleViewScopeChange = (page, scope) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [page]: {
                    ...prev.permissions?.[page],
                    view: scope,
                },
            },
        }))
    }

    /* ============================
       SUBMIT
    ============================ */
    const handleSubmit = async () => {
        if (!formData.role_name.trim()) {
            toast.error('Role Name is required')
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem('token')

            const res = await fetch('https://api-0ggv.onrender.com/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.message || 'Failed to create role')
                return
            }
            navigate(`/roles/list`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <PageHeader>
                <RolesCreateHeader
                    loading={loading}
                    onCreate={handleSubmit}
                />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <RolesCreateContent
                        formData={formData}
                        permissionPages={permissionPages}
                        onToggleAction={toggleActionPermission}
                        onViewScopeChange={handleViewScopeChange}
                        onChange={setFormData}
                    />
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default RolesCreate
