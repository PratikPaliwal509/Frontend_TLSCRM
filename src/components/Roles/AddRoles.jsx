import React, { useEffect, useState } from 'react';
import Footer from '@/components/shared/Footer';
import PageHeaderSetting from '@/components/shared/pageHeader/PageHeaderSetting';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import { verifyPagePermission } from '@/utils/verifyPagePermission';    
const permissionPages = [
    { key: 'dashboard', label: 'Dashboard', actions: ['view'] },
    { key: 'users', label: 'Users', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'projects', label: 'Projects', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'roles', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
    { key: "tasks", label: "Tasks", actions: ["view", "create", "edit", "delete", "assign"] },
    { key: "clients", label: "Clients", actions: ["view", "create", "edit", "delete", "assign"] }
];

const AddRoleForm = () => {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role_name: '',
        role_description: '',
        is_system_role: false,
        permissions: {
    roles: [],
    tasks: [],
    users: [],
    clients: [],
    projects: [],
    dashboard: []
  }
    });

     useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('roles', 'create', navigate);
        };  

        checkPermission();
      }, []);

    
    // Toggle permission checkbox
    // const handlePermissionChange = (page, action) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         permissions: {
    //             ...prev.permissions,
    //             [page]: {
    //                 ...prev.permissions[page],
    //                 [action]: !prev.permissions?.[page]?.[action]
    //             }
    //         }
    //     }));
    // };
const handlePermissionChange = (page, action) => {
  setFormData(prev => {
    const currentActions = prev.permissions?.[page] || [];

    const updatedActions = currentActions.includes(action)
      ? currentActions.filter(a => a !== action) // remove if exists
      : [...currentActions, action];            // add if not exists

    return {
      ...prev,
      permissions: {
        ...prev.permissions,
        [page]: updatedActions
      }
    };
  });
};



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role_name.trim()) {
            alert('Role Name is required!');
            return;
        }

        const payload = { ...formData };

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Role added successfully!');
                setFormData({
                    role_name: '',
                    role_description: '',
                    is_system_role: false,
                    permissions: {}
                });
            } else {
                alert(data.message || 'Failed to add role.');
            }
        } catch (error) {
            alert('Error adding role: ' + error.message);
        }
    };
    

    return (
        <div className="content-area">
            <PerfectScrollbar>
                <PageHeaderSetting />

                <div className="content-area-body">
                    <div className="card mb-0">
                        <div className="card-body">
                            <div className="mb-5">
                                <h4 className="fw-bold">Add Role</h4>
                                <div className="fs-12 text-muted">
                                    Create a new role and assign permissions
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* ROLE NAME */}
                                <div className="mb-3">
                                    <label className="form-label">Role Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter role name"
                                        value={formData.role_name}
                                        onChange={e =>
                                            setFormData({ ...formData, role_name: e.target.value })
                                        }
                                        required
                                    />
                                    <small className="text-muted">
                                        Role Name [Ex: Admin, Manager, Viewer]
                                    </small>
                                </div>

                                {/* ROLE DESCRIPTION */}
                                <div className="mb-3">
                                    <label className="form-label">Role Description</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter role description"
                                        value={formData.role_description}
                                        onChange={e =>
                                            setFormData({ ...formData, role_description: e.target.value })
                                        }
                                        rows={3}
                                    />
                                    <small className="text-muted">
                                        Short description of the role
                                    </small>
                                </div>

                                <hr className="my-5" />

                                {/* PERMISSIONS */}
                                <div className="mb-4">
                                    <h4 className="fw-bold">Permissions</h4>
                                    <div className="fs-12 text-muted">
                                        Select permissions for this role
                                    </div>
                                </div>

                                {/* {permissionPages.map(page => (
                                    <div key={page.key} className="mb-4">
                                        <div className="fw-semibold mb-2">{page.label}</div>
                                        <div className="d-flex flex-wrap gap-4">
                                            {page.actions.map(action => (
                                                <div className="form-check" key={action}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`${page.key}-${action}`}
                                                        checked={formData.permissions?.[page.key]?.[action] || false}
                                                        onChange={() => handlePermissionChange(page.key, action)}
                                                    />
                                                    <label
                                                        className="form-check-label text-capitalize"
                                                        htmlFor={`${page.key}-${action}`}
                                                    >
                                                        {action}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))} */}
{permissionPages.map(page => (
  <div key={page.key} className="mb-4">
    <div className="fw-semibold mb-2">{page.label}</div>
    <div className="d-flex flex-wrap gap-4">
      {page.actions.map(action => (
        <div className="form-check" key={action}>
          <input
  className="form-check-input"
  type="checkbox"
  id={`${page.key}-${action}`}
  checked={formData.permissions?.[page.key]?.includes(action) || false} // ✅ use includes
  onChange={() => handlePermissionChange(page.key, action)}
/>

          <label
            className="form-check-label text-capitalize"
            htmlFor={`${page.key}-${action}`}
          >
            {action}
          </label>
        </div>
      ))}
    </div>
  </div>
))}

                                <hr className="my-5" />


                                {/* Need to check system role is always true */}
                                {/* SYSTEM ROLE */}
                                {/* <div className="form-check form-switch mb-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={formData.is_system_role}
                                        onChange={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                is_system_role: !prev.is_system_role
                                            }))
                                        }
                                        id="systemRoleSwitch"
                                    />
                                    <label className="form-check-label" htmlFor="systemRoleSwitch">
                                        Mark as System Role
                                    </label>
                                    <div className="fs-12 text-muted">
                                        System roles cannot be deleted
                                    </div>
                                </div> */}

                                {/* SUBMIT */}
                                <div className="text-end">
                                    <button type="submit" className="btn btn-primary">
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
