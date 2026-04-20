import React, { useEffect, useState } from 'react';
import Footer from '@/components/shared/Footer';
import PageHeaderSetting from '@/components/shared/pageHeader/PageHeaderSetting';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import { verifyPagePermission } from '@/utils/verifyPagePermission';

/* ============================
   VIEW SCOPES CONFIG
============================ */
const VIEW_SCOPES = {
    clients: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
    projects: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
    teams: ['all', 'agency', 'department', 'team', 'own'],
    departments: ['all', 'agency', 'department', 'team', 'own'],
    tasks: ['all', 'department', 'team', 'assigned', 'own']
};

/* ============================
   PERMISSION CONFIG
============================ */
const permissionPages = [
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
    // { key: 'tasks', label: 'Tasks', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
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
];

/* ============================
   COMPONENT
============================ */
const AddRoleForm = () => {
    const navigate = useNavigate();

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
        verifyPagePermission('roles', 'create', navigate);
    }, []);

    /* ============================
       TOGGLE BOOLEAN ACTION
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
        }));
    };

    /* ============================
       HANDLE VIEW SCOPE
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
        }));
    };

    /* ============================
       SUBMIT
    ============================ */
    const handleSubmit = async e => {
        e.preventDefault();

        if (!formData.role_name.trim()) {
            alert('Role Name is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const res = await fetch('https://api-0ggv.onrender.com/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Failed to create role');
                return;
            }

            alert('Role created successfully');
            navigate('/settings/roles');
        } catch (err) {
            alert(err.message);
        }
    };

    /* ============================
       RENDER
    ============================ */
    return (
        <div className="content-area">
            <PerfectScrollbar>
                <PageHeaderSetting />

                <div className="content-area-body">
                    <div className="card mb-0">
                        <div className="card-body">
                            <h4 className="fw-bold mb-1">Add Role</h4>
                            <p className="text-muted fs-12 mb-4">
                                Create a role and assign scoped permissions
                            </p>

                            <form onSubmit={handleSubmit}>
                                {/* ROLE NAME */}
                                <div className="mb-3">
                                    <label className="form-label">Role Name</label>
                                    <input
                                        className="form-control"
                                        value={formData.role_name}
                                        onChange={e =>
                                            setFormData({ ...formData, role_name: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                {/* ROLE DESCRIPTION */}
                                <div className="mb-4">
                                    <label className="form-label">Role Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={formData.role_description}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                role_description: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <hr className="my-4" />

                                {/* PERMISSIONS */}
                                <h5 className="fw-bold mb-3">Permissions</h5>

                                {permissionPages.map(page => (
                                    <div
                                        key={page.key}
                                        className="border rounded p-3 mb-4"
                                    >
                                        <div className="fw-semibold mb-2">
                                            {page.label}
                                        </div>

                                        {/* ACTION CHECKBOXES */}
                                        <div className="d-flex flex-wrap gap-4 mb-2">
                                            {page.actions.map(action => {
                                                if (action === 'view' && page.viewScopes) return null;

                                                return (
                                                    <div
                                                        className="form-check"
                                                        key={action}
                                                    >
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={
                                                                !!formData.permissions?.[
                                                                page.key
                                                                ]?.[action]
                                                            }
                                                            onChange={() =>
                                                                toggleActionPermission(
                                                                    page.key,
                                                                    action
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label text-capitalize">
                                                            {action}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* VIEW SCOPE */}
                                        {page.viewScopes && (
                                            <div className="mt-2">
                                                <label className="form-label fs-12 text-muted">
                                                    View Access Scope
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={
                                                        formData.permissions?.[page.key]?.view || ''
                                                    }
                                                    onChange={e =>
                                                        handleViewScopeChange(
                                                            page.key,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select scope
                                                    </option>
                                                    {page.viewScopes.map(scope => (
                                                        <option
                                                            key={scope}
                                                            value={scope}
                                                        >
                                                            {scope.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* SUBMIT */}
                                <div className="text-end">
                                    <button className="btn btn-primary">
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <Footer />
            </PerfectScrollbar>
        </div>
    );
};

export default AddRoleForm;
