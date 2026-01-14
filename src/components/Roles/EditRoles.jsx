import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Footer from "@/components/shared/Footer";
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting";
import PerfectScrollbar from "react-perfect-scrollbar";

const permissionPages = [
  { key: "dashboard", label: "Dashboard", actions: ["view"] },
  { key: "users", label: "Users", actions: ["view", "create", "edit", "delete"] },
  { key: "projects", label: "Projects", actions: ["view", "create", "edit", "delete"] },
  { key: "roles", label: "Roles", actions: ["view", "create", "edit", "delete"] },
  { key: "tasks", label: "Tasks", actions: ["view", "create", "edit", "delete", "assign"] },
  { key: "clients", label: "Clients", actions: ["view", "create", "edit", "delete", "assign"] }
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
    permissions: {}
  });

  // ✅ Prefill from previous page
  useEffect(() => {
    if (role) {
      setFormData({
        role_name: role.role_name || "",
        role_description: role.role_description || "",
        is_system_role: role.is_system_role || false,
        permissions: role.permissions || {}
      });
    }
  }, [role]);

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

  const handlePermissionChange = (page, action) => {
    setFormData(prev => {
      const existingActions = prev.permissions?.[page] || [];

      const updatedActions = existingActions.includes(action)
        ? existingActions.filter(a => a !== action) // remove
        : [...existingActions, action]; // add

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [page]: updatedActions
        }
      };
    });
  };


  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const payload = {
      role_name: formData.role_name,
      role_description: formData.role_description,
      permissions: formData.permissions,
      is_system_role: formData.is_system_role
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/roles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (data.success) {
        navigate(-1);
      } else {
        console.error("Update failed:", data);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

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
              <div className="form-group mb-4">
                <label className="form-label">Role Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.role_name}
                  onChange={(e) =>
                    setFormData({ ...formData, role_name: e.target.value })
                  }
                />
              </div>

              {/* ROLE DESCRIPTION */}
              <div className="form-group mb-5">
                <label className="form-label">Role Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={formData.role_description}
                  onChange={(e) =>
                    setFormData({ ...formData, role_description: e.target.value })
                  }
                />
              </div>

              <hr className="my-5" />

              {/* PERMISSIONS */}
              <div className="mb-4">
                <h4 className="fw-bold">Permissions</h4>
                <div className="fs-12 text-muted">
                  Update permissions for this role
                </div>
              </div>

              {permissionPages.map(page => (
                <div key={page.key} className="mb-4">
                  <div className="fw-semibold mb-2">{page.label}</div>

                  <div className="d-flex flex-wrap gap-4">
                    {page.actions.map(action => (
                      <div className="form-check" key={action}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.permissions?.[page.key]?.includes(action) || false}
                          onChange={() => handlePermissionChange(page.key, action)}
                        />


                        <label className="form-check-label text-capitalize">
                          {action}
                        </label>
                      </div>
                    ))}
                  </div>
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
                      is_system_role: !formData.is_system_role
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
                  className="btn mt-2 btn-primary"
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
