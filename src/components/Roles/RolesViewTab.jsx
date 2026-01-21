import React from 'react';

const RolesViewTab = ({ role }) => {
  return (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item">
        <span className="nav-link active">Details</span>
      </li>
      {/* You can add other tabs like "History", "Assigned Users" */}
    </ul>
  );
};

export default RolesViewTab;
