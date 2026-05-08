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

    { key: 'applications', label: 'Applications', actions: ['view'] },

    {
        key: 'tasks',
        label: 'Tasks',
        actions: ['view', 'create', 'edit', 'delete', 'assign'],
        viewScopes: VIEW_SCOPES.tasks,
    },

    {
        key: 'notes',
        label: 'Notes',
        actions: ['view', 'create', 'edit', 'delete'],
    },

    {
        key: 'timelogs',
        label: 'Timelogs',
        actions: ['view', 'create', 'edit', 'delete'],
    },

    {
        key: 'storage',
        label: 'Storage',
        actions: ['view'],
    },

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

    {
        key: 'users',
        label: 'Users',
        actions: ['view', 'create', 'edit', 'delete'],
    },

    {
        key: 'roles',
        label: 'Roles',
        actions: ['view', 'create', 'edit', 'delete'],
    },

    {
        key: 'settings',
        label: 'Settings',
        actions: ['view'],
    },

    {
        key: 'help',
        label: 'Help Center',
        actions: ['view'],
    },

    {
        key: 'authentication',
        label: 'Authentication',
        actions: ['view'],
    },
];

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
    });

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
        setFormData(prev => {

            // 🔒 BLOCK AUTHENTICATION EDIT
            if (page === "authentication") return prev;

            const currentValue = prev.permissions?.[page]?.[action];
            const newValue = !currentValue;

            // 🔥 APPLICATION DEPENDENCY
            if (page === "applications" && action === "view") {

                if (!newValue) {
                    const { tasks, notes, timelogs, storage, ...rest } = prev.permissions;

                    return {
                        ...prev,
                        permissions: {
                            ...rest,
                            applications: { view: false },
                        },
                    };
                }

                return {
                    ...prev,
                    permissions: {
                        ...prev.permissions,
                        applications: { view: true },
                    },
                };
            }

            // ✅ NORMAL TOGGLE
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [page]: {
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        assign: false,
                        ...prev.permissions?.[page],
                        [action]: newValue,
                    },
                },
            };
        });
    };

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
            <Footer />
        </>
    )
}

export default RolesCreate
