import React from 'react';

const RolesViewContent = ({ role }) => {
  const permissionPages = [
    'dashboard',
    'users',
    'clients',
    'projects',
    'tasks',
    'teams',
    'departments',
    'roles',
  ];

  const getAction = (page, action) => role.permissions?.[page]?.[action] || false;
  const getViewScope = page => role.permissions?.[page]?.view || '-';

  return (
    <div className="card w-100">
      <div className="card-body">

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="form-label">Role Description</label>
          <div className="form-control bg-light" style={{ minHeight: '90px', whiteSpace: 'pre-wrap' }}>
            {role.role_description || '-'}
          </div>
        </div>

        {/* PERMISSIONS */}
        <h5 className="fw-bold mb-3">Permissions</h5>
        {permissionPages.map(page => (
          <div key={page} className="border rounded p-3 mb-3">
            <div className="fw-semibold mb-2">{page.charAt(0).toUpperCase() + page.slice(1)}</div>

            {/* ACTIONS */}
            <div className="d-flex flex-wrap gap-3 mb-2">
              {['view', 'create', 'edit', 'delete', 'assign'].map(action => {
                if (action === 'view' && ['clients','projects','teams','departments'].includes(page)) return null;
                return (
                  <div className="form-check" key={action}>
                    <input type="checkbox" className="form-check-input" checked={getAction(page, action)} readOnly />
                    <label className="form-check-label text-capitalize">{action}</label>
                  </div>
                );
              })}
            </div>

            {/* VIEW SCOPE */}
            {['clients','projects','teams','departments'].includes(page) && (
              <div className="mt-2">
                <label className="form-label fs-12 text-muted">View Access Scope</label>
                <div className="form-control bg-light">{getViewScope(page).toUpperCase()}</div>
              </div>
            )}
          </div>
        ))}

        {/* SYSTEM ROLE */}
        <div className="form-check form-switch mt-4">
          <input className="form-check-input" type="checkbox" checked={role.is_system_role} readOnly />
          <label className="form-check-label">System Role</label>
          <div className="fs-12 text-muted">System roles cannot be deleted</div>
        </div>
      </div>
    </div>
  );
};

export default RolesViewContent;
