import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/shared/Footer";
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting";
import PerfectScrollbar from "react-perfect-scrollbar";
import { verifyPagePermission } from "@/utils/verifyPagePermission";

/* ============================
   VIEW SCOPES CONFIG
============================ */
const VIEW_SCOPES = {
  clients: ["all", "agency", "department", "team", "assigned", "own"],
  projects: ["all", "agency", "department", "team", "assigned"],
  tasks: ['all', 'agency', 'department', 'team', 'assigned', 'own'],
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
  { key: "roles", label: "Roles", actions: ["view", "create", "edit", "delete"] },
];

const RoleViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Role from previous page
  const role = location.state?.role;

  /* ============================
     PAGE ACCESS CHECK
  ============================ */
  useEffect(() => {
    verifyPagePermission("roles", "view", navigate);
  }, []);

  /* ============================
     SAFETY CHECK
  ============================ */
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

  /* ============================
     HELPERS
  ============================ */
  const hasAction = (page, action) =>
    !!role?.permissions?.[page]?.[action];

  const getViewScope = page =>
    role?.permissions?.[page]?.view || "-";

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
                <h4 className="fw-bold">View Role</h4>
                <div className="fs-12 text-muted">
                  Role details and permissions
                </div>
              </div>

              {/* ROLE NAME */}
              <div className="mb-4">
                <label className="form-label">Role Name</label>
                <div className="form-control bg-light">
                  {role.role_name}
                </div>
              </div>

              {/* ROLE DESCRIPTION */}
              <div className="mb-5">
                <label className="form-label">Role Description</label>
                <div
                  className="form-control bg-light"
                  style={{ minHeight: "90px", whiteSpace: "pre-wrap" }}
                >
                  {role.role_description || "-"}
                </div>
              </div>

              <hr className="my-5" />

              {/* PERMISSIONS */}
              <h5 className="fw-bold mb-4">Permissions</h5>

              {permissionPages.map(page => (
                <div
                  key={page.key}
                  className="border rounded p-3 mb-4"
                >
                  <div className="fw-semibold mb-2">
                    {page.label}
                  </div>

                  {/* ACTIONS */}
                  <div className="d-flex flex-wrap gap-4 mb-2">
                    {page.actions.map(action => {
                      if (action === "view" && page.viewScopes) return null;

                      return (
                        <div className="form-check" key={action}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={hasAction(page.key, action)}
                            disabled
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
                      <div className="form-control bg-light">
                        {getViewScope(page.key).toUpperCase()}
                      </div>
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
                  checked={role.is_system_role}
                  readOnly
                />
                <label className="form-check-label">
                  System Role
                </label>
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
