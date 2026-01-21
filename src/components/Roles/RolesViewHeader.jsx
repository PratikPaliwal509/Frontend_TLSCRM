import React from 'react';

const RolesViewHeader = ({ role }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="fw-bold">{role.role_name}</h4>
      <span className="badge bg-secondary p-2 m-2">
        {role.is_system_role ? 'System Role' : 'Custom Role'}
      </span>
    </div>
  );
};

export default RolesViewHeader;
