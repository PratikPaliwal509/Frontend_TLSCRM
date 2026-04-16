import React from 'react';

const RolesEditContent = ({
  formData,
  permissionPages,
  onChange,
  onToggleAction,
  onViewScopeChange,
}) => {

  // ✅ CHECK APPLICATION ENABLED
  const isApplicationEnabled = formData.permissions?.applications?.view === true;

  // ✅ DISABLE LOGIC
  const isDisabled = (pageKey) => {
    // 🔒 Authentication always disabled
    if (pageKey === "authentication") return true;

    // ❌ Disable child modules if applications is OFF
    if (
      ["tasks", "notes", "timelogs", "storage"].includes(pageKey) &&
      !isApplicationEnabled
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="card w-100">
      <div className="card-body">

        {/* ROLE NAME */}
        <div className="mb-4">
          <label className="form-label">Role Name</label>
          <input
            className="form-control"
            value={formData.role_name}
            onChange={e => onChange('role_name', e.target.value)}
          />
        </div>

        {/* ROLE DESCRIPTION */}
        <div className="mb-5">
          <label className="form-label">Role Description</label>
          <textarea
            className="form-control"
            rows={4}
            value={formData.role_description}
            onChange={e => onChange('role_description', e.target.value)}
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
                if (action === 'view' && page.viewScopes) return null;

                return (
                  <div className="form-check" key={action}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.permissions?.[page.key]?.[action] || false}
                      onChange={() => onToggleAction(page.key, action)}
                      disabled={isDisabled(page.key)}
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
                  value={formData.permissions?.[page.key]?.view || ''}
                  onChange={e => onViewScopeChange(page.key, e.target.value)}
                  disabled={isDisabled(page.key)}
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

        {/* SYSTEM ROLE SWITCH */}
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            checked={formData.is_system_role}
            onChange={() => onChange('is_system_role', !formData.is_system_role)}
          />
          <label className="form-check-label">
            Mark as System Role
          </label>
          <div className="fs-12 text-muted">
            System roles cannot be deleted
          </div>
        </div>

      </div>
    </div>
  );
};

export default RolesEditContent;