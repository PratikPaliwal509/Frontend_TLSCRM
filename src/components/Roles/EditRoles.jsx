import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Footer from "@/components/shared/Footer";
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting";
import PerfectScrollbar from "react-perfect-scrollbar";
import { verifyPagePermission } from "@/utils/verifyPagePermission";

/* ============================
   VIEW SCOPES CONFIG
============================ */
const VIEW_SCOPES = {
  clients: ["all", "agency", "department", "team", "assigned", "own"],
  projects: ["all", "agency", "department", "team", "assigned", "own"],
  teams: ['all', 'agency', 'department', 'team', 'own'],
  departments: ['all', 'agency', 'department', 'team', 'own'],
};

/* ============================
   PERMISSION CONFIG
============================ */
const permissionPages = [
  { key: "dashboard", label: "Dashboard", actions: ["view"] },
  { key: "users", label: "Users", actions: ["view", "create", "edit", "delete"] },
  {
    key: "clients",
    label: "Clients",
    actions: ["view", "create", "edit", "delete", "assign"],
    viewScopes: VIEW_SCOPES.clients,
  },
  {
    key: "projects",
    label: "Projects",
    actions: ["view", "create", "edit", "delete"],
    viewScopes: VIEW_SCOPES.projects,
  },
  { key: "tasks", label: "Tasks", actions: ["view", "create", "edit", "delete", "assign"] },
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

  { key: "roles", label: "Roles", actions: ["view", "create", "edit", "delete"] },
];

const EditRoleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const role = location.state?.role;

  const [formData, setFormData] = useState({
    role_name: "",
    role_description: "",
    is_system_role: false,
    permissions: {},
  });

  /* ============================
     PAGE PERMISSION CHECK
  ============================ */
  useEffect(() => {
    verifyPagePermission("roles", "edit", navigate);
  }, []);

  /* ============================
     PREFILL ROLE
  ============================ */
  useEffect(() => {
    if (role) {
      setFormData({
        role_name: role.role_name || "",
        role_description: role.role_description || "",
        is_system_role: role.is_system_role || false,
        permissions: role.permissions || {},
      });
    }
  }, [role]);

  /* ============================
     SAFETY
  ============================ */
  if (!role) {
    return (
      <div className="text-center p-5 text-muted">
        No role data found.
        <br />
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  /* ============================
     HANDLERS
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
     UPDATE ROLE
  ============================ */
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/roles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      navigate(-1);
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

              {/* HEADER */}
              <div className="mb-5">
                <h4 className="fw-bold">Edit Role</h4>
                <div className="fs-12 text-muted">
                  Update role details and permissions
                </div>
              </div>

              {/* ROLE NAME */}
              <div className="mb-4">
                <label className="form-label">Role Name</label>
                <input
                  className="form-control"
                  value={formData.role_name}
                  onChange={e =>
                    setFormData({ ...formData, role_name: e.target.value })
                  }
                />
              </div>

              {/* ROLE DESCRIPTION */}
              <div className="mb-5">
                <label className="form-label">Role Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={formData.role_description}
                  onChange={e =>
                    setFormData({ ...formData, role_description: e.target.value })
                  }
                />
              </div>

              <hr className="my-5" />

              {/* PERMISSIONS */}
              <h5 className="fw-bold mb-4">Permissions</h5>

              {permissionPages.map(page => (
                <div key={page.key} className="border rounded p-3 mb-4">
                  <div className="fw-semibold mb-2">{page.label}</div>

                  {/* ACTIONS */}
                  <div className="d-flex flex-wrap gap-4 mb-2">
                    {page.actions.map(action => {
                      if (action === "view" && page.viewScopes) return null;

                      return (
                        <div className="form-check" key={action}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={
                              !!formData.permissions?.[page.key]?.[action]
                            }
                            onChange={() =>
                              toggleActionPermission(page.key, action)
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
                        value={formData.permissions?.[page.key]?.view || ""}
                        onChange={e =>
                          handleViewScopeChange(page.key, e.target.value)
                        }
                      >
                        <option value="">Select scope</option>
                        {page.viewScopes.map(scope => (
                          <option key={scope} value={scope}>
                            {scope.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}

              <hr className="my-5" />

              {/* SYSTEM ROLE */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.is_system_role}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      is_system_role: !formData.is_system_role,
                    })
                  }
                />
                <label className="form-check-label">
                  Mark as System Role
                </label>
                <div className="fs-12 text-muted">
                  System roles cannot be deleted
                </div>
              </div>

              {/* ACTIONS */}
              <div className="text-end">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Update Role
                </button>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </PerfectScrollbar>
    </div>
  );
};

export default EditRoleForm;
