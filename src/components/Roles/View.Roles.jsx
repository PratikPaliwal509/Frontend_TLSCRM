import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/shared/Footer";
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting";
import PerfectScrollbar from "react-perfect-scrollbar";
import { verifyPagePermission } from '@/utils/verifyPagePermission';
import { useEffect } from "react";

const RoleViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ role coming ONLY from previous page
  const role = location.state?.role;
  const permissionPages = [
    { key: "dashboard", label: "Dashboard", actions: ["view"] },
    { key: "users", label: "Users", actions: ["view", "create", "edit", "delete"] },
    { key: "projects", label: "Projects", actions: ["view", "create", "edit", "delete"] },
    { key: "roles", label: "Roles", actions: ["view", "create", "edit", "delete"] },
    { key: 'teams', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'notes', label: 'Notes', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'departments', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
    { key: "tasks", label: "Tasks", actions: ["view", "create", "edit", "delete", "assign"] },
    { key: "clients", label: "Clients", actions: ["view", "create", "edit", "delete", "assign"] }
  ];

  useEffect(() => {
    const checkPermission = async () => {
      await verifyPagePermission('roles', 'view', navigate);
    };

    checkPermission();
  }, []);
  // 🚫 If user refreshes or opens URL directly
  if (!role) {
    return (
      <div className="text-center text-muted p-5">
        No role data available.
        <br />
        <button
          className="btn btn-sm btn-primary mt-3"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="content-area">
      <PerfectScrollbar>
        <PageHeaderSetting />

        <div className="content-area-body">
          <div className="card mb-0">
            <div className="card-body">

              {/* HEADER */}
              <div className="mb-5">
                <h4 className="fw-bold">View Role</h4>
                <div className="fs-12 text-muted">
                  Role details and permissions
                </div>
              </div>

              {/* ROLE NAME (INPUT-LIKE VIEW) */}
              <div className="form-group mb-4">
                <label className="form-label">Role Name</label>
                <div className="form-control bg-light">
                  {role.role_name || "-"}
                </div>
              </div>

              {/* ROLE DESCRIPTION (TEXTAREA-LIKE VIEW) */}
              <div className="form-group mb-5">
                <label className="form-label">Role Description</label>
                <div
                  className="form-control bg-light"
                  style={{ minHeight: "100px", whiteSpace: "pre-wrap" }}
                >
                  {role.role_description || "-"}
                </div>
              </div>

              <hr className="my-5" />

              {/* PERMISSIONS */}
              <div className="mb-4">
                <h4 className="fw-bold">Permissions</h4>
                <div className="fs-12 text-muted">
                  Permissions assigned to this role
                </div>
              </div>

              {permissionPages.map(page => (
                <div key={page.key} className="mb-4">
                  <div className="fw-semibold mb-2">{page.label}</div>

                  <div className="d-flex flex-wrap gap-4">
                    {page.actions.map(action => (
                      <div className="form-check" key={action}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            // ❌ "all" key shortcut
                            role?.permissions?.all === true ||

                            // ✅ array-based
                            (Array.isArray(role?.permissions?.[page.key]) &&
                              role.permissions[page.key].includes(action)) ||

                            // ✅ object-based (old form)
                            (role?.permissions?.[page.key] &&
                              typeof role.permissions[page.key] === 'object' &&
                              role.permissions[page.key][action] === true)
                          }
                          disabled
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
                  checked={role.is_system_role}
                  readOnly
                />
                <label className="form-check-label">System Role</label>
                <div className="fs-12 text-muted">
                  System roles cannot be deleted
                </div>
              </div>

              {/* BACK */}
              <div className="text-end">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(-1)}
                >
                  Back
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

export default RoleViewPage;
